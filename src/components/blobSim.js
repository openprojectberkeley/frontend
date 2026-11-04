/*
 * A liquid blob behind the title, in WebGL2: the same stable-fluids solver as
 * fluidSim, carrying colour instead of bending a picture.
 *
 *   velocity   Navier-Stokes on a small grid. The pointer pushes it, and because
 *              the pressure solve makes it divergence-free, pushes that meet
 *              combine and spill sideways instead of passing through each other
 *   dye        what the flow carries: red is how much is there, green how hot it
 *              is. Heat goes faster than the dye, so it cools as it thins
 *   stir       slow curl noise, only where there is dye, so the blob keeps
 *              churning into new shapes after the pointer has stopped
 *
 * The pointer feeds all of this along the whole of its path each frame, as a
 * capsule rather than a point, so there is nothing periodic in what it lays down.
 *
 * Then the dye is drawn as a mask: cut at a hard, noisy edge so it reads as liquid
 * rather than smoke, in blocks that divide the title's grid, with rippling
 * contours and grain inside it.
 *
 * `createBlobSim` is null where the browser can't do this.
 */

// The grid's long side, in cells.
const GRID_CELLS = 128;
const PRESSURE_ITERATIONS = 16;
const STEP_MS = 1000 / 60;
// The most steps a frame takes. After a stall it slows down rather than catching up.
const MAX_STEPS = 3;

/*
 *   BLOCK             the size of one block of the mask, in canvas pixels
 *   VELOCITY_KEPT     each step's share of the flow kept: how soon it calms down
 *   DYE_KEPT          the same for the dye, then its heat
 *   DYE_LOSS          taken off the dye each step as well, so it ends rather than
 *                     only ever getting fainter
 *   DYE_RATE          how much dye the pointer lays down, per ms
 *   PUSH              how much of the pointer's own speed the flow takes on. Well
 *                     under 1, because gas lags what stirred it
 *   MIN_RADIUS        how wide the pointer's path is at the slowest, in px
 *   RADIUS            how wide at full speed, in px
 *   PUSH_RADIUS       how much wider the push is than the dye, so that the flow
 *                     reaches past the edge of the blob and carries it outward
 *   STIR              how hard the curl noise churns the flow, in cells per s²
 *   RISE              how hard heat lifts it, in cells per s²
 *   LINGER            how long after the last feed the simulation keeps running,
 *                     in ms. Long enough for the thickest dye to be gone
 */
const BLOCK = 5;
const VELOCITY_KEPT = 0.985;
const DYE_KEPT = [0.976, 0.962];
const DYE_LOSS = 0.0012;
const DYE_RATE = 0.0062;
const PUSH = 0.42;
const MIN_RADIUS = 16;
const RADIUS = 58;
const PUSH_RADIUS = 1.5;
const STIR = 340;
const RISE = 26;
const LINGER = 1800;

const VERTEX = `#version 300 es
out vec2 vUv;
void main() {
  vUv = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(vUv * 2.0 - 1.0, 0.0, 1.0);
}`;

const NOISE = `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  return 0.55 * noise(p) + 0.3 * noise(p * 2.1 + 17.0) + 0.15 * noise(p * 4.3 + 31.0);
}`;

const fragment = (body) => `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 color;
${NOISE}
${body}`;

const ADVECT = fragment(`
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform vec2 uKept;
uniform float uLoss;
void main() {
  vec2 from = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  vec2 kept = uKept * texture(uSource, from).xy;
  if (uLoss > 0.0) kept = max(kept - uLoss, 0.0);
  color = vec4(kept, 0.0, 1.0);
}`);

// The pointer's whole path this frame, as a capsule with a noisy width and strength.
const FEED = fragment(`
uniform sampler2D uTarget;
uniform vec2 uTexel;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform vec2 uAmount;
uniform float uRadius;
uniform float uSteer;
uniform float uSeed;
void main() {
  vec2 p = vUv / uTexel;
  vec2 along = uTo - uFrom;
  float h = clamp(dot(p - uFrom, along) / max(dot(along, along), 0.0001), 0.0, 1.0);
  vec2 q = p - uFrom - along * h;
  float wide = uRadius * (0.5 + 1.0 * noise(p * 0.11 + uSeed));
  float g = exp(-dot(q, q) / (wide * wide)) * (0.45 + 1.1 * noise(p * 0.29 - uSeed * 1.7));
  vec2 here = texture(uTarget, vUv).xy;
  vec2 next = uSteer > 0.5 ? here + (uAmount - here) * min(g, 1.0) : min(here + uAmount * g, vec2(1.6, 1.0));
  color = vec4(next, 0.0, 1.0);
}`);

