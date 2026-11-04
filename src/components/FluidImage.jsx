import { useEffect, useRef, useState } from 'react';
import styles from '../css/MemberProfile.module.css';
import createFluidSim from './fluidSim';

// Matches .fluid img's object-position.
const OBJECT_POSITION = { x: 0.5, y: 0.3 };
const MAX_PIXEL_RATIO = 2;
// How long after the last touch the water is taken as still, and the loop stops.
const CALM_MS = 3500;
// At most this many steps a frame, so that a slow frame does not make slower ones.
const MAX_STEPS = 2;

/*
 * A picture with water over it: see fluidSim. The <img> is the real thing, and
 * stays underneath; the canvas is decoration, laid over it once it has drawn. So
 * without WebGL2, with reduced motion or if the context is lost, it is just the
 * picture.
 *
 * The loop runs only while there is something to see: on screen, in a visible
 * tab, and until the water has been still for a while. Between touches it costs
 * nothing.
 */
export default function FluidImage({ src, alt }) {
  const boxRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const box = boxRef.current;
    const image = imageRef.current;
    const canvas = canvasRef.current;

    let sim = null;
    let frame = null;
    let onScreen = true;
    let moving = false;
    let lastTouch = 0;
    let lastFrame = 0;
    let owed = 0;
    let lastPoint = null;

    const stop = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
    };

    const tick = (now) => {
      if (now - lastTouch > CALM_MS) {
        frame = null;
        moving = false;
        sim.settle();
        sim.render();
        return;
      }

      owed = Math.min(owed + (now - lastFrame) / 1000, MAX_STEPS * sim.STEP_SECONDS);
      lastFrame = now;

      while (owed >= sim.STEP_SECONDS) {
        sim.step();
        owed -= sim.STEP_SECONDS;
      }

      sim.render();
      frame = window.requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame !== null || !sim || !moving || !onScreen || document.hidden) return;

      lastFrame = performance.now();
      frame = window.requestAnimationFrame(tick);
    };

    const onPointer = (event) => {
      if (!sim) return;

      const { left, top, width, height } = box.getBoundingClientRect();
      const x = (event.clientX - left) / width;
      const y = (event.clientY - top) / height;

      sim.splat(x, y, lastPoint ? x - lastPoint.x : 0, lastPoint ? y - lastPoint.y : 0);
      lastPoint = { x, y };
      lastTouch = performance.now();
      moving = true;
      wake();
    };

    const forgetPoint = () => {
      lastPoint = null;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else wake();
    };

    const onLost = (event) => {
      event.preventDefault();
      stop();
      sim = null;
      setDrawn(false);
    };

    const fit = () => {
      if (!sim) return;

      sim.resize(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
      sim.render();
    };

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) wake();
      else stop();
    });
    const resizing = new ResizeObserver(fit);

    const start = () => {
      sim = createFluidSim(canvas, image, OBJECT_POSITION);
      if (!sim) return;

      fit();
      setDrawn(true);
      resizing.observe(box);
      visibility.observe(box);
    };

    if (image.complete && image.naturalWidth) start();
    else image.addEventListener('load', start, { once: true });

    box.addEventListener('pointermove', onPointer);
    box.addEventListener('pointerdown', onPointer);
    box.addEventListener('pointerleave', forgetPoint);
    box.addEventListener('pointercancel', forgetPoint);
    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('webglcontextlost', onLost);

    return () => {
      stop();
      image.removeEventListener('load', start);
      box.removeEventListener('pointermove', onPointer);
      box.removeEventListener('pointerdown', onPointer);
      box.removeEventListener('pointerleave', forgetPoint);
      box.removeEventListener('pointercancel', forgetPoint);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      visibility.disconnect();
      resizing.disconnect();
      sim?.destroy();
    };
  }, [src]);

  return (
    <div ref={boxRef} className={styles.fluid}>
      <img ref={imageRef} src={src} alt={alt} />
      <canvas ref={canvasRef} className={drawn ? styles.fluidDrawn : undefined} aria-hidden="true" />
    </div>
  );
}
