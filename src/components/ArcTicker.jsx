import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/* All in the arc's own viewBox units, so they hold whatever size it is drawn at. */
const LOGO_HEIGHT = 54;
const SPEED = 52;
/* The clear run between one logo and the next, against the height they share. */
const GAP_SHARE = 1.6;
/*
 * What the logos and the gaps between them are worth while the arc is still a
 * bowl, as shares of what they become once it is straight.
 *
 * Two floors and not one. A long wordmark is a straight rectangle laid across
 * a curve, so the tighter the bend the further its ends stand off the stroke -
 * which is the logos' reason for being smaller here and is no reason at all
 * for the gaps to be. Tying both to one number made the set either too loose
 * or too tight; letting the gaps keep more of themselves than the logos do
 * gives a bent band that is as legible as the straight one rather than one
 * that is simply the same thing shrunk.
 */
const GROW_FLOOR = 0.58;
const GAP_FLOOR = 0.75;

/*
 * The tallest bitmap a logo is drawn from, in device pixels. A row is never
 * much more than 150 of them tall even on a large high-density screen, and
 * some of the source files are over 1300: resampling those down on every frame,
 * twice over, is most of what drawing the rows costs.
 */
const BITMAP_MAX_HEIGHT = 320;

/*
 * Each logo at no more than BITMAP_MAX_HEIGHT, and the same again as a black
 * silhouette for the second paint of the row.
 *
 * The silhouette keeps the logo's alpha and drops its colour, which is what
 * filter: brightness(0) did - done once here instead of on every frame. If the
 * canvas will not hand the pixels back, the original file is used and the
 * filter is kept for that one logo.
 */
function prepare(image) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const scale = Math.min(1, BITMAP_MAX_HEIGHT / height);
  const canvas = document.createElement('canvas');

  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));

  const context = canvas.getContext('2d');
  context.imageSmoothingQuality = 'high';

  const toUrl = () =>
    new Promise((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(URL.createObjectURL(blob)) : reject()));
    });

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return toUrl().then((light) => {
    context.globalCompositeOperation = 'source-in';
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    return toUrl().then((dark) => ({ light, dark }));
  });
}

/*
 * A marquee of client logos riding the arc.
 *
 * Every position comes from the path itself - getPointAtLength for where a logo
 * sits and a sample just ahead of it for which way it leans - so the shape of
 * the arc is the only thing deciding the route. Redraw the path and the logos
 * follow it without a line changing here.
 *
 * Which is what lets the route bend while the ticker is running: the arc
 * straightens into a band under it, and because the length is taken afresh each
 * frame rather than once at the start, the logos spread out along the growing
 * line instead of bunching up in the piece of it that used to be the whole.
 *
 * The logos live inside the arc's own SVG, which is what keeps them on it for
 * free: the rotation, the scale and the travel are all on the SVG above them,
 * so none of it has to be reapplied or undone per logo.
 *
 * Height is what every logo is normalised on, and width is whatever its own
 * proportions then make it. A square box would have been the easy way and is
 * the wrong one: fitting a wordmark seven times wider than it is tall into a
 * square leaves it a seventh of the height of the roundel beside it, so the set
 * reads as a jumble of sizes rather than as one row. Giving them all the same
 * height instead costs only that they no longer sit on a regular pitch - which
 * is why the spacing below is cumulative rather than a fixed step.
 *
 * One instance is one row. A second instance on the same path, given the
 * opposite `direction` and the opposite `rowOffset`, is the row running the
 * other way beside it: both read the same geometry, so neither has to know the
 * shape and the two cannot come apart as it bends.
 *
 * Nothing fades at the ends. The band's own shape is the clip for everything
 * riding it, so a logo leaving simply slides out under the edge of the stroke
 * and is cut away by it - which is both why an opacity ramp is not needed and
 * why it would be wrong, since it would start dimming a logo that is still in
 * the middle of the band.
 *
 * It is a ticker and not a carousel on purpose. Nothing here can be clicked,
 * focused or dragged: the logos are decoration, so they are aria-hidden with
 * pointer events off and there are no controls to reach.
 */
