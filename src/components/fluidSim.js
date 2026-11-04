/*
 * A picture under water, in WebGL2. Two things move on a small grid of their own,
 * however big the picture is:
 *
 *   velocity   Navier-Stokes, the usual stable-fluids steps: carried along by
 *              itself, then made divergence-free with a pressure solve
 *   height     the surface: carried along by the velocity, and a wave equation of
 *              its own, which is what spreads a touch out into rings
 *
 * Then the picture is drawn through them: the surface's slope and the flow bend
 * where it is sampled, a little differently for red, green and blue, and light
 * catches the slope. On flat water all of that comes to nothing, so at rest it
 * is the picture itself.
 *
 * `createFluidSim` is null where the browser can't do this.
 */

// The grid's long side, in cells.
const GRID_CELLS = 128;
const PRESSURE_ITERATIONS = 20;
// The simulation runs at this rate whatever the screen's is.
const STEP_SECONDS = 1 / 60;

const VELOCITY_KEPT = 0.985;
// Each step's share of the wave's speed and height kept: how soon it dies away.
const WAVE_SPEED_KEPT = 0.985;
const WAVE_HEIGHT_KEPT = 0.995;
// Above about 0.5 the wave equation blows up on this grid.
const WAVE_STIFFNESS = 0.25;

// A touch's reach, as a share of the box's height, squared.
const SPLAT_RADIUS = 0.0012;
const SPLAT_FORCE = 30;
const SPLAT_HEIGHT = 8;
const SPLAT_HEIGHT_MAX = 0.6;

const VERTEX = `#version 300 es
out vec2 vUv;
void main() {
  vUv = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(vUv * 2.0 - 1.0, 0.0, 1.0);
}`;

const fragment = (body) => `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 color;
${body}`;

const ADVECT = fragment(`
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uKept;
void main() {
  vec2 from = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  color = uKept * texture(uSource, from);
}`);

