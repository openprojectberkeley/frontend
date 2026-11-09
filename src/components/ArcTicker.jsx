import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { maskPaths } from './PixelSwap';
import logoSource from './logoSource';

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
 * The row turning over to its next set of logos: a sweep across the screen,
 * SWAP_SWEEP long, and every logo on screen breaking up into blocks as it
 * passes - the old ones going and the new ones coming, each over SWAP_MS, so
 * neighbours overlap. The blocks are about SWAP_BLOCK pixels, and the change is
 * cut into SWAP_STEPS visible steps, so a logo only rewrites its mask a handful
 * of times.
 */
const SWAP_MS = 350;
const SWAP_SWEEP = 650;
const SWAP_BLOCK = 8;
const SWAP_STEPS = 8;
const SWAP_SEEDS = 6;

/*
 * How much taller a narrow logo is drawn than the row height, so a mark that
 * is about as wide as it is tall does not sit as a dot between wordmarks.
 *
 * The same rule as the spill's, roughly: equal area rather than equal height,
 * so a logo SIZE_AT_ONE times as wide as it is tall or wider stays at the row
 * height, and one narrower grows by the square root of how much narrower it
 * is. A hand correction for the logo goes on top, and SIZE_MAX caps the lot:
 * each row has half the band to itself, about twice the row height, and a
 * logo much taller than this starts to crowd the row beside it.
 */
const SIZE_AT_ONE = 2.6;
const SIZE_MAX = 1.7;

const sizeOf = (aspect, nudge = 1) =>
  Math.min(SIZE_MAX, Math.max(1, Math.sqrt(SIZE_AT_ONE / aspect)) * nudge);

/* Every logo in a list, measured and drawn - see prepare. */
const loadAll = (list, urls) =>
  Promise.all(
    list.map(
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
          // An SVG at a size matching its own drawing - see logoSource.
          logoSource(src).then((source) => {
            image.src = source.src;
          });
        }),
    ),
  );

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
 * The route the logos follow, worked out from the path's d rather than asked
 * of the path element.
 *
 * getTotalLength and getPointAtLength bring the page's style and layout up to
 * date before they answer. The hero rewrites its stage every frame before this
 * loop runs, so asking them meant restyling the whole stage a second time per
 * frame, and the length itself is recomputed from scratch on each call. The
 * arc is only ever one of two shapes - a single circular arc, or the straight
 * line it flattens into (see arcPath) - and both are a few lines of geometry.
 *
 * Returns null for any other path, and the caller falls back to the element.
 */
const ARC_D = /^M\s*(-?[\d.]+)[\s,]+(-?[\d.]+)\s*A\s*([\d.]+)[\s,]+([\d.]+)[\s,]+(-?[\d.]+)[\s,]+([01])[\s,]*([01])[\s,]*(-?[\d.]+)[\s,]+(-?[\d.]+)\s*$/;
const LINE_D = /^M\s*(-?[\d.]+)[\s,]+(-?[\d.]+)\s*L\s*(-?[\d.]+)[\s,]+(-?[\d.]+)\s*$/;

