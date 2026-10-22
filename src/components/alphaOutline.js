/*
 * The shape an image actually draws, as something a physics engine can hold.
 *
 * A picture on a page is a rectangle whatever is inside it, and for most of
 * them that is close enough to the truth to collide against. For a few it is
 * not: a star is a fifth ink and four fifths corner, and a pile of logos
 * resting on its bounding box rests on nothing, floating in the gaps between
 * its arms. This reads the alpha channel and gives back the outline the eye
 * sees, cut into triangles so that an engine which only understands convex
 * shapes can be handed a concave one.
 *
 * Everything here is in the image's own box, as fractions of it: x and y from
 * 0 to 1 across and down the file. The caller scales that to whatever size the
 * element happens to be drawn at, which means a responsive image needs no
 * remeasuring - the outline of a star is the same outline at any size.
 *
 * Three steps, each a well-known one. Walk the edge of the opaque region a
 * pixel at a time (Moore tracing); throw away the points that lie on a line
 * their neighbours already describe (Ramer-Douglas-Peucker); cut what is left
 * into triangles (ear clipping). The first gives a true but absurdly detailed
 * outline - one point per boundary pixel - and the second is what makes it
 * affordable, because the cost downstream is per vertex and a twenty-sided
 * star is indistinguishable from a four-hundred-sided one once it is a few
 * hundred pixels wide.
 */

/*
 * How big to sample the image.
 *
 * The trace does not need the file's own resolution and is much slower at it:
 * the boundary of a 700px star is three thousand pixels long. At this size it
 * is a few hundred, the simplifier reduces either to the same handful of
 * corners, and the error introduced is under a pixel once the result is drawn
 * at the sizes this is used at.
 */
const SAMPLE = 140;
/* Anything but the faintest edge of the anti-aliasing, matching the ink
   measurement the logos themselves are sized by. */
const OPAQUE = 12;
/*
 * How many corners the outline is allowed to keep.
 *
 * A five-pointed star needs ten and a rounded one a few more, so this is
 * generous rather than tight; it exists to stop a ragged or feathered image
 * turning into a hundred-part body. The tolerance is loosened until the count
 * comes under it, so a shape that is genuinely complicated is simplified
 * harder rather than refused.
 */
const MAX_POINTS = 28;
const START_TOLERANCE = 0.8;

/* Clockwise from the right, in a y-down image. */
const NEIGHBOURS = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

/*
 * The edge of the opaque region, one pixel at a time.
 *
 * Moore tracing: stand on a boundary pixel, look around it in a circle
 * starting from where you came in, and step onto the first opaque pixel you
 * find. Starting from the topmost-leftmost pixel of the image guarantees
 * starting on the boundary, and the walk closes on itself.
 *
 * Only the first opaque region is followed. An image whose ink comes in
 * several pieces gives the outline of one of them, which is why this is opt-in
 * per image rather than something done to everything.
 */
const traceBoundary = (opaque, width, height) => {
  const first = opaque.indexOf(1);

  if (first < 0) {
    return null;
  }

  const startX = first % width;
  const startY = Math.floor(first / width);
  const filled = (x, y) => x >= 0 && y >= 0 && x < width && y < height && opaque[y * width + x];
  const path = [{ x: startX, y: startY }];
  let x = startX;
  let y = startY;
  /* Where we came from: nothing, so pretend it was the pixel to the left -
     the scan above has already proved there is none. */
  let from = 4;

  for (let guard = width * height * 4; guard > 0; guard -= 1) {
    let stepped = false;

    for (let turn = 1; turn <= 8; turn += 1) {
      const direction = (from + turn) % 8;
      const nextX = x + NEIGHBOURS[direction][0];
      const nextY = y + NEIGHBOURS[direction][1];

      if (filled(nextX, nextY)) {
        /* Come in facing back the way we came, so the sweep starts against
           the inside of the shape and hugs the edge rather than cutting
           across it. */
        from = (direction + 4) % 8;
        x = nextX;
        y = nextY;
        stepped = true;
        break;
      }
    }

    /* A single pixel with nothing around it, or back at the beginning. */
    if (!stepped || (x === startX && y === startY)) {
      break;
    }

    path.push({ x, y });
  }

  return path.length > 2 ? path : null;
};

const distanceToLine = (point, start, end) => {
  const runX = end.x - start.x;
  const runY = end.y - start.y;
  const length = Math.hypot(runX, runY);

  if (length < 1e-6) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  return Math.abs(runY * (point.x - start.x) - runX * (point.y - start.y)) / length;
};

/* Ramer-Douglas-Peucker over an open run of points: keep the one furthest
   from the line between the ends if it is further off than the tolerance,
   and recurse into the two halves it makes. */
const simplifyRun = (points, tolerance, out) => {
  let worst = 0;
  let at = 0;

  for (let index = 1; index < points.length - 1; index += 1) {
    const away = distanceToLine(points[index], points[0], points[points.length - 1]);

    if (away > worst) {
      worst = away;
      at = index;
    }
  }

  if (worst > tolerance) {
    simplifyRun(points.slice(0, at + 1), tolerance, out);
    simplifyRun(points.slice(at), tolerance, out);

    return;
  }

  out.push(points[0]);
};

