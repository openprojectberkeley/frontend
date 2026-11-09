import { useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from '../css/Projects.module.css';
import { blockNoise, clamp01, stepped } from './pixelTrail';

/*
 * One thing giving way to another in place, in blocks: the old one goes out and
 * the new one comes in, block by block, each block fading in the trail's own
 * steps on its own turn. The same kind of mask as the dissolve in MomentStrip -
 * an SVG of the blocks showing, vector so its edges stay on the block lines -
 * without its squares of colour, as what comes and goes here may be no picture.
 *
 *   PIXEL_MS     how long the whole change takes
 *   BLOCK_FADE   how long one block spends fading, as a share of the change
 *   MASK_STEPS   how finely the change is cut. Each mask is built once and kept,
 *                as the same sizes come round again and again
 */
const PIXEL_MS = 500;
const BLOCK_FADE = 0.35;
const MASK_STEPS = 14;

const masks = new Map();
const blocks = new Map();

/*
 * The blocks showing at `shown`, as [opacity, path] pairs on a grid of columns
 * by rows - runs along each row, to keep them short. Kept, as the same sizes
 * come round again and again. Shared with whatever draws the pattern as SVG
 * itself rather than as a CSS mask.
 */
export const maskPaths = (columns, rows, seed, shown) => {
  const step = Math.round(clamp01(shown) * MASK_STEPS);
  const key = `${columns}x${rows}@${seed}@${step}`;
  let found = blocks.get(key);

  if (found) return found;

  const paths = new Map();

  for (let row = 0; row < rows; row += 1) {
    let start = 0;

    for (let column = 1; column <= columns + 1; column += 1) {
      const levelOf = (at) => stepped(clamp01(
        ((step / MASK_STEPS) * (1 + BLOCK_FADE) - blockNoise(seed, at, row, 1)) / BLOCK_FADE,
      ));
      const level = levelOf(start);

      if (column > columns || levelOf(column) !== level) {
        if (level > 0) {
          paths.set(level, `${paths.get(level) ?? ''}M${start} ${row}h${column - start}v1h${start - column}z`);
        }
        start = column;
      }
    }
  }

  found = [...paths];
  blocks.set(key, found);

  return found;
};

export const maskAt = (columns, rows, seed, shown) => {
  const step = Math.round(clamp01(shown) * MASK_STEPS);
  const key = `${columns}x${rows}@${seed}@${step}`;
  let mask = masks.get(key);

  if (mask) return mask;

  const drawn = maskPaths(columns, rows, seed, shown)
    .map(([level, d]) => `<path fill-opacity='${level}' d='${d}'/>`)
    .join('');

  mask = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${columns} ${rows}' ` +
      `preserveAspectRatio='none' shape-rendering='crispEdges'>${drawn}</svg>`,
  )}")`;
  masks.set(key, mask);

  return mask;
};

export const setMask = (element, mask) => {
  if (!element) return;

  element.style.maskImage = mask;
  element.style.webkitMaskImage = mask;
};

/*
 * Holds `children`, and plays the change when `swapKey` does: until it is over
 * the old children stay, in a layer under the new. `block` is the size of a
 * block in px, rounded to what divides the box evenly; `seed` keeps swaps that
 * run side by side from breaking up alike. A box that changes height with the
 * swap holds the old children at the old height, level with its bottom, and
 * neither is squeezed into the other's shape.
 */
export default function PixelSwap({ swapKey, block, seed = 0, className, children }) {
  const reducedMotion = useReducedMotion();
  const [leaving, setLeaving] = useState(null);
  const boxRef = useRef(null);
  const comingRef = useRef(null);
  const goingRef = useRef(null);
  const lastRef = useRef({ swapKey, children });

  useLayoutEffect(() => {
    const last = lastRef.current;

    if (last.swapKey === swapKey) return undefined;

    if (reducedMotion) {
      setLeaving(null);
      return undefined;
    }

    const box = boxRef.current;
    const rowsIn = (height) => Math.max(1, Math.round(height / block));
    const columns = Math.max(1, Math.round(box.offsetWidth / block));
    // Still the old height here: whatever resizes the box does so after this.
    const goingHeight = box.offsetHeight;
    const start = performance.now();
    let frame = null;

    setLeaving({ ...last, height: goingHeight });
    setMask(comingRef.current, maskAt(columns, rowsIn(goingHeight), seed * 2 + 1, 0));

    const step = (now) => {
      const progress = Math.min(1, (now - start) / PIXEL_MS);

      if (progress < 1) {
        setMask(comingRef.current, maskAt(columns, rowsIn(box.offsetHeight), seed * 2 + 1, progress));
        setMask(goingRef.current, maskAt(columns, rowsIn(goingHeight), seed * 2 + 2, 1 - progress));
        frame = window.requestAnimationFrame(step);
      } else {
        frame = null;
        setMask(comingRef.current, '');
        setLeaving(null);
      }
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [swapKey, block, seed, reducedMotion]);

  // After the effect above, which wants what the last render held.
  useLayoutEffect(() => {
    lastRef.current = { swapKey, children };
  });

  return (
    <div ref={boxRef} className={`${styles.pixelSwap} ${className ?? ''}`}>
      {leaving && (
        <div key={leaving.swapKey} ref={goingRef} className={`${styles.pixelLayer} ${styles.pixelLeaving}`} style={{ height: leaving.height }} aria-hidden="true">
          {leaving.children}
        </div>
      )}
      <div key={swapKey} ref={comingRef} className={styles.pixelLayer}>
        {children}
      </div>
    </div>
  );
}