export default function ArcTicker({
  pathRef,
  items,
  running,
  className,
  /*
   * Where to draw the row a second time, in black - an element somewhere else
   * in the same SVG, for whoever is clipping that copy. The copy is written by
   * the same loop with the same values as the row itself, so it cannot drift
   * out of step with it.
   *
   * Real nodes rather than a <use> of the row: a <use> mirrors every attribute
   * written to what it references, which here is every logo on every frame.
   */
  twinContainer,
  /* Across the stroke rather than along it, in viewBox units: the distance
     from the path's own line to the line this row rides. */
  rowOffset = 0,
  /* 1 travels the way the path is drawn, -1 against it. */
  direction = 1,
  height = LOGO_HEIGHT,
  /*
   * A ref holding how far the arc has straightened, 0 to 1, written by the
   * caller on every frame. A ref and not a prop: this changes with the scroll,
   * and a prop would be a React render per frame.
   */
  growRef,
  /*
   * How far past each end of the path the band still paints. The stroke has
   * round caps, so the ink runs on half a stroke-width beyond the last point -
   * and a logo out there is still over the band and still visible.
   */
  overhang = 0,
}) {
  const groupRef = useRef(null);
  const twinRef = useRef(null);
  /*
   * How wide each logo wants to be at the height they all share, which only the
   * file itself can say, and the bitmaps each row is drawn from. Decoded once:
   * the browser has these files cached already.
   */
  const [logos, setLogos] = useState(null);

  useEffect(() => {
    let live = true;
    const urls = [];

    Promise.all(
      items.map(
        (src) =>
          new Promise((resolve) => {
            const image = new window.Image();

            // A square is the least surprising fallback, and a logo that will
            // not decode is not going to be visible to be wrong about.
            image.onload = () => {
              const aspect = image.naturalHeight ? image.naturalWidth / image.naturalHeight : 1;
              prepare(image)
                .then(({ light, dark }) => {
                  urls.push(light, dark);
                  resolve({ aspect, light, dark, filtered: false });
                })
                .catch(() => resolve({ aspect, light: src, dark: src, filtered: true }));
            };
            image.onerror = () => resolve({ aspect: 1, light: src, dark: src, filtered: true });
            image.src = src;
          }),
      ),
    ).then((prepared) => {
      if (live) {
        setLogos(prepared);
      } else {
        urls.forEach((url) => URL.revokeObjectURL(url));
      }
    });

    return () => {
      live = false;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [items]);

  useEffect(() => {
    const path = pathRef.current;
    const group = groupRef.current;

    if (!path || !group || !running || !logos) {
      return undefined;
    }

    const nodes = Array.from(group.children);
    const count = nodes.length;
    const gap = height * GAP_SHARE;
    const widths = logos.map(({ aspect }) => height * aspect);

    /*
     * How much logo there is in front of each one. The train is laid out from
     * this per frame rather than once, because its two parts - the logos and
     * the gaps - no longer grow at the same rate, so the spacing cannot be a
     * fixed set of positions with one multiplier over it.
     */
    const widthBefore = [];
    let totalWidth = 0;

    widths.forEach((width) => {
      widthBefore.push(totalWidth);
      totalWidth += width;
    });

    /*
     * This frame's answer for each logo, worked out in full before any of it
     * is written. getPointAtLength brings layout up to date before it answers,
     * so a read after every write would lay the whole page out once per logo.
     */
    const transforms = new Array(count).fill(null);
    /* What each node was last told, so an unchanged opacity is not rewritten:
       it is a presentation attribute, and every write is a style recalc. */
    const shown = new Array(count).fill(false);
    const twinShown = new Array(count).fill(false);
    let lastTwins = null;

    let frame = null;
    let last = null;
    /*
     * Held as a share of the train rather than as a distance along it, because
     * the train is not always the same length: it shrinks with the logos while
     * the arc is still bent. A distance would send every logo backwards the
     * moment the train resized; a fraction of it rides the change.
     */
    let progress = 0;

    const place = (node, index, transform, seen) => {
      if (!node) {
        return;
      }

      const visible = transform !== null;

      if (seen[index] !== visible) {
        seen[index] = visible;
        node.setAttribute('opacity', visible ? '1' : '0');
      }

      if (visible) {
        node.setAttribute('transform', transform);
      }
    };

    const tick = (now) => {
      const elapsed = last === null ? 0 : (now - last) / 1000;
      last = now;

      const length = path.getTotalLength();

      /*
       * Where a logo sits and which way it leans, carrying straight on past
       * either end of the path rather than stopping at it.
       *
       * getPointAtLength clamps, so without this every logo that had run out
       * of path would stack up on the last point of it. Running the tangent on
       * instead lets them carry on out of the band, where the clip takes them
       * off - which is what leaving at the end looks like when nothing is
       * fading.
       */
      const sample = (d) => {
        if (d < 0) {
          const a = path.getPointAtLength(0);
          const b = path.getPointAtLength(1);
          return { x: a.x + (b.x - a.x) * d, y: a.y + (b.y - a.y) * d, tx: b.x - a.x, ty: b.y - a.y };
        }

        if (d >= length) {
          const a = path.getPointAtLength(length - 1);
          const b = path.getPointAtLength(length);
          const over = d - length;
          return { x: b.x + (b.x - a.x) * over, y: b.y + (b.y - a.y) * over, tx: b.x - a.x, ty: b.y - a.y };
        }

        const here = path.getPointAtLength(d);
        const ahead = path.getPointAtLength(Math.min(length, d + 1));
        return { x: here.x, y: here.y, tx: ahead.x - here.x, ty: ahead.y - here.y };
      };
      /*
       * Applied as a scale rather than by re-laying the train out smaller.
       * The layout is in distances along the path, and rebuilding it per frame
       * would move every logo backwards as the spacing shrank; scaling each
       * logo about its own place on its row leaves the spacing alone and lets
       * the gaps close as the logos grow.
       */
      const flat = growRef ? growRef.current : 1;
      const grow = GROW_FLOOR + (1 - GROW_FLOOR) * flat;
      const gapGrow = GAP_FLOOR + (1 - GAP_FLOOR) * flat;
      const loop = totalWidth * grow + count * gap * gapGrow;

      // A tab left in the background hands back one enormous delta on return.
      progress = (progress + (SPEED * Math.min(elapsed, 0.1)) / loop) % 1;
      const offset = progress * loop;

      for (let index = 0; index < count; index += 1) {
        /*
         * The train runs backwards rather than its carriages being reordered,
         * so both rows are the one layout travelling opposite ways. The lean
         * below is read off the path either way, which is what keeps a row
         * going against the drawing direction upright rather than mirrored.
         */
        const reach = (widths[index] * grow) / 2;
        const centre = widthBefore[index] * grow + index * gap * gapGrow + reach;
        let distance = (((centre + direction * offset) % loop) + loop) % loop;

        /*
         * The far end of the loop is the near side of the start: a logo that
         * has not reached the path yet is one about to, so it is read as a
         * negative distance and slides in from before the first point rather
         * than appearing on it.
         */
        if (distance > length + reach + overhang) {
          distance -= loop;
        }

        /* Nothing of it over the band, so nothing to draw. Measured against
           the caps and not the last point of the path: a logo still inside the
           cap is still on screen, and dropping it there is what made them
           vanish while they could plainly still be seen. */
        if (distance + reach < -overhang || distance - reach > length + overhang) {
          transforms[index] = null;
        } else {
          const point = sample(distance);
          /*
           * Turned to lie along the curve, and then half a turn further. The
           * arc is travelled from the end that ends up on the right, so without
           * the 180 every logo would ride it upside down.
           */
          const lean = (Math.atan2(point.ty, point.tx) * 180) / Math.PI + 180;

          /* The last translate is in the turned frame, so its y runs across
             the stroke whatever angle this stretch of the path is at - which
             is what keeps a row parallel to the arc instead of to the screen. */
          transforms[index] =
            `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${lean.toFixed(2)}) translate(0 ${rowOffset.toFixed(2)}) scale(${grow.toFixed(4)}) translate(${(-widths[index] / 2).toFixed(2)} ${(-height / 2).toFixed(2)})`;
        }
      }

      const twins = twinRef.current ? twinRef.current.children : null;

      /* The copy can be mounted, or mounted again, after this loop started,
         and new nodes start out hidden whatever was last written. */
      if (twins !== lastTwins) {
        lastTwins = twins;
        twinShown.fill(false);
      }

      for (let index = 0; index < count; index += 1) {
        place(nodes[index], index, transforms[index], shown);
        place(twins && twins[index], index, transforms[index], twinShown);
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [pathRef, items, running, rowOffset, direction, height, logos, growRef, overhang]);

  const images = (dark) =>
    items.map((src, index) => {
      const logo = logos && logos[index];

      return (
        <image
          /* eslint-disable-next-line react/no-array-index-key */
          key={index}
          href={logo ? (dark ? logo.dark : logo.light) : undefined}
          width={logo ? (height * logo.aspect).toFixed(2) : undefined}
          height={height}
          opacity="0"
          preserveAspectRatio="xMidYMid meet"
          style={dark && logo && logo.filtered ? { filter: 'brightness(0)' } : undefined}
        />
      );
    });

  return (
    <>
      <g ref={groupRef} className={className} aria-hidden="true" pointerEvents="none">
        {images(false)}
      </g>
      {twinContainer &&
        createPortal(
          <g ref={twinRef} className={className} aria-hidden="true" pointerEvents="none">
            {images(true)}
          </g>,
          twinContainer,
        )}
    </>
  );
}
