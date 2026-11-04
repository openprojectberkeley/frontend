import { useEffect } from 'react';
import {
  TRAIL_BLOCK,
  TRAIL_MIN_RADIUS,
  TRAIL_RADIUS,
  blockLife,
  clamp01,
  createPixelTrail,
  smoothstep,
  stepped,
} from './pixelTrail';
import createBlobSim from './blobSim';

/* Past this much of the playhead the title is on its way into the zoom, and
   the trail leaves it be: what is left of it goes out, and no more is laid. */
const TITLE_PIXELS_UNTIL = 0.03;

/* How far past the title the title's grid reaches, in blocks, so the mark's
   float and the trail's edge are not cut off square at the lockup's box. */
const TITLE_PIXELS_MARGIN = 2;

/* Keeps the title's blocks apart from the strip's cards in blockNoise. */
const TITLE_PIXELS_SALT = 997;

/*
 * What the pointer feeds into the blob behind the title - see blobSim. Both come
 * from how fast the stroke is going, as the share of its full reach the trail has
 * given it (see createPixelTrail).
 *
 *   SKY_PIXEL        the size of one canvas pixel, in px, and so of the grain
 *   SKY_MIN_STRENGTH how much of the trail's reach a stroke needs before it pushes
 *                    the fluid about at all. Below it the blob only follows the
 *                    pointer, thin and calm
 */
const SKY_PIXEL = 2;
const SKY_MIN_STRENGTH = 0.5;

const svgMask = (body, columns, rows) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${columns} ${rows}' ` +
      `preserveAspectRatio='none' shape-rendering='crispEdges'>${body}</svg>`,
  )}")`;

const setMask = (element, mask, size, position) => {
  const { style } = element;

  style.maskImage = mask;
  style.webkitMaskImage = mask;
  style.maskSize = size;
  style.webkitMaskSize = size;
  style.maskPosition = position;
  style.webkitMaskPosition = position;
};

const clearMask = (element) => setMask(element, '', '', '');

/* A face's measurements at 100px: its cap height, and the top and bottom of
   its em box from the baseline. */
const faceMetrics = (font) => {
  const context = document.createElement('canvas').getContext('2d');

  context.font = `${font.weight} 100px ${font.family}`;

  const capital = context.measureText('H');

  return {
    cap: capital.actualBoundingBoxAscent,
    ascent: capital.fontBoundingBoxAscent,
    descent: capital.fontBoundingBoxDescent,
    context,
  };
};

/*
 * The scene 5 trail, over scene one: where the pointer has been, the
 * Montserrat phrase and the vector mark give way, block by block, to the
 * phrase in Argent Pixel CF and the mark as pixel art, and the sky behind
 * them to a liquid blob.
 *
 * One grid, laid from the stage's corner in TRAIL_BLOCK squares, decides it
 * all, so a block of static and a block of the title meet edge to edge.
 *
 * The title. Both faces are on the page the whole time - the real lockup,
 * and over it the pixel one - and each frame the trail is alive the blocks
 * over the title are written out twice, as two tiny SVG masks: the blocks on
 * the pixel layer, and everything but the blocks on the real mark and
 * phrase. Each block is the same stepped opacity in both, so where one face
 * fades out the other fades in. The pixel phrase is set a letter at a time
 * over the Montserrat one - the same cap height, each letter centred on its
 * twin - so the swap reads as the same word changing face, not a second word
 * underneath.
 *
 * The sky. A canvas over the stars, screened, so it only brightens, with a fluid
 * simulation on it that the pointer feeds along its whole path - see blobSim. The
 * title goes on following the trail, which is blocks; the sky follows the blob.
 *
 * Nothing runs while the pointer is still: the loop stops with the last of
 * the trail and the blob, and with it the masks come off, the pixel layer
 * is hidden and the static cleared. Off for touch, and for anyone who has asked for less
 * motion.
 */
