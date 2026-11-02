/*
 * Scrolls the window, easing in, for the links between the board and the
 * projects and for a project's row going back up to it.
 *
 * Where it is going is measured again on every frame rather than once at the
 * start, as the target will not hold still: a fast column on the board moves
 * at its own rate as the page scrolls - see useColumnDrift - photos loading
 * change the heights above it, and the page may still be settling from the
 * route it came from.
 *
 * Done once it is there, or the page can go no further, or after MAX_MS. Any
 * scrolling of the reader's own takes over at once, which counts as done too.
 * Another scroll starting in its place does not.
 */
/* How quickly it closes in: the distance left shrinks by about two thirds in
   this long, at any frame rate. */
const EASE_MS = 110;
const CLOSE_ENOUGH = 1;
const STUCK_FRAMES = 12;
const HEADER_CLEARANCE = 96;
const MAX_MS = 3000;

let stopRunning = null;

function easeScroll(distanceLeft, onDone) {
  stopRunning?.();

  const jump = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const started = performance.now();
  let frameId = null;
  let stuck = 0;
  let lastY = null;
  let lastFrame = started;

  const stop = () => {
    if (frameId !== null) window.cancelAnimationFrame(frameId);
    window.removeEventListener('wheel', finish);
    window.removeEventListener('touchstart', finish);
    window.removeEventListener('keydown', finish);
    stopRunning = null;
  };

  function finish() {
    stop();
    onDone?.();
  }

  const step = (now) => {
    const away = distanceLeft();

    stuck = window.scrollY === lastY ? stuck + 1 : 0;
    lastY = window.scrollY;

    if (Math.abs(away) <= CLOSE_ENOUGH || stuck >= STUCK_FRAMES || now - started > MAX_MS) {
      finish();
      return;
    }

    window.scrollBy(0, jump ? away : away * (1 - Math.exp(-(now - lastFrame) / EASE_MS)));
    lastFrame = now;
    frameId = window.requestAnimationFrame(step);
  };

  window.addEventListener('wheel', finish, { passive: true });
  window.addEventListener('touchstart', finish, { passive: true });
  window.addEventListener('keydown', finish);
  stopRunning = stop;
  frameId = window.requestAnimationFrame(step);
}

/* Until `element` is in the middle of the window, or if it is too tall for
   that, as high as the fixed header allows. */
export default function scrollToCentre(element, onDone) {
  if (!element) return;

  easeScroll(() => {
    const { top, height } = element.getBoundingClientRect();

    return top - Math.max((window.innerHeight - height) / 2, HEADER_CLEARANCE);
  }, onDone);
}