const STIRRED = fragment(`
uniform sampler2D uVelocity;
uniform sampler2D uDye;
uniform vec2 uTexel;
uniform float uDt;
uniform float uTime;
uniform float uStir;
uniform float uRise;
float field(vec2 p) {
  return fbm(p * 0.075 + vec2(uTime * 0.21, -uTime * 0.17));
}
void main() {
  vec2 p = vUv / uTexel;
  vec2 dye = texture(uDye, vUv).xy;
  vec2 curl = vec2(field(p + vec2(0.0, 1.0)) - field(p - vec2(0.0, 1.0)), field(p - vec2(1.0, 0.0)) - field(p + vec2(1.0, 0.0)));
  vec2 force = curl * uStir * smoothstep(0.01, 0.3, dye.x) + vec2(0.0, uRise * dye.y);
  color = vec4(texture(uVelocity, vUv).xy + force * uDt, 0.0, 1.0);
}`);

const DIVERGENCE = fragment(`
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float l = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float t = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
  color = vec4(0.5 * (r - l + t - b), 0.0, 0.0, 1.0);
}`);

const PRESSURE = fragment(`
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
void main() {
  float l = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  color = vec4(0.25 * (l + r + b + t - texture(uDivergence, vUv).x), 0.0, 0.0, 1.0);
}`);

const GRADIENT = fragment(`
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float l = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  color = vec4(texture(uVelocity, vUv).xy - 0.5 * vec2(r - l, t - b), 0.0, 1.0);
}`);

/*
 * The mask. A block samples the dye at its own middle, nudged by slow noise so
 * that the outline wanders. Past a hard edge it is solid: colour runs from hot to
 * cool with its heat and towards its rim, and rippling contours move through both.
 * The grain is per canvas pixel and new every frame.
 *
 * The colours are the bubbles', from hot to cool: yellow, orange, pink, violet, sky.
 */
const MASK = fragment(`
uniform sampler2D uDye;
uniform vec2 uSize;
uniform float uBlock;
uniform float uTime;

const float EDGE = 0.13;
const float ALPHA_THIN = 0.74;
const float ALPHA_THICK = 0.97;

vec3 heat(float t) {
  const vec3 stops[5] = vec3[5](
    vec3(0.976, 0.847, 0.365),
    vec3(1.0, 0.569, 0.055),
    vec3(0.922, 0.314, 0.631),
    vec3(0.561, 0.294, 0.91),
    vec3(0.369, 0.784, 1.0)
  );
  float place = clamp(t, 0.0, 1.0) * 4.0;
  int low = int(min(floor(place), 3.0));
  return mix(stops[low], stops[low + 1], place - float(low));
}

void main() {
  /* Whole blocks from the top left, as the title's grid is laid. */
  vec2 fromTop = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y);
  vec2 block = (floor(fromTop / uBlock) + 0.5) * uBlock;
  vec2 uv = vec2(block.x, uSize.y - block.y) / uSize;
  vec2 scaled = block / uBlock;

  float wander = fbm(scaled * 0.07 + vec2(uTime * 0.13, uTime * 0.09));
  float wander2 = fbm(scaled * 0.07 + vec2(-uTime * 0.11, uTime * 0.15) + 9.0);
  vec2 dye = texture(uDye, uv + (vec2(wander, wander2) - 0.5) * 0.028).xy;

  /* The edge itself is noisy, more finely than the wander, so it isn't a contour
     of something smooth. */
  float rough = fbm(scaled * 0.31 + uTime * 0.2) - 0.5;
  float body = dye.x + rough * 0.13 * smoothstep(0.0, 0.3, dye.x);

  if (body < EDGE) {
    color = vec4(0.0);
    return;
  }

  float depth = smoothstep(EDGE, 0.75, body);
  float ripple = sin(body * 15.0 + wander * 9.0 - uTime * 1.9);
  float cool = (1.0 - dye.y) * 0.72 + (1.0 - depth) * 0.28 + ripple * 0.075;
  float grain = hash(gl_FragCoord.xy + fract(uTime) * 91.0);
  vec3 tone = heat(cool) * (0.86 + 0.09 * ripple + 0.14 * grain);
  float alpha = mix(ALPHA_THIN, ALPHA_THICK, depth);

  color = vec4(tone * alpha, alpha);
}`);

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

