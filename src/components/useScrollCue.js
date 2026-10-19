import { useEffect, useState } from 'react';

const AT_TOP_THRESHOLD = 8;

/*
 * Whether the "scroll down" cue should still be visible: true until the page
 * has moved off the top.
 *
 * Reads are throttled to one per frame, and the state only ever flips when the
 * page crosses the threshold, so scrolling the whole page costs two renders
 * rather than one per frame.
 */
export default function useScrollCue() {
  const [showScrollCue, setShowScrollCue] = useState(true);

  useEffect(() => {
    let frameId = null;

    const update = () => {
      frameId = null;
      setShowScrollCue(window.scrollY <= AT_TOP_THRESHOLD);
    };

    const onScroll = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return showScrollCue;
}
