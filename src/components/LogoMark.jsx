import { useId } from 'react';

/*
 * The Open Project mark, inline, with its three shapes exposed as separate
 * elements so a caller can move them independently. An <img> cannot do that:
 * the parts of a referenced SVG are unreachable from the page's CSS, which is
 * the whole reason this component exists rather than another <img src=
 * "/favicon.svg">.
 *
 * The geometry is favicon.svg's, with two differences, both deliberate:
 *   - That file draws the disc and the bar twice, the second copy carrying a
 *     0.1921-unit stroke. At favicon sizes the stroke is invisible, but this
 *     mark gets scaled perhaps 25x on the way into the disc, which would bring
 *     a yellow hairline out of nowhere. The duplicates are dropped.
 *   - The parts fly outside the viewBox, so the SVG must not clip; `overflow`
 *     is visible, set in CSS.
 * If favicon.svg's artwork is ever redrawn, this has to be redrawn with it.
 *
 * The disc's place inside the 896x1024 viewBox is exported, because a caller
 * zooming into the disc has to know where its centre is without reaching into
 * the SVG to measure it.
 */
export const DISC_CENTRE_X = 324.473 / 896;
export const DISC_CENTRE_Y = 324.386 / 1024;
export const DISC_WIDTH = 648.946 / 896;

export default function LogoMark({ className, discClassName, shadowClassName, barClassName, arcClassName }) {
  // useId hands back ":r0:"-style strings, which are fine in a fill attribute
  // but invalid in a CSS selector, so drop the colons before they spread.
  const uid = useId().replace(/:/g, '');
  const discFill = `lm-disc-${uid}`;
  const barFill = `lm-bar-${uid}`;
  const arcFill = `lm-arc-${uid}`;
  const discShadow = `lm-discshadow-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 896 1024"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={discFill} x1="324.473" y1="0" x2="324.473" y2="648.772" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8A7BFF" />
          <stop offset="1" stopColor="#5EC8FF" />
        </linearGradient>
        <linearGradient id={barFill} x1="324.455" y1="502.556" x2="324.455" y2="1022.98" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9CEF81" />
          <stop offset="1" stopColor="#228F8D" />
        </linearGradient>
        <linearGradient id={arcFill} x1="702.708" y1="382.883" x2="511.802" y2="713.629" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FACA15" />
          <stop offset="1" stopColor="#FF910E" />
        </linearGradient>

        {/*
          The disc's paper shadow: the same gradient taken down to about half
          brightness. A duplicate of the shape rather than a blur, so it reads
          as a second sheet of paper underneath rather than as a glow.
        */}
        <linearGradient id={discShadow} x1="324.473" y1="0" x2="324.473" y2="648.772" gradientUnits="userSpaceOnUse">
          <stop stopColor="#453E80" />
          <stop offset="1" stopColor="#2F6480" />
        </linearGradient>
      </defs>

      {/* Drawn before the disc, so it sits under it and shows only where it
          peeks out below. */}
      <circle
        className={shadowClassName}
        cx="324.473"
        cy="356"
        r="324.386"
        fill={`url(#${discShadow})`}
      />
      <path
        className={discClassName}
        d="M324.473 648.772C503.674 648.772 648.946 503.54 648.946 324.386C648.946 145.233 503.674 0 324.473 0C145.271 0 0 145.233 0 324.386C0 503.54 145.271 648.772 324.473 648.772Z"
        fill={`url(#${discFill})`}
      />
      <path
        className={barClassName}
        d="M373.328 502.556H275.583C249.673 502.556 228.668 523.56 228.668 549.471V976.063C228.668 1001.97 249.673 1022.98 275.583 1022.98H373.328C399.238 1022.98 420.243 1001.97 420.243 976.063V549.471C420.243 523.56 399.238 502.556 373.328 502.556Z"
        fill={`url(#${barFill})`}
      />
      <path
        className={arcClassName}
        d="M474.945 358.328C595.536 309.357 727.768 361.297 776.818 481.847C825.867 602.397 773.16 745.908 652.568 794.881"
        stroke={`url(#${arcFill})`}
        strokeWidth="125.107"
        strokeLinecap="round"
      />
    </svg>
  );
}
