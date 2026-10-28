import { useEffect, useRef } from 'react';
import styles from '../css/ImmersiveHero.module.css';
import scramble from './scramble';

/*
 * A line of text that types itself in with the scramble, once, when it
 * mounts - give it a new key to play it again.
 *
 * The full text sits invisibly underneath and holds the box's shape, so
 * nothing around it reflows as the letters arrive; the live letters are laid
 * over it.
 */
export default function ScrambleText({ text, delay, duration, hold, className }) {
  const liveRef = useRef(null);

  useEffect(() => {
    let frame = null;
    const start = performance.now() + delay;

    const step = (now) => {
      const progress = Math.min(1, Math.max(0, (now - start) / duration));

      if (liveRef.current) liveRef.current.textContent = scramble('', text, progress, hold);

      frame = progress < 1 ? window.requestAnimationFrame(step) : null;
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [text, delay, duration, hold]);

  return (
    <span className={`${styles.scrambleBox} ${className ?? ''}`}>
      <span className={styles.scrambleSizer} aria-hidden="true">
        {text}
      </span>
      <span className={styles.scrambleLive} aria-hidden="true">
        <span ref={liveRef} />
      </span>
    </span>
  );
}
