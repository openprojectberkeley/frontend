/*
 * The trail the pointer leaves, shared by everything that pixelates under it:
 * the community strip in scene five and the title in scene one. What is kept
 * here is only the trail itself - where it has been, how wide and how alive -
 * and which blocks of a grid it covers. What a covered block turns into is up
 * to whoever reads it.
 *
 *   TRAIL_LIFE        how long a point of it lasts, in ms
 *   TRAIL_MIN_RADIUS  how far a point reaches when the pointer has barely
 *                     moved, in px - about one block, so a nudge leaves a
 *                     square or two rather than a full blot
 *   TRAIL_RADIUS      how far it reaches at full stride, in px; every point
 *                     shrinks towards a third of its own reach as it ages
 *   TRAIL_FULL_SPEED  the pointer speed that earns the full reach, in px/ms
 *   TRAIL_RAMP        how long a stroke has to keep going before it can
 *                     reach that far, in ms, so even a flick starts thin
 *   TRAIL_PAUSE       a gap between mouse events longer than this, in ms,
 *                     ends the stroke and the next one starts thin again
 *   TRAIL_BLOCK       the size of one pixel of it, in px - roughly, since
 *                     each surface rounds it to whatever divides it into
 *                     whole blocks
 *   TRAIL_SPACING     the most distance a fast stroke leaves between two
 *                     points before the gap is filled in, in px
 *   TRAIL_STEPS       how many levels of opacity it fades out through - a
 *                     few, so it goes out in steps like the blocks it is
 *                     made of
 *   TRAIL_NOISE       how unevenly its blocks go out. Each block's life is
 *                     cut short by up to this share of it, by its own noise,
 *                     so the trail breaks up into scattered squares as it
 *                     fades instead of every block dimming in step
 */
export const TRAIL_LIFE = 700;
export const TRAIL_MIN_RADIUS = 14;
export const TRAIL_RADIUS = 80;
export const TRAIL_FULL_SPEED = 1.4;
export const TRAIL_RAMP = 450;
export const TRAIL_PAUSE = 150;
export const TRAIL_BLOCK = 20;
export const TRAIL_SPACING = 16;
export const TRAIL_STEPS = 4;
export const TRAIL_NOISE = 0.5;

export const clamp01 = (value) => Math.min(Math.max(value, 0), 1);
export const smoothstep = (value) => {
  const t = clamp01(value);

  return t * t * (3 - 2 * t);
};

/* A fixed 0-1 value for each block of each surface, so noise is the same
   pattern every time it is drawn rather than a new scatter each frame.
   `salt` keeps different uses' patterns apart. */
export const blockNoise = (index, column, row, salt) => {
  let h = Math.imul(index + 1, 374761393) ^ Math.imul(column + 1, 668265263);

  h ^= Math.imul(row + 1, 2246822519) ^ Math.imul(salt + 1, 3266489917);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;

  return (h >>> 0) / 4294967296;
};

/* A block's own life once its noise has cut it short, 0 to 1, from how
   alive the trail is over it. 0 is not drawn at all. */
export const blockLife = (trail, index, column, row) =>
  trail <= 0 ? 0 : clamp01((trail - blockNoise(index, column, row, 0) * TRAIL_NOISE) / (1 - TRAIL_NOISE));

/* What a block of that life is drawn at: stepped, so it goes out in jumps
   like the blocks it is made of. */
export const stepped = (life) => Math.ceil(life * TRAIL_STEPS) / TRAIL_STEPS;

