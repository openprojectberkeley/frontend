import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from "../css/About.module.css";
import homeStyles from "../css/HomePage.module.css";
import useScrollCue from './useScrollCue';
import AboutScene from './AboutScene';
import StarField, { useStarParallax } from './StarField';
import TeamCarousel from './TeamCarousel';

export default function About() {
  const nextSectionRef = useRef(null);
  const showScrollCue = useScrollCue();
  const reducedMotion = useReducedMotion();
  /*
   * Whether the opening is on screen, which plays its heading and mission in:
   * raised once its top is a quarter of the way up the window, lowered when it
   * has gone out of view altogether, so coming back to it plays them again.
   */
  const [arrived, setArrived] = useState(false);

  useStarParallax(nextSectionRef);

  useEffect(() => {
    const section = nextSectionRef.current;

    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setArrived(entry.isIntersecting),
      { rootMargin: '0px 0px -25% 0px' },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <TeamCarousel />

      <div className={`${styles.aboutTopHalf} limitWidth`}>
        <button
          type="button"
          className={homeStyles.scrollCue}
          aria-label="Scroll down"
          onClick={() => nextSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          style={{ opacity: showScrollCue ? 1 : 0, pointerEvents: showScrollCue ? 'auto' : 'none' }}
        >
          <span className={homeStyles.scrollCueMain}>⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho1}`} aria-hidden="true">⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho2}`} aria-hidden="true">⌄</span>
        </button>
      </div>

      {/* The opening the home page's hero used to end on: the heading, the
          mission and the four values, under the same stars. */}
      <section ref={nextSectionRef} className={styles.aboutScene}>
        <StarField />
        <div className={`${styles.aboutSceneInner} limitWidth`}>
          <AboutScene arrived={arrived} reducedMotion={reducedMotion} />
        </div>
      </section>
    </>
  );
}