const program = (gl, fragmentSource) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const frag = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertex || !frag) return null;

  const made = gl.createProgram();

  gl.attachShader(made, vertex);
  gl.attachShader(made, frag);
  gl.linkProgram(made);

  if (!gl.getProgramParameter(made, gl.LINK_STATUS)) return null;

  const count = gl.getProgramParameter(made, gl.ACTIVE_UNIFORMS);
  const uniforms = {};

  for (let index = 0; index < count; index += 1) {
    const { name } = gl.getActiveUniform(made, index);

    uniforms[name] = gl.getUniformLocation(made, name);
  }

  return { made, uniforms };
};

const makeField = (gl, width, height) => {
  const texture = gl.createTexture();
  const buffer = gl.createFramebuffer();

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, width, height, 0, gl.RG, gl.HALF_FLOAT, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return { texture, buffer };
};

const makeDouble = (gl, width, height) => {
  const first = makeField(gl, width, height);
  const second = makeField(gl, width, height);

  if (!first || !second) return null;

  return {
    read: first,
    write: second,
    swap() {
      [this.read, this.write] = [this.write, this.read];
    },
  };
};

export default function createBlobSim(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false });

  if (!gl) return null;

  if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) return null;

  const programs = {
    advect: program(gl, ADVECT),
    feed: program(gl, FEED),
    stirred: program(gl, STIRRED),
    divergence: program(gl, DIVERGENCE),
    pressure: program(gl, PRESSURE),
    gradient: program(gl, GRADIENT),
    mask: program(gl, MASK),
  };

  if (Object.values(programs).some((made) => !made)) return null;

  gl.disable(gl.BLEND);

  let gridWidth = 0;
  let gridHeight = 0;
  let cell = 1;
  let texel = [1, 1];
  let velocity = null;
  let dye = null;
  let pressure = null;
  let divergence = null;
  let stageWidth = 0;
  let stageHeight = 0;
  let last = null;
  let lastFed = null;

  const use = ({ made, uniforms }, values) => {
    gl.useProgram(made);

    let unit = 0;

    Object.entries(values).forEach(([name, value]) => {
      const location = uniforms[name];

      if (location === undefined) return;

      if (value instanceof WebGLTexture) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, value);
        gl.uniform1i(location, unit);
        unit += 1;
      } else if (Array.isArray(value)) {
        gl.uniform2fv(location, value);
      } else {
        gl.uniform1f(location, value);
      }
    });
  };

  const drawInto = (target) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.buffer : null);
    if (target) gl.viewport(0, 0, gridWidth, gridHeight);
    else gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const step = (now) => {
    const dt = STEP_MS / 1000;
    const time = (now / 1000) % 1000;

    use(programs.stirred, {
      uVelocity: velocity.read.texture,
      uDye: dye.read.texture,
      uTexel: texel,
      uDt: dt,
      uTime: time,
      uStir: STIR,
      uRise: RISE,
    });
    drawInto(velocity.write);
    velocity.swap();

    use(programs.advect, {
      uVelocity: velocity.read.texture,
      uSource: velocity.read.texture,
      uTexel: texel,
      uDt: dt,
      uKept: [VELOCITY_KEPT, VELOCITY_KEPT],
      uLoss: 0,
    });
    drawInto(velocity.write);
    velocity.swap();

    use(programs.divergence, { uVelocity: velocity.read.texture, uTexel: texel });
    drawInto(divergence);

    for (let iteration = 0; iteration < PRESSURE_ITERATIONS; iteration += 1) {
      use(programs.pressure, {
        uPressure: pressure.read.texture,
        uDivergence: divergence.texture,
        uTexel: texel,
      });
      drawInto(pressure.write);
      pressure.swap();
    }

    use(programs.gradient, {
      uPressure: pressure.read.texture,
      uVelocity: velocity.read.texture,
      uTexel: texel,
    });
    drawInto(velocity.write);
    velocity.swap();

    use(programs.advect, {
      uVelocity: velocity.read.texture,
      uSource: dye.read.texture,
      uTexel: texel,
      uDt: dt,
      uKept: DYE_KEPT,
      uLoss: DYE_LOSS,
    });
    drawInto(dye.write);
    dye.swap();
  };

  const wipe = () => {
    [velocity, dye, pressure].forEach((target) => {
      if (!target) return;

      [target.read, target.write].forEach(({ buffer }) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
        gl.clear(gl.COLOR_BUFFER_BIT);
      });
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  return {
    /* Fits the grid and the drawing to the stage, in px. Starts flat if it changed. */
    resize(width, height, pixel) {
      if (width === stageWidth && height === stageHeight) return true;

      stageWidth = width;
      stageHeight = height;
      canvas.width = Math.max(1, Math.ceil(width / pixel));
      canvas.height = Math.max(1, Math.ceil(height / pixel));

      const long = Math.max(width, height, 1);

      cell = long / GRID_CELLS;
      gridWidth = Math.max(2, Math.round(width / cell));
      gridHeight = Math.max(2, Math.round(height / cell));
      texel = [1 / gridWidth, 1 / gridHeight];

      velocity = makeDouble(gl, gridWidth, gridHeight);
      dye = makeDouble(gl, gridWidth, gridHeight);
      pressure = makeDouble(gl, gridWidth, gridHeight);
      divergence = makeField(gl, gridWidth, gridHeight);

      return Boolean(velocity && dye && pressure && divergence);
    },

    /*
     * The pointer's path since the last frame, in px from the stage's top left.
     * `body` is 0 to 1 and sets how wide and how much dye goes down; `power` is 0
     * to 1 and sets how hard it pushes.
     */
    feed({ fromX, fromY, toX, toY, elapsed, body, power }, now) {
      const from = [fromX / cell, gridHeight - fromY / cell];
      const to = [toX / cell, gridHeight - toY / cell];
      const radius = (MIN_RADIUS + (RADIUS - MIN_RADIUS) * body) / cell;
      const seed = (now / 1000) % 100;
      const spent = Math.max(elapsed, 1);

      if (power > 0) {
        const scale = (PUSH * power * 1000) / (spent * cell);

        use(programs.feed, {
          uTarget: velocity.read.texture,
          uTexel: texel,
          uFrom: from,
          uTo: to,
          uAmount: [(toX - fromX) * scale, -(toY - fromY) * scale],
          uRadius: radius * PUSH_RADIUS,
          uSteer: 1,
          uSeed: seed,
        });
        drawInto(velocity.write);
        velocity.swap();
      }

      use(programs.feed, {
        uTarget: dye.read.texture,
        uTexel: texel,
        uFrom: from,
        uTo: to,
        uAmount: [DYE_RATE * elapsed * (0.35 + 0.65 * body), 0.09 * elapsed * DYE_RATE * 16],
        uRadius: radius,
        uSteer: 0,
        uSeed: seed + 40,
      });
      drawInto(dye.write);
      dye.swap();

      lastFed = now;
    },

    /* As many steps as the time since the last call has room for. */
    advance(now) {
      if (last === null) last = now - STEP_MS;

      const due = Math.floor((now - last) / STEP_MS);
      const steps = Math.min(due, MAX_STEPS);

      for (let count = 0; count < steps; count += 1) step(now);

      last = due > steps ? now : last + due * STEP_MS;
    },

    render(now) {
      use(programs.mask, {
        uDye: dye.read.texture,
        uSize: [canvas.width, canvas.height],
        uBlock: BLOCK,
        uTime: (now / 1000) % 1000,
      });
      drawInto(null);
    },

    /* Whether there can still be anything to see. */
    active: (now) => lastFed !== null && now - lastFed < LINGER,

    /* Empty, and nothing on the canvas. */
    clear() {
      last = null;
      lastFed = null;
      wipe();
    },
  };
}
