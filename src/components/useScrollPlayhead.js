import { useEffect, useRef } from 'react';

/*
 * Reports how far scrolling has travelled inside a pinned section, measured in
 * screens: 0 the moment the section's sticky stage pins to the top, 1 after a
 * viewport of scrolling, 2 after two, and so on. One scene is one whole number
 * wide, which is what makes the number in the corner something you can point at
 * ("at playhead 1.4, bring the heading in").
 *
 * `onPlayhead` is called on a requestAnimationFrame tick and is expected to
 * write straight to the DOM. It deliberately does not set React state: the
 * value changes on every frame of a scroll, and routing that through a render
 * would put a full reconciliation between the scroll and the paint.
 *
 * The callback is held in a ref so that a caller passing a fresh closure each
 * render does not tear the scroll listener down and rebuild it.
 */
export default function useScrollPlayhead(sectionRef, onPlayhead, enabled = true) {
  const callbackRef = useRef(onPlayhead);
  callbackRef.current = onPlayhead;

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || !enabled) {
      return undefined;
    }

    let frameId = null;

    const measure = () => {
      frameId = null;

      // The section's top passes the viewport's top at playhead 0 and keeps
      // going negative from there, so -top is the distance travelled. Read
      // before anything this frame writes, so the two never interleave.
      const travelled = -section.getBoundingClientRect().top;

      callbackRef.current(Math.max(0, travelled) / window.innerHeight);
    };

    const schedule = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [sectionRef, enabled]);
}
