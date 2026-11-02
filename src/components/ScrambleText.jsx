import { useEffect, useLayoutEffect, useRef } from 'react';
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

/*
 * A sentence in runs, typed in as one with the scramble - each run in an
 * element of its own, a link or a mark, so the typing runs on across them
 * rather than around them. A run is `text`, with `href` for a link and
 * `className` for how it is set.
 *
 * Empty until `play` is first raised, then typed in after `delay` over
 * `duration`, and from then on left as it is: it has no way out, so it is
 * never typed in again. `instant` sets it all at once instead, for reduced
 * motion.
 *
 * Unlike ScrambleText the live copy is the real one, so its links can be
 * followed; the full sentence under it, holding the shape, is hidden from
 * everything.
 */
export function ScrambleRuns({ runs, play, delay = 0, duration, hold, instant, className }) {
  const nodeRefs = useRef([]);
  const playedRef = useRef(false);
  // Read in the effect by ref, so a new array of the same runs on a render
  // does not start the typing over.
  const runsRef = useRef(runs);
  const text = runs.map((run) => run.text).join('');

  runsRef.current = runs;

  useEffect(() => {
    const write = (typed) => {
      let start = 0;

      runsRef.current.forEach((run, index) => {
        const node = nodeRefs.current[index];

        if (node) node.textContent = typed.slice(start, start + run.text.length);
        start += run.text.length;
      });
    };

    if (instant || playedRef.current) {
      write(text);
      return undefined;
    }

    if (!play) {
      write('');
      return undefined;
    }

    let frame = null;
    const start = performance.now() + delay;

    const step = (now) => {
      const progress = Math.min(1, Math.max(0, (now - start) / duration));

      write(scramble('', text, progress, hold));
      if (progress >= 1) playedRef.current = true;
      frame = progress < 1 ? window.requestAnimationFrame(step) : null;
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [text, play, delay, duration, hold, instant]);

  return (
    <span className={`${styles.scrambleBox} ${className ?? ''}`}>
      <span className={styles.scrambleSizer} aria-hidden="true">
        {runs.map((run, index) => (
          <span key={index} className={run.className}>
            {run.text}
          </span>
        ))}
      </span>
      <span className={styles.scrambleLive}>
        {runs.map((run, index) => {
          const ref = (node) => {
            nodeRefs.current[index] = node;
          };

          return run.href ? (
            // Named by its full text, which its own content is only once typed.
            <a
              key={index}
              className={run.className}
              href={run.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={run.text}
            >
              <span ref={ref} />
            </a>
          ) : (
            <span key={index} ref={ref} className={run.className} />
          );
        })}
      </span>
    </span>
  );
}

/*
 * Keeps some text scrambling from whatever it last showed into `text`, each
 * time that changes, by handing `write` every string along the way: it can go
 * anywhere, in one element or across several. A change partway through carries
 * on from what is showing. The new text is padded out to the old one's length,
 * so a longer old one gives up its last letters in turn rather than losing them
 * all at once.
 *
 * `write` is called from here and nothing else writes that text, so the new
 * text can't paint for a frame before the scramble starts - and the work runs
 * in a layout effect, so the first frame is already the old text.
 */
export function useScrambleSwap(text, write, { duration, hold, instant }) {
  const shownRef = useRef(text);
  const writeRef = useRef(write);

  writeRef.current = write;

  useLayoutEffect(() => {
    const from = shownRef.current;
    const setShown = (value) => {
      shownRef.current = value;
      writeRef.current(value);
    };

    if (instant || from === text) {
      setShown(text);
      return undefined;
    }

    let frame = null;
    const start = performance.now();
    const target = text.padEnd(from.length);

    setShown(from);

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);

      setShown(progress < 1 ? scramble(from, target, progress, hold) : text);
      frame = progress < 1 ? window.requestAnimationFrame(step) : null;
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [text, duration, hold, instant]);
}
