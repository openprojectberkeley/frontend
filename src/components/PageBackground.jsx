import { useEffect, useRef, useState } from 'react';
import styles from '../css/PageBackground.module.css';

export default function PageBackground({ variant, className = '', children }) {
  const pageBgRef = useRef(null);
  const [scrollState, setScrollState] = useState({ scrollY: 0, showScrollCue: true });

  useEffect(() => {
    const pageBg = pageBgRef.current;

    if (!pageBg) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId = null;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const offset = prefersReducedMotion ? 0 : Math.round(scrollY * 0.5);

      pageBg.style.setProperty('--page-bg-offset', `${offset}px`);
      setScrollState({
        scrollY,
        showScrollCue: scrollY <= 8,
      });
      frameId = null;
    };

    const onScroll = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const content = typeof children === 'function' ? children(scrollState) : children;

  return (
    <div
      ref={pageBgRef}
      className={`${styles.pageBG} ${styles[variant]} ${className}`.trim()}
    >
      {content}
    </div>
  );
}