export default function useTitlePixels({
  playheadRef,
  lockupRef,
  markBoxRef,
  typedRef,
  overlayRef,
  pixelMarkRef,
  pixelTextRef,
  staticRef,
}) {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const trail = createPixelTrail();
    let faces = null;
    let frame = 0;
    let showing = false;
    let blob = null;
    let blobTried = false;
    /* The pointer's path since the last frame. */
    let path = null;
    let lastMove = null;

    const parts = () => {
      const lockup = lockupRef.current;
      const markBox = markBoxRef.current;
      const typed = typedRef.current;
      const overlay = overlayRef.current;

      return lockup && markBox && typed && overlay ? { lockup, markBox, typed, overlay } : null;
    };

    const hideTitle = () => {
      const found = parts();

      showing = false;
      if (!found) return;

      clearMask(found.markBox);
      clearMask(found.typed);
      clearMask(found.overlay);
      delete found.overlay.dataset.showing;
    };

    const clearSky = () => {
      path = null;
      if (blob) blob.clear();
    };

    /* Puts each pixel letter over the middle of its Montserrat twin, on the
       same baseline, at the size that gives it the same cap height. */
    const setLetters = (typed, typedRect, scale) => {
      const text = pixelTextRef.current;
      const node = typed.firstChild;

      if (!text) return;

      /* The caret first: with nothing typed yet there are no letters, but
         there is still a caret. */
      const caret = typed.children[0];
      const pixelCaret = text.lastElementChild;

      if (caret && pixelCaret) {
        const rect = caret.getBoundingClientRect();

        pixelCaret.style.transform = `translate(${(rect.left - typedRect.left) / scale}px, ${
          (rect.top - typedRect.top) / scale
        }px)`;
        pixelCaret.style.width = `${caret.offsetWidth}px`;
        pixelCaret.style.height = `${caret.offsetHeight}px`;
      }

      if (!node || node.nodeType !== Node.TEXT_NODE) return;

      if (!faces) {
        const montserrat = faceMetrics({ weight: 700, family: 'Montserrat' });
        const argent = faceMetrics({ weight: 400, family: 'argent-pixel-cf' });

        faces = { montserrat, argent, ratio: montserrat.cap / argent.cap || 1 };
      }

      const measured = faces;

      /* Measured before the faces had arrived, the numbers are a fallback's:
         used for now, and taken again next time. */
      if (!document.fonts.check('700 16px Montserrat') || !document.fonts.check('400 16px argent-pixel-cf')) {
        faces = null;
      }

      const fontSize = Number.parseFloat(window.getComputedStyle(typed).fontSize);
      const size = fontSize * measured.ratio;
      const { montserrat, argent } = measured;
      /* The letters, then the caret, in both. */
      const glyphs = [...text.children].slice(0, -1);
      const range = document.createRange();
      const gradient = `${typed.offsetWidth}px ${typed.offsetHeight}px`;

      argent.context.font = `400 ${size}px argent-pixel-cf`;

      glyphs.forEach((glyph, index) => {
        if (index >= node.length) return;

        range.setStart(node, index);
        range.setEnd(node, index + 1);

        const letter = range.getBoundingClientRect();
        /* Montserrat's baseline: the top of its em box plus its ascent. */
        const baseline = (letter.top - typedRect.top) / scale + (montserrat.ascent * fontSize) / 100;
        const middle = (letter.left + letter.width / 2 - typedRect.left) / scale;
        const width = argent.context.measureText(glyph.textContent).width;
        /* line-height 1: the em box's top sits half the leading above the
           ascent. */
        const ascent = (argent.ascent * size) / 100;
        const descent = (argent.descent * size) / 100;
        const top = baseline - ascent - (size - ascent - descent) / 2;
        const left = middle - width / 2;
        const { style } = glyph;

        style.fontSize = `${size}px`;
        style.transform = `translate(${left}px, ${top}px)`;
        style.backgroundSize = gradient;
        style.backgroundPosition = `${-left}px ${-top}px`;
      });
    };

    const drawTitle = (found, grid, lives) => {
      const { lockup, markBox, typed, overlay } = found;
      const lockupRect = lockup.getBoundingClientRect();
      const markRect = markBox.getBoundingClientRect();
      const typedRect = typed.getBoundingClientRect();
      const margin = TRAIL_BLOCK * TITLE_PIXELS_MARGIN;

      /* The title's share of the stage's grid, in whole blocks. */
      const first = Math.max(0, Math.floor((Math.min(markRect.left, typedRect.left) - margin - grid.rect.left) / TRAIL_BLOCK));
      const top = Math.max(0, Math.floor((Math.min(markRect.top, typedRect.top) - margin - grid.rect.top) / TRAIL_BLOCK));
      const last = Math.min(
        grid.columns,
        Math.ceil((Math.max(markRect.right, typedRect.right) + margin - grid.rect.left) / TRAIL_BLOCK),
      );
      const bottom = Math.min(
        grid.rows,
        Math.ceil((Math.max(markRect.bottom, typedRect.bottom) + margin - grid.rect.top) / TRAIL_BLOCK),
      );
      const columns = last - first;
      const rows = bottom - top;

      if (columns <= 0 || rows <= 0) return false;

      /* The blocks, as runs along each row, one path per level. */
      const paths = new Map();

      for (let row = 0; row < rows; row += 1) {
        let run = -1;
        let runLevel = 0;

        for (let column = 0; column <= columns; column += 1) {
          const life =
            column < columns
              ? blockLife(lives[(row + top) * grid.columns + column + first], TITLE_PIXELS_SALT, column + first, row + top)
              : 0;
          const level = life > 0 ? stepped(life) : 0;

          if (run >= 0 && level !== runLevel) {
            paths.set(runLevel, `${paths.get(runLevel) || ''}M${run} ${row}h${column - run}v1h${run - column}z`);
            run = -1;
          }

          if (level > 0 && run < 0) {
            run = column;
            runLevel = level;
          }
        }
      }

      if (paths.size === 0) return false;

      let blocks = '';
      let holes = '';

      paths.forEach((d, level) => {
        blocks += `<path fill='white' fill-opacity='${level}' d='${d}'/>`;
        holes += `<path fill='black' fill-opacity='${level}' d='${d}'/>`;
      });

      const area = {
        left: grid.rect.left + first * TRAIL_BLOCK,
        top: grid.rect.top + top * TRAIL_BLOCK,
        width: columns * TRAIL_BLOCK,
        height: rows * TRAIL_BLOCK,
      };

      /* The lockup is scaled a touch by the time the zoom has started; the
         masks are in its own px, so the screen's are brought back to them. */
      const scale = lockupRect.width / lockup.offsetWidth || 1;
      const size = `${area.width / scale}px ${area.height / scale}px`;
      const at = (rect) => `${(area.left - rect.left) / scale}px ${(area.top - rect.top) / scale}px`;
      const unmask = svgMask(`<rect width='${columns}' height='${rows}' fill='white'/>${holes}`, columns, rows);

      setMask(markBox, unmask, size, at(markRect));
      setMask(typed, unmask, size, at(typedRect));

      /* The pixel layer is laid over the area itself, and its two faces put
         where the real ones are. */
      const { style } = overlay;

      style.left = `${(area.left - lockupRect.left) / scale}px`;
      style.top = `${(area.top - lockupRect.top) / scale}px`;
      style.width = `${area.width / scale}px`;
      style.height = `${area.height / scale}px`;
      setMask(overlay, svgMask(blocks, columns, rows), '100% 100%', '0 0');

      const place = (element, rect, box) => {
        if (!element) return;

        element.style.left = `${(rect.left - area.left) / scale}px`;
        element.style.top = `${(rect.top - area.top) / scale}px`;
        element.style.width = `${box.offsetWidth}px`;
        element.style.height = `${box.offsetHeight}px`;
      };

      place(pixelMarkRef.current, markRect, markBox);
      place(pixelTextRef.current, typedRect, typed);
      setLetters(typed, typedRect, scale);

      overlay.dataset.showing = '';

      return true;
    };

    const tick = (now) => {
      frame = 0;

      const found = parts();
      const canvas = staticRef.current;
      const alive = trail.prune(now);

      if (!found || !canvas || (!alive && !path && !(blob && blob.active(now)))) {
        if (showing) hideTitle();
        clearSky();
        return;
      }

      frame = requestAnimationFrame(tick);

      /* Not until the pointer first moves, so that a page nobody touches sets
         nothing up on the GPU. */
      if (!blobTried) {
        blobTried = true;
        blob = createBlobSim(canvas);
      }

      const rect = canvas.getBoundingClientRect();

      if (blob && blob.resize(rect.width, rect.height, SKY_PIXEL)) {
        if (path) {
          blob.feed(
            {
              ...path,
              fromX: path.fromX - rect.left,
              fromY: path.fromY - rect.top,
              toX: path.toX - rect.left,
              toY: path.toY - rect.top,
            },
            now,
          );
        }

        blob.advance(now);
        blob.render(now);
      }

      path = null;

      const grid = {
        rect,
        columns: Math.ceil(rect.width / TRAIL_BLOCK),
        rows: Math.ceil(rect.height / TRAIL_BLOCK),
      };
      const lives = alive ? trail.coverage(grid.rect, grid.columns, grid.rows, now) : null;

      if (lives && drawTitle(found, grid, lives)) showing = true;
      else if (showing) hideTitle();
    };

    /* The pointer has gone, or the title has: the next stroke starts afresh,
       and what is already in the blob finishes on its own. */
    const lift = () => {
      trail.lift();
      lastMove = null;
    };

    /* Adds this move to the path the next frame feeds in, however many moves the
       mouse reports in a frame. */
    const extendPath = (x, y, now, reach) => {
      const previous = lastMove;

      lastMove = { x, y, t: now };

      if (!previous || now <= previous.t || now - previous.t > 150) return;

      const strength = clamp01((reach - TRAIL_MIN_RADIUS) / (TRAIL_RADIUS - TRAIL_MIN_RADIUS));
      const power = smoothstep((strength - SKY_MIN_STRENGTH) / (1 - SKY_MIN_STRENGTH));

      path = {
        fromX: path ? path.fromX : previous.x,
        fromY: path ? path.fromY : previous.y,
        toX: x,
        toY: y,
        elapsed: (path ? path.elapsed : 0) + now - previous.t,
        body: strength,
        power,
      };
    };

    const onMove = (event) => {
      if (playheadRef.current > TITLE_PIXELS_UNTIL) {
        lift();
        return;
      }

      const now = performance.now();
      const reach = trail.add(event.clientX, event.clientY, now);

      extendPath(event.clientX, event.clientY, now, reach);

      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => lift();

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      hideTitle();
      clearSky();
    };
  }, [playheadRef, lockupRef, markBoxRef, typedRef, overlayRef, pixelMarkRef, pixelTextRef, staticRef]);
}
