import { useEffect } from 'react';
import { TRAIL_BLOCK, blockLife, createPixelTrail, stepped } from './pixelTrail';

/* Past this much of the playhead the title is on its way into the zoom, and
   the trail leaves it be: what is left of it goes out, and no more is laid. */
const TITLE_PIXELS_UNTIL = 0.03;

/* How far past the title the title's grid reaches, in blocks, so the mark's
   float and the trail's edge are not cut off square at the lockup's box. */
const TITLE_PIXELS_MARGIN = 2;

/* Keeps the title's blocks apart from the strip's cards in blockNoise. */
const TITLE_PIXELS_SALT = 997;

/*
 * The static the trail leaves on the backdrop.
 *
 *   STATIC_GRAIN   the size of one grain of it, in px
 *   STATIC_COLOURS what a grain can be: the navy of the page's own grain
 *                  towards the bottom right (see --page-backdrop), taken
 *                  up through brighter blues, so the static reads as that
 *                  grain lit up rather than as a grey fizz
 *   STATIC_LOW     the dimmest a grain gets, as a share of its colour; a
 *                  spread of brightness is what keeps it from reading as
 *                  confetti
 *   STATIC_ALPHA   how strong a fresh block of it is, before its steps
 *   STATIC_TILES   how many sheets of noise are made up front. Each frame
 *                  every block takes a random patch of a random sheet, so it
 *                  seethes without any noise being made per frame
 *   STATIC_TILE    the size of each sheet, in grains
 */
const STATIC_GRAIN = 2;
const STATIC_COLOURS = [
  [0x10, 0x24, 0x68],
  [0x1c, 0x3c, 0xb4],
  [0x2e, 0x5c, 0xf0],
  [0x4a, 0x7c, 0xff],
  [0x86, 0xa8, 0xff],
];
const STATIC_LOW = 0.35;
const STATIC_ALPHA = 0.5;
const STATIC_TILES = 4;
const STATIC_TILE = 128;

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

const makeTiles = () =>
  Array.from({ length: STATIC_TILES }, () => {
    const tile = document.createElement('canvas');
    const context = tile.getContext('2d');
    const image = context.createImageData(STATIC_TILE, STATIC_TILE);

    for (let key = 0; key < image.data.length; key += 4) {
      const [red, green, blue] = STATIC_COLOURS[Math.floor(Math.random() * STATIC_COLOURS.length)];
      const bright = STATIC_LOW + Math.random() * (1 - STATIC_LOW);

      image.data[key] = red * bright;
      image.data[key + 1] = green * bright;
      image.data[key + 2] = blue * bright;
      image.data[key + 3] = 255;
    }

    tile.width = STATIC_TILE;
    tile.height = STATIC_TILE;
    context.putImageData(image, 0, 0);

    return tile;
  });

/*
 * The scene 5 trail, over scene one: where the pointer has been, the
 * Montserrat phrase and the vector mark give way, block by block, to the
 * phrase in Argent Pixel CF and the mark as pixel art, and the sky behind
 * them to static in the mark's colours.
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
 * The sky. A canvas over the stars, screened, so it only brightens: each
 * block the trail covers is a patch of noise in the mark's colours, a
 * different patch every frame.
 *
 * Nothing runs while the pointer is still: the loop stops with the last of
 * the trail, and with it the masks come off, the pixel layer is hidden and
 * the static cleared. Off for touch, and for anyone who has asked for less
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
    let tiles = null;
    let faces = null;
    let frame = 0;
    let showing = false;
    let painted = false;

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

    const clearStatic = () => {
      const canvas = staticRef.current;

      painted = false;
      if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };

    /* The stage's grid: its origin on the screen, and its blocks. */
    const gridOf = (canvas) => {
      const rect = canvas.getBoundingClientRect();

      return {
        rect,
        columns: Math.ceil(rect.width / TRAIL_BLOCK),
        rows: Math.ceil(rect.height / TRAIL_BLOCK),
      };
    };

    const drawStatic = (canvas, grid, lives) => {
      const width = Math.ceil(grid.rect.width / STATIC_GRAIN);
      const height = Math.ceil(grid.rect.height / STATIC_GRAIN);
      const context = canvas.getContext('2d');

      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      if (!tiles) tiles = makeTiles();

      context.clearRect(0, 0, width, height);

      const block = TRAIL_BLOCK / STATIC_GRAIN;
      let any = false;

      lives.forEach((covered, key) => {
        const column = key % grid.columns;
        const row = Math.floor(key / grid.columns);
        const life = blockLife(covered, TITLE_PIXELS_SALT + 1, column, row);

        if (life <= 0) return;

        const tile = tiles[Math.floor(Math.random() * STATIC_TILES)];
        const sourceX = Math.floor(Math.random() * (STATIC_TILE - block));
        const sourceY = Math.floor(Math.random() * (STATIC_TILE - block));

        context.globalAlpha = stepped(life) * STATIC_ALPHA;
        context.drawImage(tile, sourceX, sourceY, block, block, column * block, row * block, block, block);
        any = true;
      });

      context.globalAlpha = 1;
      painted = any;
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

      if (!trail.prune(now) || !found || !canvas) {
        if (showing) hideTitle();
        if (painted) clearStatic();
        return;
      }

      frame = requestAnimationFrame(tick);

      const grid = gridOf(canvas);
      const lives = trail.coverage(grid.rect, grid.columns, grid.rows, now);

      if (!lives) {
        if (showing) hideTitle();
        if (painted) clearStatic();
        return;
      }

      drawStatic(canvas, grid, lives);

      if (drawTitle(found, grid, lives)) showing = true;
      else if (showing) hideTitle();
    };

    const onMove = (event) => {
      if (playheadRef.current > TITLE_PIXELS_UNTIL) {
        trail.lift();
        return;
      }

      trail.add(event.clientX, event.clientY, performance.now());

      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => trail.lift();

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      hideTitle();
      clearStatic();
    };
  }, [playheadRef, lockupRef, markBoxRef, typedRef, overlayRef, pixelMarkRef, pixelTextRef, staticRef]);
}