export function createPixelTrail() {
  const points = [];
  let last = null;
  let strokeStart = 0;
  let speed = 0;

  /*
   * How far a new point reaches comes from the stroke so far, not from the
   * one event: the pointer's speed, smoothed so one jittery report cannot
   * throw out a blot, times how long the stroke has been going. Either one
   * alone gets it wrong - speed alone makes a flick fat from its first
   * pixel, and time alone makes a slow drift as wide as a sweep.
   */
  const reachFor = (now, distance, elapsed) => {
    if (!last || elapsed > TRAIL_PAUSE) {
      strokeStart = now;
      speed = 0;
    } else if (elapsed > 0) {
      const settle = 1 - Math.exp(-elapsed / 80);

      speed += (distance / elapsed - speed) * settle;
    }

    /* The root lifts the low end: an easy drift should widen a little, not
       sit at the minimum until the pointer is nearly at full speed. */
    const stride = smoothstep(Math.sqrt(speed / TRAIL_FULL_SPEED));
    const ramp = smoothstep((now - strokeStart) / TRAIL_RAMP);

    return TRAIL_MIN_RADIUS + (TRAIL_RADIUS - TRAIL_MIN_RADIUS) * stride * ramp;
  };

  return {
    /* A fast stroke reports points far apart, and drawn as they come the
       trail would be a row of separate dots. The gap is filled with points
       of the ages and reaches they would have had, so the stroke tapers
       along its length the way a slow one does. */
    add(x, y, now) {
      const distance = last ? Math.hypot(x - last.x, y - last.y) : 0;
      const elapsed = last ? now - last.t : Infinity;
      const reach = reachFor(now, distance, elapsed);

      if (last && elapsed <= TRAIL_PAUSE) {
        const steps = Math.floor(distance / TRAIL_SPACING);

        for (let step = 1; step < steps; step += 1) {
          const k = step / steps;

          points.push({
            x: last.x + (x - last.x) * k,
            y: last.y + (y - last.y) * k,
            t: last.t + (now - last.t) * k,
            reach: last.reach + (reach - last.reach) * k,
          });
        }
      }

      points.push({ x, y, t: now, reach });
      last = { x, y, t: now, reach };
    },

    /* Drops the points that have run out, and says whether any are left. */
    prune(now) {
      while (points.length && now - points[0].t > TRAIL_LIFE) points.shift();
      if (points.length === 0) last = null;

      return points.length > 0;
    },

    /* Coming back in somewhere else should not draw a streak from where the
       pointer went out. */
    lift() {
      last = null;
    },

    /* Which of a grid's blocks the trail covers, each as alive as the
       freshest point that reaches it, or null for none. A point counts for a
       block if the block's centre is within its reach, and always for the
       block it is in, or a point narrower than a block would fall between
       centres and leave nothing. Points that cannot reach the grid are
       passed over. */
    coverage(rect, columns, rows, now) {
      const blockWidth = rect.width / columns;
      const blockHeight = rect.height / rows;
      const lives = new Float32Array(columns * rows);
      let any = false;

      points.forEach(({ x, y, t, reach: radius }) => {
        const life = 1 - (now - t) / TRAIL_LIFE;
        const reach = radius * (0.35 + 0.65 * life);
        const localX = x - rect.left;
        const localY = y - rect.top;

        if (localX < -reach || localY < -reach) return;
        if (localX > rect.width + reach || localY > rect.height + reach) return;

        const homeColumn = Math.floor(localX / blockWidth);
        const homeRow = Math.floor(localY / blockHeight);
        const top = Math.max(0, Math.floor((localY - reach) / blockHeight));
        const bottom = Math.min(rows - 1, Math.floor((localY + reach) / blockHeight));
        const left = Math.max(0, Math.floor((localX - reach) / blockWidth));
        const right = Math.min(columns - 1, Math.floor((localX + reach) / blockWidth));

        for (let row = top; row <= bottom; row += 1) {
          for (let column = left; column <= right; column += 1) {
            const home = row === homeRow && column === homeColumn;
            const centreX = (column + 0.5) * blockWidth;
            const centreY = (row + 0.5) * blockHeight;

            if (!home && Math.hypot(centreX - localX, centreY - localY) > reach) continue;

            const key = row * columns + column;

            if (lives[key] < life) {
              lives[key] = life;
              any = true;
            }
          }
        }
      });

      return any ? lives : null;
    },
  };
}