/*
 * The same, for a loop.
 *
 * A closed path has no ends to anchor to, and picking the first point and its
 * neighbour as the two ends puts an arbitrary seam in an arbitrary place -
 * often mid-edge, where it leaves a kink. Cutting the loop at its two furthest
 * apart points instead puts both anchors on real corners.
 */
const simplifyLoop = (points, tolerance) => {
  let far = 0;
  let at = 0;

  for (let index = 1; index < points.length; index += 1) {
    const away = Math.hypot(points[index].x - points[0].x, points[index].y - points[0].y);

    if (away > far) {
      far = away;
      at = index;
    }
  }

  const out = [];

  simplifyRun(points.slice(0, at + 1), tolerance, out);
  simplifyRun(points.slice(at).concat([points[0]]), tolerance, out);

  return out;
};

const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

const signedArea = (points) => {
  let total = 0;

  for (let index = 0; index < points.length; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];

    total += a.x * b.y - b.x * a.y;
  }

  return total / 2;
};

const inside = (point, a, b, c) =>
  cross(a, b, point) >= 0 && cross(b, c, point) >= 0 && cross(c, a, point) >= 0;

/*
 * A concave polygon as a set of triangles.
 *
 * Ear clipping: find three neighbouring corners that turn the right way and
 * have no other corner inside the triangle they make, cut that triangle off,
 * and go round again with one fewer corner. It is the slow textbook method,
 * which at a couple of dozen corners measured once per image is free, and it
 * has the property that matters here - the pieces tile the shape exactly and
 * never spill outside it, so nothing is made bigger than it looks.
 */
const earClip = (polygon) => {
  const points = signedArea(polygon) < 0 ? polygon.slice().reverse() : polygon.slice();
  const triangles = [];

  for (let guard = points.length * points.length; points.length > 3 && guard > 0; guard -= 1) {
    let clipped = false;

    for (let index = 0; index < points.length; index += 1) {
      const a = points[(index + points.length - 1) % points.length];
      const b = points[index];
      const c = points[(index + 1) % points.length];

      /* Turning the wrong way: a dent in the outline, not a corner to cut. */
      if (cross(a, b, c) <= 0) {
        continue;
      }

      const clear = points.every(
        (other) => other === a || other === b || other === c || !inside(other, a, b, c),
      );

      if (!clear) {
        continue;
      }

      triangles.push([a, b, c]);
      points.splice(index, 1);
      clipped = true;
      break;
    }

    /* No ear anywhere: the outline has crossed itself somewhere, which the
       trace should not produce. Keep what has been cut so far. */
    if (!clipped) {
      break;
    }
  }

  if (points.length === 3) {
    triangles.push([points[0], points[1], points[2]]);
  }

  return triangles;
};

/*
 * The outline of one image, as triangles in its own box.
 *
 * Same origin, so the canvas does not taint, and it is the file the browser
 * has already fetched for the img tag that is being measured. Anything that
 * goes wrong - a missing file, a tainted canvas, an image with no ink in it -
 * resolves to null, and the caller falls back to the rectangle.
 */
export const measureOutline = (src) =>
  new Promise((resolve) => {
    const image = new window.Image();

    image.onload = () => {
      const naturalWidth = image.naturalWidth || 1;
      const naturalHeight = image.naturalHeight || 1;
      const scale = Math.min(1, SAMPLE / Math.max(naturalWidth, naturalHeight));
      const width = Math.max(1, Math.round(naturalWidth * scale));
      const height = Math.max(1, Math.round(naturalHeight * scale));
      const canvas = document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d', { willReadFrequently: true });

      context.drawImage(image, 0, 0, width, height);

      try {
        const { data } = context.getImageData(0, 0, width, height);
        const opaque = new Uint8Array(width * height);

        for (let index = 0; index < opaque.length; index += 1) {
          opaque[index] = data[index * 4 + 3] > OPAQUE ? 1 : 0;
        }

        const boundary = traceBoundary(opaque, width, height);

        if (!boundary) {
          resolve(null);

          return;
        }

        let simplified = boundary;

        for (
          let tolerance = START_TOLERANCE;
          tolerance < Math.max(width, height);
          tolerance *= 1.6
        ) {
          simplified = simplifyLoop(boundary, tolerance);

          if (simplified.length <= MAX_POINTS) {
            break;
          }
        }

        if (simplified.length < 3) {
          resolve(null);

          return;
        }

        /* Pixel centres, as fractions of the file. */
        const unit = simplified.map((point) => ({
          x: (point.x + 0.5) / width,
          y: (point.y + 0.5) / height,
        }));
        const triangles = earClip(unit);

        resolve(triangles.length ? triangles : null);
      } catch {
        /* A tainted canvas. */
        resolve(null);
      }
    };

    image.onerror = () => resolve(null);
    image.src = src;
  });
