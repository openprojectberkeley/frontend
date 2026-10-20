import { useId } from 'react';

/*
 * The mark's arc on its own.
 *
 * Same gradient and the same circle as the one in LogoMark, in a viewBox
 * cropped to the shape rather than to the whole logo - so the element's box is
 * the arc, and a caller can place and turn it without allowing for three
 * quarters of an empty square. The crop allows for the stroke: the path is 125
 * units wide with round caps, so the ink reaches 62.5 units beyond it all round.
 *
 * The geometry is a true semicircle, which the mark's own is not. Fitting a
 * circle to the exported path's three on-curve points gives centre
 * (561.456, 577.541) and radius 235.666, but its ends are 178.79 degrees apart
 * rather than 180, and its midpoint sits 1.8 degrees off centre - so it is very
 * slightly lopsided, which shows once it is blown up to most of the screen.
 * This draws the same circle with the ends placed exactly 180 degrees apart,
 * symmetrically about the original's apex, as a single arc command rather than
 * two cubics approximating one.
 *
 * Drawn in its exported orientation, opening to the left. Which way up it ends
 * is the caller's business, and ImmersiveHero turns it to put the opening up.
 */

/* How thick the arc is drawn. Exported because anything riding inside it has
   to size itself against it. */
export const STROKE_WIDTH = 125.107;

/* The circle the exported path is a piece of. Everything below is derived. */
const CENTRE_X = 561.456;
const CENTRE_Y = 577.541;
const RADIUS = 235.666;

/*
 * The chord's direction, from the end drawn first to the end drawn last.
 *
 * Worth knowing because the caller's 112.145deg lays this direction flat along
 * the screen: straightening the arc about its own chord therefore arrives at a
 * level line, with no counter-rotation to unwind as it goes.
 */
const CHORD_X = 0.376949;
const CHORD_Y = 0.926244;

/*
 * How much longer the chord grows by the time it is straight. The stroke is
 * 125 units wide with round caps, so at 2.12 the line measures about 1040 units
 * end to end against a 453.6-unit box - near two and a half times the box, far
 * enough that both caps finish well outside the viewport and what crosses the
 * screen is the straight middle of it.
 */
const CHORD_GROW = 2.12;

/*
 * The path, somewhere between the semicircle and a straight line.
 *
 * Both ends slide outwards along the chord while the bulge drops away, the
 * chord's midpoint - which for a semicircle is the circle's own centre - held
 * still throughout, so the shape opens out about the point it was already
 * sitting on instead of drifting as it flattens.
 *
 * At every step it is still one circular arc, just a shallower piece of a
 * bigger circle: a chord of half-length a with a bulge of s belongs to a circle
 * of radius (a^2 + s^2) / 2s. That radius runs away to infinity as the bulge
 * goes, so the last stretch is drawn as the line it has become.
 */
export function arcPath(flat = 0) {
  const f = Math.min(1, Math.max(0, flat));
  const half = RADIUS * (1 + f * (CHORD_GROW - 1));
  const sagitta = RADIUS * (1 - f);

  const x0 = (CENTRE_X - CHORD_X * half).toFixed(3);
  const y0 = (CENTRE_Y - CHORD_Y * half).toFixed(3);
  const x1 = (CENTRE_X + CHORD_X * half).toFixed(3);
  const y1 = (CENTRE_Y + CHORD_Y * half).toFixed(3);

  if (sagitta < 0.5) {
    return `M${x0} ${y0}L${x1} ${y1}`;
  }

  const r = ((half * half + sagitta * sagitta) / (2 * sagitta)).toFixed(3);

  /* Never more than half a circle once it starts flattening, so the large-arc
     flag stays off; the sweep flag is the exported path's, keeping the bulge
     on the side it was always on. */
  return `M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}`;
}

export default function LogoArc({
  className,
  pathRef,
  darkPathRef,
  maskPathRef,
  darkClassName,
  children,
}) {
  // useId hands back ":r0:"-style strings, which are fine in a fill attribute
  // but invalid in a CSS selector, so drop the colons before they spread.
  const uid = useId().replace(/:/g, '');
  const arcFill = `la-arc-${uid}`;
  const arcDarkFill = `la-arc-dark-${uid}`;
  const arcMask = `la-arc-mask-${uid}`;

  /*
   * The shape at rest. Both paths are handed back to the caller, which rewrites
   * this attribute on each of them per frame as the arc straightens - two
   * copies of one shape, so neither can be left behind.
   */
  const d = arcPath(0);

  return (
    <svg
      className={className}
      viewBox="408.1 277.3 453.6 583.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={arcFill} x1="702.708" y1="382.883" x2="511.802" y2="713.629" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FACA15" />
          <stop offset="1" stopColor="#FF910E" />
        </linearGradient>

        {/* What the arc becomes once the page has turned light: the same sweep
            in the footer's indigo, so it still reads against white. */}
        <linearGradient id={arcDarkFill} x1="702.708" y1="382.883" x2="511.802" y2="713.629" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4B3A86" />
          <stop offset="1" stopColor="#22114F" />
        </linearGradient>
        {/*
          The shape itself, painted white, used as a mask for anything riding
          it. Belt and braces: what rides the arc is sized to stay inside it,
          but a logo is a straight rectangle laid across a curve, so how far
          its ends stand off the stroke depends on both how wide it is and how
          tight the bend - and there is no width this cannot answer for.

          A mask rather than a clip path because a clip path is made from fill
          geometry, and the band is a stroke: clipping to this path would clip
          to the empty area it encloses rather than to the ink.

          The region is given in user space and set wide enough for the path at
          its longest, since the default is worked out from the bounding box of
          the content being masked, which moves.
        */}
        <mask
          id={arcMask}
          maskUnits="userSpaceOnUse"
          x="200"
          y="0"
          width="820"
          height="1200"
        >
          <path
            ref={maskPathRef}
            d={d}
            stroke="#fff"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
          />
        </mask>
      </defs>

      <path
        ref={pathRef}
        d={d}
        stroke={`url(#${arcFill})`}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />

      {/* The dark version, laid over the light one and faded up rather than
          swapped in, so the arc changes colour as the sheet passes it rather
          than at a single frame. */}
      <path
        ref={darkPathRef}
        className={darkClassName}
        d={d}
        stroke={`url(#${arcDarkFill})`}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />

      {/* Anything riding the arc goes here, inside the same SVG, so the
          rotation and scale above carry it too - and inside the mask, so none
          of it can paint outside the band. */}
      <g mask={`url(#${arcMask})`}>{children}</g>
    </svg>
  );
}