export function routeOf(d) {
  const line = LINE_D.exec(d);

  if (line) {
    const [x0, y0, x1, y1] = line.slice(1).map(Number);
    const length = Math.hypot(x1 - x0, y1 - y0);
    const ux = length ? (x1 - x0) / length : 1;
    const uy = length ? (y1 - y0) / length : 0;

    return {
      length,
      at: (s) => ({ x: x0 + ux * s, y: y0 + uy * s, tx: ux, ty: uy }),
    };
  }

  const arc = ARC_D.exec(d);

  // Circular, unrotated and the short way round, which is all arcPath draws.
  if (!arc || arc[3] !== arc[4] || Number(arc[5]) !== 0 || arc[6] !== '0') {
    return null;
  }

  const [x0, y0, , , , , sweepFlag, x1, y1] = arc.slice(1).map(Number);
  const halfX = (x0 - x1) / 2;
  const halfY = (y0 - y1) / 2;
  const halfSq = halfX * halfX + halfY * halfY;

  if (!halfSq) {
    return { length: 0, at: () => ({ x: x0, y: y0, tx: 1, ty: 0 }) };
  }

  // A radius too small to span the chord is scaled up to just span it, as the
  // SVG spec has it.
  const r = Math.max(Number(arc[3]), Math.sqrt(halfSq));
  const sweep = sweepFlag === 1;
  // The centre, by the spec's endpoint-to-centre conversion (F.6.5) with no
  // rotation and the large-arc flag off.
  const k = (sweep ? 1 : -1) * Math.sqrt(Math.max(0, (r * r - halfSq) / halfSq));
  const cx = k * halfY + (x0 + x1) / 2;
  const cy = -k * halfX + (y0 + y1) / 2;
  const start = Math.atan2(y0 - cy, x0 - cx);
  let turn = Math.atan2(y1 - cy, x1 - cx) - start;

  if (sweep && turn < 0) turn += 2 * Math.PI;
  if (!sweep && turn > 0) turn -= 2 * Math.PI;

  const direction = sweep ? 1 : -1;

  return {
    length: r * Math.abs(turn),
    at: (s) => {
      const angle = start + (direction * s) / r;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      return { x: cx + r * cos, y: cy + r * sin, tx: -sin * direction, ty: cos * direction };
    },
  };
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
   * What the row turns into: a second row of its own, laid out from its own
   * logos at its own spacing and running at the same speed, which nobody can
   * tell apart from the first. Nothing pairs a client with a new logo.
   *
   * Turning `swapped` on turns the row over after `swapDelay` ms: a sweep across
   * the screen in `swapOrder` ('ltr' or 'rtl'), breaking up the clients and
   * bringing in the new logos as it passes them. Off screen the change is
   * instant, so whatever comes in from the side afterwards is already new.
   * Turning it off plays the same change backwards, the sweep the other way.
   */
  nextItems = [],
  /* A hand correction to how big a new logo is drawn, by src - see sizeOf. */
  nextScales,
  swapped = false,
  swapDelay = 0,
  swapOrder = 'ltr',
  /*
   * Filled with { takeVisible, restore }. takeVisible finishes any turning
   * over, hides the whole row, and returns the new logos that were on screen as
   * { index, rect }: index into nextItems, and the logo's box on the page. All
   * read before any of it is written. restore puts the row back.
   */
  handleRef,
  /*
   * How far past each end of the path the band still paints. The stroke has
   * round caps, so the ink runs on half a stroke-width beyond the last point -
   * and a logo out there is still over the band and still visible.
   */
  overhang = 0,
  /*
   * Lite mode (see liteMode.js): the turning over is a crossfade, each logo
   * fading in or out as the sweep reaches it, instead of breaking up into
   * blocks - no masks to build and rewrite.
   */
  lite = false,
}) {
  const groupRef = useRef(null);
  const twinRef = useRef(null);
  const nextRef = useRef(null);
  const maskRef = useRef(null);
  // useId hands back ":r0:"-style strings, which are invalid in url(#...).
  const uid = useId().replace(/:/g, '');
  const swappedRef = useRef(swapped);
  const swapDelayRef = useRef(swapDelay);
  const liteRef = useRef(lite);
  liteRef.current = lite;
  const swapOrderRef = useRef(swapOrder);

  swappedRef.current = swapped;
  swapDelayRef.current = swapDelay;
  swapOrderRef.current = swapOrder;
  /*
   * How wide each logo wants to be at the height they all share, which only the
   * file itself can say, and the bitmaps each row is drawn from. Decoded once:
   * the browser has these files cached already.
   */
  const [logos, setLogos] = useState(null);
  /*
   * What every logo is doing in turning over - see runSwap. `target` is which
   * set the row is turning to, or has turned to: true for the new logos. Each
   * logo is 'on', 'off', or the time it starts to change towards the target.
   * Outlives the loop, which restarts around it.
   */
  const swapRef = useRef({
    target: false,
    armedAt: null,
    client: [],
    next: [],
    clientStep: [],
    nextStep: [],
    pixels: 1,
  });
  /* Whether the logos have been taken off the row. Outlives the loop, which
     restarts around it. */
  const takenRef = useRef(false);
  /* The running loop's part in taking them, while there is one. */
  const takeRunningRef = useRef(null);

  /*
   * There from the start, and not only once the loop is. A page loaded partway
   * down can ask for the logos while they are still decoding, and the row has to
   * remember being asked, or they would come out when they had decoded.
   */
  useLayoutEffect(() => {
    if (!handleRef) {
      return undefined;
    }

    handleRef.current = {
      takeVisible: () => {
        const taken = takeRunningRef.current?.() ?? [];

        takenRef.current = true;

        return taken;
      },
      /*
       * The new logos that were taken are in the pile, so they do not come back
       * to the row: it comes back empty, and the clients turn back in on it.
       */
      restore: () => {
        if (takenRef.current) {
          swapRef.current.next = swapRef.current.next.map(() => 'off');
        }

        takenRef.current = false;
      },
    };

    return () => {
      handleRef.current = null;
    };
  }, [handleRef]);

  useEffect(() => {
    let live = true;
    const urls = [];

    Promise.all([loadAll(items, urls), loadAll(nextItems, urls)]).then(([clients, next]) => {
      if (live) {
        setLogos({
          clients: clients.map((logo) => ({ ...logo, size: 1 })),
          next: next.map((logo, index) => ({
            ...logo,
            size: sizeOf(logo.aspect, nextScales?.get(nextItems[index]) ?? 1),
          })),
        });
      } else {
        urls.forEach((url) => URL.revokeObjectURL(url));
      }
    });

    return () => {
      live = false;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [items, nextItems, nextScales]);

  const clientLogos = logos ? logos.clients : [];
  const nextLogos = logos ? logos.next : [];

  /* A layout effect so that the first placement is in before the browser
     paints the render that started the loop. */
  useLayoutEffect(() => {
    const path = pathRef.current;
    const group = groupRef.current;

    if (!path || !group || !running || !logos) {
      return undefined;
    }

    const nodes = Array.from(group.children);
    const gap = height * GAP_SHARE;
    const swap = swapRef.current;

    /*
     * A row of logos laid out as a train: how wide each is, how much logo there
     * is in front of it, and how far round the loop it has got - as a share of
     * the train rather than a distance, because the train is not always the
     * same length: it shrinks with the logos while the arc is still bent.
     *
     * The clients and the new logos are two of these, each spaced by its own
     * logos, travelling at the same speed.
     */
    const trainOf = (list) => {
      const widths = list.map(({ aspect, size }) => height * aspect * size);
      const heights = list.map(({ size }) => height * size);
      const before = [];
      let total = 0;

      widths.forEach((width) => {
        before.push(total);
        total += width;
      });

      return { widths, heights, before, total, count: list.length, progress: 0, transforms: list.map(() => null) };
    };
    const clientTrain = trainOf(logos.clients);
    const nextTrain = trainOf(logos.next);

    /* Every logo where the row last left it, or settled for the set it is on. */
    swap.client = logos.clients.map((_, index) => swap.client[index] ?? (swap.target ? 'off' : 'on'));
    swap.next = logos.next.map((_, index) => swap.next[index] ?? (swap.target ? 'on' : 'off'));

    /*
     * What each node was last told, so an unchanged opacity is not rewritten:
     * it is a presentation attribute, and every write is a style recalc.
     *
     * Unknown to begin with rather than hidden. The nodes outlive the loop, so
     * a logo that was showing when the scroll last went back past the start
     * is still showing, still placed for the arc as it was then; taken for
     * hidden, it would be left there until its turn came round again.
     */
    const shown = clientTrain.transforms.map(() => null);
    let twinShown = clientTrain.transforms.map(() => null);
    let nextShown = nextTrain.transforms.map(() => null);
    let lastTwins = null;
    let lastNext = null;

    let frame = null;
    let last = null;

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

    /*
     * Whether each logo is to be drawn at all, as of `now`. One changing is
     * drawn from its start if it is coming, and until its end if it is going -
     * which is the whole of its change for one going, as it is masked away.
     */
    const isOn = (state, coming, now) =>
      state === 'on' || (typeof state === 'number' && (!coming || now >= state));
    const clientOn = (index, now) => isOn(swap.client[index], !swap.target, now);
    const nextOn = (index, now) => isOn(swap.next[index], swap.target, now);

    /* The route, kept until the path's d changes - which is only while the
       arc is flattening. */
    let routeD = null;
    let route = null;

    const layTrain = (train, length, sample, grow, gapGrow, travel) => {
      const loop = train.total * grow + train.count * gap * gapGrow;

      if (!loop) {
        return;
      }

      train.progress = (train.progress + travel / loop) % 1;
      const offset = train.progress * loop;

      for (let index = 0; index < train.count; index += 1) {
        /*
         * The train runs backwards rather than its carriages being reordered,
         * so both rows are the one layout travelling opposite ways. The lean
         * below is read off the path either way, which is what keeps a row
         * going against the drawing direction upright rather than mirrored.
         */
        const reach = (train.widths[index] * grow) / 2;
        const centre = train.before[index] * grow + index * gap * gapGrow + reach;
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
          train.transforms[index] = null;
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
          train.transforms[index] =
            `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${lean.toFixed(2)}) translate(0 ${rowOffset.toFixed(2)}) scale(${grow.toFixed(4)}) translate(${(-train.widths[index] / 2).toFixed(2)} ${(-train.heights[index] / 2).toFixed(2)})`;
        }
      }
    };

    const layout = (elapsed, now) => {
      const d = path.getAttribute('d');

      if (d !== routeD) {
        routeD = d;
        route = routeOf(d);
      }

      const length = route ? route.length : path.getTotalLength();

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
      const sample = (at) => {
        if (route) {
          // Past either end the tangent runs on, as below.
          const clamped = Math.min(length, Math.max(0, at));
          const point = route.at(clamped);
          const over = at - clamped;

          return {
            x: point.x + point.tx * over,
            y: point.y + point.ty * over,
            tx: point.tx,
            ty: point.ty,
          };
        }

        if (at < 0) {
          const a = path.getPointAtLength(0);
          const b = path.getPointAtLength(1);
          return { x: a.x + (b.x - a.x) * at, y: a.y + (b.y - a.y) * at, tx: b.x - a.x, ty: b.y - a.y };
        }

        if (at >= length) {
          const a = path.getPointAtLength(length - 1);
          const b = path.getPointAtLength(length);
          const over = at - length;
          return { x: b.x + (b.x - a.x) * over, y: b.y + (b.y - a.y) * over, tx: b.x - a.x, ty: b.y - a.y };
        }

        const here = path.getPointAtLength(at);
        const ahead = path.getPointAtLength(Math.min(length, at + 1));
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
      // A tab left in the background hands back one enormous delta on return.
      const travel = SPEED * Math.min(elapsed, 0.1);

      layTrain(clientTrain, length, sample, grow, gapGrow, travel);
      layTrain(nextTrain, length, sample, grow, gapGrow, travel);

      const twins = twinRef.current ? twinRef.current.children : null;
      const nexts = nextRef.current ? nextRef.current.children : null;

      /* The copies can be mounted, or mounted again, after this loop started,
         and new nodes start out hidden whatever was last written. */
      if (twins !== lastTwins) {
        lastTwins = twins;
        twinShown = twinShown.map(() => null);
      }

      if (nexts !== lastNext) {
        lastNext = nexts;
        nextShown = nextShown.map(() => null);
      }

      const taken = takenRef.current;

      for (let index = 0; index < clientTrain.count; index += 1) {
        const transform = taken || !clientOn(index, now) ? null : clientTrain.transforms[index];

        place(nodes[index], index, transform, shown);
        place(twins && twins[index], index, transform, twinShown);
      }

      for (let index = 0; index < nextTrain.count; index += 1) {
        const transform = taken || !nextOn(index, now) ? null : nextTrain.transforms[index];

        place(nexts && nexts[index], index, transform, nextShown);
      }
    };

    /*
     * The pictures inside a logo's groups, which are what carry its mask while
     * it changes; the groups themselves are what move. A client is drawn twice,
     * in white on the band and in black over the paper, and both change.
     */
    const picturesOf = (which, index) =>
      which === 'client'
        ? [nodes[index]?.firstChild, twinRef.current?.children[index]?.firstChild]
        : [nextRef.current?.children[index]?.firstChild];
    const maskGroup = (which, index) =>
      maskRef.current?.children[(which === 'client' ? 0 : clientTrain.count) + index]?.firstChild ?? null;
    const unmask = (which, index) =>
      picturesOf(which, index).forEach((picture) => {
        picture?.removeAttribute('mask');
        picture?.removeAttribute('opacity');
      });

    const writeMask = (which, index, units, tall, seed, shownShare) => {
      if (liteRef.current) {
        picturesOf(which, index).forEach((picture) =>
          picture?.setAttribute('opacity', shownShare.toFixed(3)),
        );

        return;
      }

      const group = maskGroup(which, index);

      if (!group) {
        return;
      }

      const columns = Math.max(1, Math.round((units * swap.pixels) / SWAP_BLOCK));
      const rows = Math.max(1, Math.round((tall * swap.pixels) / SWAP_BLOCK));

      group.setAttribute('transform', `scale(${1 / columns} ${1 / rows})`);
      group.innerHTML = maskPaths(columns, rows, seed, shownShare)
        .map(([level, d]) => `<path fill="#fff" fill-opacity="${level}" d="${d}"/>`)
        .join('');
      picturesOf(which, index).forEach((picture) =>
        picture?.setAttribute('mask', `url(#${uid}-${which}-${index})`),
      );
    };

    /*
     * The sweep, from what is on screen this moment, towards `swap.target`.
     * Each logo on screen that is not already where it is going gets the time
     * the sweep reaches it; everything off screen changes at once. Coming back
     * the sweep runs the other way, the change played backwards.
     *
     * Nothing hidden has been placed lately, so every logo is put where it is
     * before anything is measured, and all of it is read before it is decided.
     */
    const plan = (now) => {
      const want = swap.target;
      const reversed = (swapOrderRef.current === 'rtl') === want;
      const width = window.innerWidth;
      const at = (rect) => {
        const middle = rect.left + rect.width / 2;

        if (!(rect.width > 0) || middle < 0 || middle > width) {
          return null;
        }

        const across = Math.min(1, Math.max(0, middle / width));

        return now + (reversed ? 1 - across : across) * SWAP_SWEEP;
      };
      const groups = (list) => (list ? list.children : []);
      const clientNodes = nodes;
      const nexts = groups(nextRef.current);

      clientTrain.transforms.forEach((transform, index) => {
        if (transform !== null) clientNodes[index]?.setAttribute('transform', transform);
      });
      nextTrain.transforms.forEach((transform, index) => {
        if (transform !== null) nexts[index]?.setAttribute('transform', transform);
      });

      const rectsOf = (train, list) =>
        train.transforms.map((transform, index) =>
          transform !== null && list[index] ? list[index].getBoundingClientRect() : null,
        );
      const clientRects = rectsOf(clientTrain, clientNodes);
      const nextRects = rectsOf(nextTrain, nexts);
      const sized = clientRects.findIndex((rect) => rect && rect.height > 0);

      swap.pixels = sized >= 0 ? clientRects[sized].height / clientTrain.heights[sized] : 1;

      /* A logo still changing the other way is taken as having got there. */
      const turn = (which, rects, list, steps, wantOn) => {
        const settled = wantOn ? 'on' : 'off';

        rects.forEach((rect, index) => {
          steps[index] = null;
          unmask(which, index);

          if (list[index] !== settled) {
            list[index] = (rect && at(rect)) ?? settled;
          }
        });
      };

      turn('client', clientRects, swap.client, swap.clientStep, !want);
      turn('next', nextRects, swap.next, swap.nextStep, want);
    };

    /* Before the layout of the same frame, so a logo whose turn has come is
       masked before it is first drawn. Either way round, after the same delay,
       which is the heading's own change reaching its middle. */
    const runSwap = (now) => {
      const wanted = swappedRef.current;

      if (wanted !== swap.target) {
        if (swap.armedAt === null) {
          swap.armedAt = now + swapDelayRef.current;
        }

        if (now < swap.armedAt) {
          return;
        }

        swap.armedAt = null;
        swap.target = wanted;
        plan(now);
      } else {
        /* Turned round again before the change had begun. */
        swap.armedAt = null;
      }

      const step = (which, index, list, steps, wantOn, train) => {
        const start = list[index];

        if (typeof start !== 'number' || now < start) {
          return;
        }

        const progress = (now - start) / SWAP_MS;

        if (progress >= 1) {
          list[index] = wantOn ? 'on' : 'off';
          steps[index] = null;
          unmask(which, index);

          return;
        }

        // A fade has no blocks to keep on their lines, so it takes finer steps.
        const stepCount = liteRef.current ? SWAP_STEPS * 4 : SWAP_STEPS;
        const reached = Math.floor(progress * stepCount);

        if (reached === steps[index]) {
          return;
        }

        const seed = (index % SWAP_SEEDS) * 2 + (which === 'client' ? 2 : 1);
        const share = reached / stepCount;

        steps[index] = reached;
        writeMask(which, index, train.widths[index], train.heights[index], seed, wantOn ? share : 1 - share);
      };

      for (let index = 0; index < clientTrain.count; index += 1) {
        step('client', index, swap.client, swap.clientStep, !swap.target, clientTrain);
      }

      for (let index = 0; index < nextTrain.count; index += 1) {
        step('next', index, swap.next, swap.nextStep, swap.target, nextTrain);
      }
    };

    const tick = (now) => {
      const elapsed = last === null ? 0 : (now - last) / 1000;
      last = now;
      runSwap(now);
      layout(elapsed, now);
      frame = window.requestAnimationFrame(tick);
    };

    takeRunningRef.current = () => {
      const now = performance.now();

      /* Whatever was still turning over, or waiting to, has turned. */
      swap.target = swappedRef.current;
      swap.armedAt = null;

      for (let index = 0; index < clientTrain.count; index += 1) {
        swap.client[index] = swap.target ? 'off' : 'on';
        unmask('client', index);
      }

      for (let index = 0; index < nextTrain.count; index += 1) {
        swap.next[index] = swap.target ? 'on' : 'off';
        unmask('next', index);
      }

      layout(0, now);

      const nexts = nextRef.current ? nextRef.current.children : null;
      const taken = [];

      nextTrain.transforms.forEach((transform, index) => {
        const picture = nexts?.[index]?.firstChild;

        if (transform === null || !picture) {
          return;
        }

        const rect = picture.getBoundingClientRect();

        if (
          rect.width > 0 &&
          rect.right > 0 &&
          rect.left < window.innerWidth &&
          rect.bottom > 0 &&
          rect.top < window.innerHeight
        ) {
          taken.push({ index, rect });
        }
      });

      takenRef.current = true;
      layout(0, now);

      return taken;
    };

    /*
     * The scroll reshapes the arc in an animation frame of its own, and that
     * one is asked for after this loop's, so it runs second: placed only here,
     * the logos would spend every frame of a scroll on the arc as it was one
     * frame before, out of line with the band and its clip. Following the
     * path's own changes puts them back on it before that frame is painted.
     */
    const reshaped = new MutationObserver(() => layout(0, performance.now()));
    reshaped.observe(path, { attributes: true, attributeFilter: ['d'] });

    /* Placed now and not a frame from now, so the first frame painted with the
       loop running is not one with every logo where the last run left it. */
    layout(0, performance.now());
    frame = window.requestAnimationFrame(tick);

    return () => {
      reshaped.disconnect();
      window.cancelAnimationFrame(frame);
      takeRunningRef.current = null;
    };
  }, [pathRef, items, running, rowOffset, direction, height, logos, growRef, overhang, uid]);

  const picture = (logo, dark) => (
    <image
      href={dark ? logo.dark : logo.light}
      width={(height * logo.aspect * logo.size).toFixed(2)}
      height={(height * logo.size).toFixed(2)}
      preserveAspectRatio="xMidYMid meet"
      style={dark && logo.filtered ? { filter: 'brightness(0)' } : undefined}
    />
  );

  /*
   * The clients in white, as the band carries them; the clients again in black
   * for the copy over the white; and the new logos, in their own colours, in
   * the same place. Each logo is a group, which is what moves, around its
   * picture, which is what carries a mask while it changes.
   */
  return (
    <>
      <g ref={groupRef} className={className} aria-hidden="true" pointerEvents="none">
        {clientLogos.map((logo, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <g key={index} opacity="0">
            {picture(logo, false)}
          </g>
        ))}
      </g>
      {twinContainer &&
        createPortal(
          <>
            <defs ref={maskRef}>
              {clientLogos.map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <mask key={`client-${index}`} id={`${uid}-client-${index}`} maskContentUnits="objectBoundingBox">
                  <g />
                </mask>
              ))}
              {nextLogos.map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <mask key={`next-${index}`} id={`${uid}-next-${index}`} maskContentUnits="objectBoundingBox">
                  <g />
                </mask>
              ))}
            </defs>
            <g ref={twinRef} className={className} aria-hidden="true" pointerEvents="none">
              {clientLogos.map((logo, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <g key={index} opacity="0">
                  {picture(logo, true)}
                </g>
              ))}
            </g>
            <g ref={nextRef} className={className} aria-hidden="true" pointerEvents="none">
              {nextLogos.map((logo, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <g key={index} opacity="0">
                  {picture(logo, false)}
                </g>
              ))}
            </g>
          </>,
          twinContainer,
        )}
    </>
  );
}
