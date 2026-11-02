import { useEffect, useState } from 'react';

/* The page slides in over this long - see AnimatedRoutes. */
const ROUTE_SETTLE_MS = 400;

/*
 * Raised the first time `ref` is on screen, at least `bottomShare` of the
 * window's height clear of its bottom edge, and left raised.
 *
 * Asked of the element's position directly, on every scroll and resize and
 * once the route has settled, rather than of an IntersectionObserver: a page
 * that arrives by sliding in, scrolled to the bottom by a link from another
 * page, may give an observer no change to report, and there the reader cannot
 * scroll down to give it one. First asked on the next task, not here, so that
 * ScrollToTop has moved the window off wherever the last page left it.
 */
export default function useInViewOnce(ref, bottomShare = 0.1) {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (seen) return undefined;

    const check = () => {
      const node = ref.current;

      if (!node) return;

      const { top, bottom } = node.getBoundingClientRect();

      if (top < window.innerHeight * (1 - bottomShare) && bottom > 0) setSeen(true);
    };

    const first = window.setTimeout(check, 0);
    const settled = window.setTimeout(check, ROUTE_SETTLE_MS);

    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);

    return () => {
      window.clearTimeout(first);
      window.clearTimeout(settled);
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [ref, bottomShare, seen]);

  return seen;
}
