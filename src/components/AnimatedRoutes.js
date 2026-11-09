import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import HomePage from './HomePage';
import About from './About';
import Contact from './Contact';
import Apply from './Apply';
import Projects from './Projects';
import Board from './Board';
import MemberProfile from './MemberProfile';
import NotFound from './NotFound';
import styles from '../css/AnimatedRoutes.module.css';
const ROUTE_ORDER = ['/', '/about', '/apply', '/board', '/projects', '/contact'];

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/about', element: <About /> },
  { path: '/board', element: <Board /> },
  { path: '/board/:slug', element: <MemberProfile /> },
  { path: '/apply', element: <Apply /> },
  { path: '/projects', element: <Projects /> },
  { path: '/contact', element: <Contact /> },
  { path: '*', element: <NotFound /> },
];

/* Where a path sits in the order: anything not in it, a member's page or the
   not-found page, is past the end, so that leaving it for any page is going back,
   sliding in from the left. */
const orderOf = (path) => {
  const index = ROUTE_ORDER.indexOf(path);

  return index === -1 ? ROUTE_ORDER.length : index;
};

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0.4,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0.4,
  }),
};

const SWIPE_THRESHOLD = 60;
const SWIPE_MAX_VERTICAL = 80;

/*
 * Anything that takes a sideways swipe for itself - the about page's team
 * carousel, a Swiper - marks itself with data-no-page-swipe, and a swipe that
 * starts inside it turns its slides and not the page.
 */
const OWN_SWIPE = '[data-no-page-swipe], .swiper';

export default function AnimatedRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const element = useRoutes(routes);

  const prevPathRef = useRef(normalizePath(location.pathname));
  const directionRef = useRef(1);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const pageObserverRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(undefined);

  const currentPath = normalizePath(location.pathname);

  if (currentPath !== prevPathRef.current) {
    directionRef.current = orderOf(currentPath) >= orderOf(prevPathRef.current) ? 1 : -1;
    prevPathRef.current = currentPath;
  }

  const handleTouchStart = (event) => {
    touchStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
      // A pinch, or a swipe something on the page is handling itself.
      ignore: event.touches.length > 1 || Boolean(event.target.closest?.(OWN_SWIPE)),
    };
  };

  const handleTouchEnd = (event) => {
    if (touchStartRef.current.ignore) {
      return;
    }

    const deltaX = event.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = event.changedTouches[0].clientY - touchStartRef.current.y;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_MAX_VERTICAL) {
      return;
    }

    const currentIdx = ROUTE_ORDER.indexOf(currentPath);

    if (currentIdx === -1) {
      return;
    }

    if (deltaX < 0 && currentIdx < ROUTE_ORDER.length - 1) {
      navigate(ROUTE_ORDER[currentIdx + 1]);
    } else if (deltaX > 0 && currentIdx > 0) {
      navigate(ROUTE_ORDER[currentIdx - 1]);
    }
  };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] };

  /*
   * The container takes the height of the newest page, followed from the
   * moment that page mounts. By a ref rather than an effect on the path, as
   * AnimatePresence can mount the new page a render after the path changes: an
   * effect could find the outgoing page still there, follow it, and collapse
   * to nothing when it left, clipping the new page away. Only the attaching is
   * of interest - the outgoing page detaching says nothing about the new one.
   */
  const trackPage = useCallback((page) => {
    if (!page) {
      return;
    }

    pageObserverRef.current?.disconnect();
    setContainerHeight(page.offsetHeight);

    // On the next frame, as resizing the container from inside the observer's own
    // callback, while a page is animating its height, is a ResizeObserver loop.
    let frameId = null;

    pageObserverRef.current = new ResizeObserver(() => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => setContainerHeight(page.offsetHeight));
    });
    pageObserverRef.current.observe(page);
  }, []);

  useEffect(() => () => pageObserverRef.current?.disconnect(), []);

  return (
    <div
      className={styles.routeContainer}
      style={{ height: containerHeight }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={directionRef.current}>
        <motion.div
          key={currentPath}
          ref={trackPage}
          custom={directionRef.current}
          variants={slideVariants}
          initial={prefersReducedMotion ? false : 'enter'}
          animate="center"
          exit={prefersReducedMotion ? undefined : 'exit'}
          transition={transition}
          className={styles.page}
        >
          {element}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
