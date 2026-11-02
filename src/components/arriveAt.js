import styles from '../css/ArrivalLines.module.css';
import scrollToCentre from './scrollToCentre';

/* The page slides in over 400ms - see AnimatedRoutes. */
const ROUTE_SETTLE_MS = 450;
// How far each line is from the next, and how much thicker than that it is, so
// that they overlap and the seams between them hardly show.
const LINE_PITCH_PX = 20;
const LINE_OVERLAP_PX = 2;
// Matches .line's animation.
const LINE_MS = 850;
// Less than the time .line holds across, so all of them are across together.
const STAGGER_MS = 90;

// What is being arrived at, marked with data-arriving until the lines are done:
// the board holds its hover back for that long - see .person.
let arriving = null;

const finishArriving = (element) => {
  delete element.dataset.arriving;
  if (arriving === element) arriving = null;
};

const playLines = (box, onDone) => {
  if (!box.isConnected) {
    onDone();
    return;
  }

  box.querySelector(`:scope > .${styles.lines}`)?.remove();

  const { width, height } = box.getBoundingClientRect();
  const side = Math.ceil((width + height) / Math.SQRT2);
  const lines = document.createElement('span');
  const turned = document.createElement('span');

  lines.className = styles.lines;
  lines.setAttribute('aria-hidden', 'true');
  turned.className = styles.turned;
  turned.style.width = `${side}px`;
  turned.style.height = `${side}px`;

  for (let drawn = 0; drawn < side; drawn += LINE_PITCH_PX) {
    const line = document.createElement('span');

    line.className = styles.line;
    line.style.height = `${LINE_PITCH_PX + LINE_OVERLAP_PX}px`;
    line.style.marginBottom = `-${LINE_OVERLAP_PX}px`;
    line.style.animationDelay = `${Math.random() * STAGGER_MS}ms`;
    turned.append(line);
  }

  lines.append(turned);
  box.append(lines);
  window.setTimeout(() => {
    lines.remove();
    onDone();
  }, LINE_MS + STAGGER_MS);
};

/*
 * For a link to something on another page: scrolls to it and then, once it is
 * there and the page has settled, runs white lines over it so the reader sees
 * what they came to. The lines go over the `data-arrival-box` inside it, if it
 * has one. Positioned, as they are laid over it.
 */
export default function arriveAt(element) {
  const started = performance.now();

  if (arriving) finishArriving(arriving);
  arriving = element;
  element.dataset.arriving = '';

  scrollToCentre(element, () => {
    // Once more after the page has settled, as that can move what it arrived at.
    window.setTimeout(
      () => scrollToCentre(element, () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          finishArriving(element);
          return;
        }

        playLines(element.querySelector('[data-arrival-box]') ?? element, () => finishArriving(element));
      }),
      Math.max(0, started + ROUTE_SETTLE_MS - performance.now()),
    );
  });
}