const SPLAT = fragment(`
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec2 uAmount;
uniform float uAspect;
uniform float uRadius;
void main() {
  vec2 away = vUv - uPoint;
  away.x *= uAspect;
  color = texture(uTarget, vUv) + vec4(uAmount * exp(-dot(away, away) / uRadius), 0.0, 0.0);
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

// x is the surface's height and y how fast it is moving.
const WAVE = fragment(`
uniform sampler2D uHeight;
uniform vec2 uTexel;
uniform float uStiffness;
uniform float uSpeedKept;
uniform float uHeightKept;
void main() {
  vec2 here = texture(uHeight, vUv).xy;
  float around = texture(uHeight, vUv - vec2(uTexel.x, 0.0)).x
    + texture(uHeight, vUv + vec2(uTexel.x, 0.0)).x
    + texture(uHeight, vUv - vec2(0.0, uTexel.y)).x
    + texture(uHeight, vUv + vec2(0.0, uTexel.y)).x;
  float speed = (here.y + (around - 4.0 * here.x) * uStiffness) * uSpeedKept;
  color = vec4((here.x + speed) * uHeightKept, speed, 0.0, 1.0);
}`);

const PICTURE = fragment(`
uniform sampler2D uPicture;
uniform sampler2D uHeight;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
uniform vec2 uCoverScale;
uniform vec2 uCoverOffset;

const float REFRACTION = 0.16;
const float FLOW = 0.00008;
const float ABERRATION = 0.18;
const float NORMAL_DEPTH = 5.0;
const vec3 HALFWAY = normalize(normalize(vec3(-0.5, 0.6, 0.6)) + vec3(0.0, 0.0, 1.0));

vec4 picture(vec2 uv) {
  return texture(uPicture, uCoverOffset + clamp(uv, 0.0, 1.0) * uCoverScale);
}

void main() {
  vec2 slope = vec2(
    texture(uHeight, vUv + vec2(uTexel.x, 0.0)).x - texture(uHeight, vUv - vec2(uTexel.x, 0.0)).x,
    texture(uHeight, vUv + vec2(0.0, uTexel.y)).x - texture(uHeight, vUv - vec2(0.0, uTexel.y)).x
  );
  vec2 bend = slope * REFRACTION + texture(uVelocity, vUv).xy * FLOW;

  vec4 straight = picture(vUv + bend);
  float red = picture(vUv + bend * (1.0 - ABERRATION)).r;
  float blue = picture(vUv + bend * (1.0 + ABERRATION)).b;

  vec3 normal = normalize(vec3(-slope * NORMAL_DEPTH, 1.0));
  float highlight = pow(max(dot(normal, HALFWAY), 0.0), 90.0) * straight.a;

  color = vec4(vec3(red, straight.g, blue) + highlight, straight.a);
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

// A grid to draw into. Null where this browser can't.
const field = (gl, width, height) => {
  const texture = gl.createTexture();
  const buffer = gl.createFramebuffer();

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return { texture, buffer };
};

// One to read and one to write, swapped after each pass.
const doubleField = (gl, width, height) => {
  const first = field(gl, width, height);
  const second = field(gl, width, height);

  if (!first || !second) return null;

  return {
    read: first,
    write: second,
    swap() {
      [this.read, this.write] = [this.write, this.read];
    },
  };
};

const upload = (gl, image) => {
  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return gl.getError() === gl.NO_ERROR ? texture : null;
};

/*
 * `position` is object-position as shares, from the left and from the top, so
 * that the picture is cut as the <img> under it is by object-fit: cover.
 */
export default function createFluidSim(canvas, image, position = { x: 0.5, y: 0.5 }) {
  const gl = canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false });

  if (!gl) return null;

  if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) return null;

  const programs = {
    advect: program(gl, ADVECT),
    splat: program(gl, SPLAT),
    divergence: program(gl, DIVERGENCE),
    pressure: program(gl, PRESSURE),
    gradient: program(gl, GRADIENT),
    wave: program(gl, WAVE),
    picture: program(gl, PICTURE),
  };

  if (Object.values(programs).some((made) => !made)) return null;

  const picture = upload(gl, image);

  if (!picture) return null;

  const boxAspect = canvas.clientWidth / canvas.clientHeight || 1;
  const gridWidth = Math.max(2, Math.round(boxAspect >= 1 ? GRID_CELLS : GRID_CELLS * boxAspect));
  const gridHeight = Math.max(2, Math.round(boxAspect >= 1 ? GRID_CELLS / boxAspect : GRID_CELLS));
  const texel = [1 / gridWidth, 1 / gridHeight];

  const velocity = doubleField(gl, gridWidth, gridHeight);
  const height = doubleField(gl, gridWidth, gridHeight);
  const pressure = doubleField(gl, gridWidth, gridHeight);
  const divergence = field(gl, gridWidth, gridHeight);

  if (!velocity || !height || !pressure || !divergence) return null;

  let splats = [];

  const use = ({ made, uniforms }, values = {}) => {
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
    gl.bindFramebuffer(gl.FRAMEBUFFER, target?.buffer ?? null);
    if (target) gl.viewport(0, 0, gridWidth, gridHeight);
    else gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const splatInto = (target, point, amount) => {
    use(programs.splat, {
      uTarget: target.read.texture,
      uPoint: point,
      uAmount: amount,
      uAspect: boxAspect,
      uRadius: SPLAT_RADIUS,
    });
    drawInto(target.write);
    target.swap();
  };

  const step = () => {
    splats.forEach(({ point, force, press }) => {
      splatInto(velocity, point, force);
      splatInto(height, point, [press, 0]);
    });
    splats = [];

    use(programs.advect, {
      uVelocity: velocity.read.texture,
      uSource: velocity.read.texture,
      uTexel: texel,
      uDt: STEP_SECONDS,
      uKept: VELOCITY_KEPT,
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
      uSource: height.read.texture,
      uTexel: texel,
      uDt: STEP_SECONDS,
      uKept: 1,
    });
    drawInto(height.write);
    height.swap();

    use(programs.wave, {
      uHeight: height.read.texture,
      uTexel: texel,
      uStiffness: WAVE_STIFFNESS,
      uSpeedKept: WAVE_SPEED_KEPT,
      uHeightKept: WAVE_HEIGHT_KEPT,
    });
    drawInto(height.write);
    height.swap();
  };

  // What of the picture the box shows, and from where, as shares of the picture.
  const cover = () => {
    const imageAspect = (image.naturalWidth || 1) / (image.naturalHeight || 1);
    const aspect = canvas.width / canvas.height;
    const scale = imageAspect > aspect ? [aspect / imageAspect, 1] : [1, imageAspect / aspect];

    return {
      uCoverScale: scale,
      // From the bottom, as the texture's y is, where the position's is from the top.
      uCoverOffset: [(1 - scale[0]) * position.x, (1 - scale[1]) * (1 - position.y)],
    };
  };

  const render = () => {
    use(programs.picture, {
      uPicture: picture,
      uHeight: height.read.texture,
      uVelocity: velocity.read.texture,
      uTexel: texel,
      ...cover(),
    });
    drawInto(null);
  };

  return {
    STEP_SECONDS,

    // Fits the drawing to the box's size on screen.
    resize(pixelRatio) {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
    },

    // A touch at (x, y) moving by (dx, dy), all as shares of the box from its top left.
    splat(x, y, dx, dy) {
      const moved = Math.hypot(dx, dy);

      splats.push({
        point: [x, 1 - y],
        force: [dx * gridWidth * SPLAT_FORCE, -dy * gridHeight * SPLAT_FORCE],
        press: -Math.min(SPLAT_HEIGHT_MAX, moved * SPLAT_HEIGHT + 0.05),
      });
    },

    step,
    render,

    // Flat water, so that what is drawn next is exactly the picture.
    settle() {
      [velocity.read, velocity.write, height.read, height.write, pressure.read, pressure.write].forEach((target) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.buffer);
        gl.clear(gl.COLOR_BUFFER_BIT);
      });
      splats = [];
    },

    // Browsers allow only so many contexts at once, so this one is handed back.
    destroy() {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
