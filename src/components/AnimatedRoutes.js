import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import HomePage from './HomePage';
import About from './About';
import Contact from './Contact';
import Apply from './Apply';
import Resources from './Resources';
import CoffeeChats from './CoffeeChats';
import Projects from './Projects';
import styles from '../css/AnimatedRoutes.module.css';
const ROUTE_ORDER = ['/', '/about', '/apply', '/coffeechats', '/projects', '/contact', '/resources'];

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/about', element: <About /> },
  { path: '/apply', element: <Apply /> },
  { path: '/coffeechats', element: <CoffeeChats /> },
  { path: '/projects', element: <Projects /> },
  { path: '/contact', element: <Contact /> },
  { path: '/resources', element: <Resources /> },
];

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

export default function AnimatedRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const element = useRoutes(routes);

  const prevPathRef = useRef(normalizePath(location.pathname));
  const directionRef = useRef(1);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const pageRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(undefined);

  const currentPath = normalizePath(location.pathname);

  if (currentPath !== prevPathRef.current) {
    const currentIdx = ROUTE_ORDER.indexOf(currentPath);
    const prevIdx = ROUTE_ORDER.indexOf(prevPathRef.current);

    if (currentIdx !== -1 && prevIdx !== -1) {
      directionRef.current = currentIdx >= prevIdx ? 1 : -1;
    }

    prevPathRef.current = currentPath;
  }

  const handleTouchStart = (event) => {
    touchStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  };

  const handleTouchEnd = (event) => {
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

  useLayoutEffect(() => {
    const page = pageRef.current;

    if (!page) {
      return undefined;
    }

    const updateHeight = () => {
      setContainerHeight(page.offsetHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(page);

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div
      className={styles.routeContainer}
      style={{ height: containerHeight }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={directionRef.current}>
        <motion.div
          key={location.pathname}
          ref={pageRef}
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
