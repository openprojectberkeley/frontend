import { useId } from 'react';
import styles from '../css/LogoLoader.module.css';

/*
 * A loading indicator: the Open Project mark, taken apart and put back
 * together, looping for as long as something is in flight.
 *
 * This is not the site's logo. It is a spinner that happens to be built from
 * the mark, so it belongs wherever a spinner belongs - while data, a route or
 * an embed is loading - and it announces itself as a live region
 * (role="status", labelled "Loading" by default) to match. Anywhere the
 * brand itself is wanted, a page hero or a nav bar, use the real lockup in
 * `src/images/navbarlogo.png` instead; a perpetually moving logo reads as a
 * page that never finished loading.
 *
 * The three shapes drift apart, orbit a shared focal point while each turns at
 * its own rate, then land back in their exported positions, so every loop
 * closes on the untouched logo. Nothing scales, and every movement eases in and
 * out of rest, so there are no pops and no hard stops.
 *
 * Each shape gets three animated groups, one movement each, because CSS
 * animates an element's whole transform as a unit: sharing one keyframe list
 * would force the orbit, the drift and the spin onto a single easing curve, and
 * the drift reversing at its peak would drag the rotation to a halt with it.
 *
 *   orbit -> drift -> spin
 *
 * Nesting them in that order composes to rotate(orbit) translate(drift)
 * rotate(spin), which is what makes a piece escape straight outward from the
 * focal point rather than spiralling.
 *
 * The numbers below are measured, not guessed:
 *   - The artwork lives in a 148x171 box and fills it edge to edge, so there is
 *     no room to move. The box here is padded to 224x224, which is what the
 *     pieces need at full separation. That makes `size` the padded box, not the
 *     ink: the resting mark renders at ~64% of `size` wide and ~76% tall, so
 *     size={120} is roughly a 77x92px logo.
 *   - F = (71.5684, 85.3845), the painted bounding box center, is what
 *     everything orbits. The static wrappers drop each pivot onto its own
 *     group's local (0,0), so the keyframes only ever rotate about the origin
 *     and never need to know where they are.
 *   - The arc pivots on (93.5175, 96.141), the center of the circle it is a
 *     half of, so it sweeps along its own radius instead of tumbling.
 *
 * Two things that break this silently if they are "tidied" later:
 *   - viewBox min-x/min-y must stay 0 0. `transform-origin: 0 0` resolves
 *     against those, not against user space.
 *   - No group may carry both a CSS transform and a transform attribute. A CSS
 *     transform replaces the attribute outright, so the static wrappers and the
 *     animated groups have to stay separate elements.
 */
export default function LogoLoader({
  size = 120,
  label = 'Loading',
  showLabel = false,
  duration,
  frozen = false,
  className,
}) {
  // useId hands back ":r0:"-style strings. Those work in a fill attribute but
  // are invalid in a CSS selector, so drop the colons before they spread.
  const uid = useId().replace(/:/g, '');
  const fill = {
    circle: `ll-c-${uid}`,
    bar: `ll-b-${uid}`,
    arc: `ll-a-${uid}`,
  };

  const rootStyle = {
    '--ll-size': `${size}px`,
    ...(duration ? { '--ll-duration': duration } : null),
  };

  const rootClass = [styles.root, frozen ? styles.frozen : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div role="status" className={rootClass} style={rootStyle}>
      <svg
        className={styles.svg}
        viewBox="0 0 224 224"
        overflow="visible"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={fill.circle}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(0,108.301,-108.301,0,54.1503,0)"
          >
            <stop offset="0" stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient
            id={fill.bar}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(0,86.8745,-86.8745,0,54.1468,83.8945)"
          >
            <stop offset="0" stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient
            id={fill.arc}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(27.359,76.6445,-76.6445,27.359,101.333,51.6175)"
          >
            <stop offset="0" stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* static: pad the artwork into the 224 box, landing F on (112, 112) */}
        <g transform="translate(40.4316 26.6155)">
          {/* static: F at the local origin, shared by all three orbits */}
          <g transform="translate(71.5684 85.3845)">
            <g className={`${styles.orbit} ${styles.orbitCircle}`}>
              <g className={`${styles.drift} ${styles.driftCircle}`}>
                {/* static: F to the disc's own center */}
                <g transform="translate(-17.4184 -31.2345)">
                  <g className={`${styles.spin} ${styles.spinCircle}`}>
                    {/* static: pivot back into the exported path's space */}
                    <g transform="translate(-54.15 -54.15)">
                      <circle cx="54.15" cy="54.15" r="54.134" fill={`url(#${fill.circle})`} />
                    </g>
                  </g>
                </g>
              </g>
            </g>

            <g className={`${styles.orbit} ${styles.orbitBar}`}>
              <g className={`${styles.drift} ${styles.driftBar}`}>
                {/* static: F to the bar's own center */}
                <g transform="translate(-17.4219 41.9475)">
                  <g className={`${styles.spin} ${styles.spinBar}`}>
                    <g transform="translate(-54.1465 -127.332)">
                      <path
                        d="M62.302,83.911C66.615,83.911 70.116,87.412 70.116,91.725L70.116,162.939C70.116,167.252 66.615,170.753 62.302,170.753L45.992,170.753C41.679,170.753 38.177,167.252 38.177,162.939L38.177,91.725C38.177,87.412 41.679,83.911 45.992,83.911L62.302,83.911Z"
                        fill={`url(#${fill.bar})`}
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>

            <g className={`${styles.orbit} ${styles.orbitArc}`}>
              <g className={`${styles.drift} ${styles.driftArc}`}>
                {/* static: F to the center of the circle the arc is half of */}
                <g transform="translate(21.9491 10.7565)">
                  <g className={`${styles.spin} ${styles.spinArc}`}>
                    <g transform="translate(-93.5175 -96.141)">
                      <path
                        d="M79.258,59.817C99.384,51.642 121.451,60.312 129.637,80.436C137.823,100.559 129.027,124.516 108.902,132.691"
                        fill="none"
                        stroke={`url(#${fill.arc})`}
                        strokeWidth="20.88"
                        strokeLinecap="round"
                        pathLength="100"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>

      {showLabel ? (
        <p className={styles.label}>{label}</p>
      ) : (
        <span className={styles.srOnly}>{label}</span>
      )}
    </div>
  );
}
