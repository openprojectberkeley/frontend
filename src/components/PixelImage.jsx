import { useEffect, useRef } from 'react';
import styles from '../css/MemberProfile.module.css';
import {
  TRAIL_BLOCK,
  TRAIL_OUTLINE,
  blockLife,
  createPixelTrail,
  drawCover,
  stepped,
} from './pixelTrail';

// Matches .pixelPhoto img's object-position.
const OBJECT_POSITION = { x: 0.5, y: 0.3 };

/*
 * A picture that pixelates under the pointer, in the trail the community strip
 * leaves: see pixelTrail, and MomentStrip for the same drawing over its cards. The
 * <img> is the real thing, and stays underneath; the canvas is decoration over it.
 * So for touch, which has no pointer to leave a trail, or with reduced motion, it
 * is just the picture.
 *
 * The picture is shrunk to one pixel per block once, as it does not change, and
 * each block the trail covers is stretched back up from its pixel. The loop runs
 * only while some of the trail is still alive, so a still pointer costs nothing a
 * moment after it stops.
 */
export default function PixelImage({ src, alt }) {
  const boxRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const box = boxRef.current;
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const scratch = document.createElement('canvas');
    const scratchContext = scratch.getContext('2d');
    const trail = createPixelTrail();
    let frame = 0;
    let columns = 1;
    let rows = 1;
    let shrunk = false;

    const fit = () => {
      const { width, height } = box.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      columns = Math.max(1, Math.round(width / TRAIL_BLOCK));
      rows = Math.max(1, Math.round(height / TRAIL_BLOCK));
      shrunk = false;
    };

    const shrink = () => {
      scratch.width = columns;
      scratch.height = rows;
      drawCover(scratchContext, image, image.naturalWidth, image.naturalHeight, columns, rows, OBJECT_POSITION);
      shrunk = true;
    };

    const tick = (now) => {
      frame = 0;

      const alive = trail.prune(now);

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (!alive) return;

      if (!shrunk) shrink();

      const rect = box.getBoundingClientRect();
      const ratio = canvas.width / rect.width;
      const blockWidth = canvas.width / columns;
      const blockHeight = canvas.height / rows;
      const lives = trail.coverage(rect, columns, rows, now);

      context.imageSmoothingEnabled = false;
      context.lineWidth = ratio;

      if (lives) {
        lives.forEach((covered, key) => {
          const column = key % columns;
          const row = Math.floor(key / columns);
          const life = blockLife(covered, 0, column, row);

          if (life <= 0) return;

          const left = column * blockWidth;
          const top = row * blockHeight;

          context.globalAlpha = stepped(life);
          context.drawImage(scratch, column, row, 1, 1, left, top, blockWidth, blockHeight);

          /* A thin white edge round the block, rising from nothing and falling
             back over its life. */
          const strength = TRAIL_OUTLINE * Math.sin(Math.PI * life);

          if (strength >= 0.02) {
            context.globalAlpha = 1;
            context.strokeStyle = `rgba(255, 255, 255, ${strength.toFixed(3)})`;
            context.strokeRect(left + ratio / 2, top + ratio / 2, blockWidth - ratio, blockHeight - ratio);
          }
        });
      }

      context.globalAlpha = 1;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      if (!image.naturalWidth) return;

      trail.add(event.clientX, event.clientY, performance.now());

      if (!frame) frame = requestAnimationFrame(tick);
    };

    /* Coming back in somewhere else should not draw a streak across the picture
       from where the pointer went out. */
    const onLeave = () => trail.lift();

    const resizing = new ResizeObserver(fit);

    resizing.observe(box);
    fit();
    box.addEventListener('mousemove', onMove, { passive: true });
    box.addEventListener('mouseleave', onLeave);

    /* A new picture in the same box: what was shrunk is of the old one. */
    const onLoad = () => {
      shrunk = false;
    };

    image.addEventListener('load', onLoad);

    return () => {
      resizing.disconnect();
      box.removeEventListener('mousemove', onMove);
      box.removeEventListener('mouseleave', onLeave);
      image.removeEventListener('load', onLoad);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [src]);

  return (
    <div ref={boxRef} className={styles.pixelPhoto}>
      <img ref={imageRef} src={src} alt={alt} />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
