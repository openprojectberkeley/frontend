import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from "../css/About.module.css";
import scramble from './scramble';
import { carouselSemesters } from '../data/teamCarousel';

/*
 * Each semester's photo comes as a stack of parallax layers - layer1 the
 * background, each higher layer a cut-out that sits in front of the one
 * before - in images/about/<semester>/carousel_<code>/. The pages load the
 * WebP copies; the PNGs beside them are the sources. The semesters, and how
 * each one's photo sits, are in data/teamCarousel.js.
 */
const layerFiles = require.context('../images/about', true, /carousel_\w+\/layer\d+\.webp$/);
const layersFor = (semester) => layerFiles
  .keys()
  .filter((key) => key.startsWith(`./${semester}/`))
  .sort((x, y) => Number(x.match(/layer(\d+)/)[1]) - Number(y.match(/layer(\d+)/)[1]))
  .map((key) => layerFiles(key));

// "Spring 2026" -> images/about/spring2026/.
const semesters = carouselSemesters.map((semester) => ({
  ...semester,
  layers: layersFor(semester.label.toLowerCase().replace(/\s+/g, '')),
}));

// How far a drag has to travel, as a share of the frame's width, to turn the
// page - or how fast it has to be flicked, in px/ms, if it is shorter.
const SWIPE_DISTANCE = 0.18;
const SWIPE_VELOCITY = 0.5;
const CAPTION_SCRAMBLE_MS = 450;

// How far the back layer moves, as a share of the front one's travel (set in
// .carouselLayer); the layers between spread evenly. PARALLAX_EASE is how much
// of the way to the cursor the layers close each frame.
const PARALLAX_BACK = 0.15;
const PARALLAX_EASE = 0.08;

const Chevron = ({ direction }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.carouselChevron}>
    <path d={direction === 'prev' ? 'M15 4 7 12l8 8' : 'M9 4l8 8-8 8'} />
  </svg>
);

/*
 * The semester's name under the photo. When it changes, the old name
 * scrambles into the new one; the real name is what screen readers get.
 *
 * The visible letters are written only from here, never rendered by React, so
 * the new name can't paint for a frame before the scramble starts - and the
 * work runs in a layout effect, so the first frame is already the old name.
 * The new name is padded out to the old one's length, so a longer old name
 * gives up its last letters in turn rather than losing them all at once.
 */
function ScrambleCaption({ text, reducedMotion }) {
  const liveRef = useRef(null);
  const shownRef = useRef(text);

  useLayoutEffect(() => {
    const from = shownRef.current;
    const setShown = (value) => {
      shownRef.current = value;
      if (liveRef.current) liveRef.current.textContent = value;
    };

    if (reducedMotion || from === text) {
      setShown(text);
      return undefined;
    }

    let frame = null;
    const start = performance.now();

    const target = text.padEnd(from.length);
    setShown(from);

    const step = (now) => {
      const progress = Math.min(1, (now - start) / CAPTION_SCRAMBLE_MS);
      setShown(progress < 1 ? scramble(from, target, progress) : text);
      frame = progress < 1 ? window.requestAnimationFrame(step) : null;
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [text, reducedMotion]);

  return (
    <span className={styles.carouselLabel}>
      <span className={styles.visuallyHidden} aria-live="polite">{text}</span>
      <span ref={liveRef} aria-hidden="true" />
    </span>
  );
}

/*
 * Follows the mouse over the frame and eases the layers toward it, writing
 * the offset to the frame as --parallax-x / --parallax-y (-1 to 1) so the
 * slides move without re-rendering. Leaving the frame eases them home. Touch
 * and reduced motion get the still photo.
 */
function useParallax(frameRef, disabled) {
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef(null);

  useEffect(() => () => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
  }, []);

  const tick = () => {
    const el = frameRef.current;
    const c = current.current;
    const t = target.current;

    c.x += (t.x - c.x) * PARALLAX_EASE;
    c.y += (t.y - c.y) * PARALLAX_EASE;

    const settled = Math.abs(t.x - c.x) < 0.001 && Math.abs(t.y - c.y) < 0.001;
    if (settled) {
      c.x = t.x;
      c.y = t.y;
    }

    if (el) {
      el.style.setProperty('--parallax-x', c.x.toFixed(4));
      el.style.setProperty('--parallax-y', c.y.toFixed(4));
    }

    frame.current = settled ? null : window.requestAnimationFrame(tick);
  };

  const aim = (x, y) => {
    target.current = { x, y };
    if (frame.current === null) frame.current = window.requestAnimationFrame(tick);
  };

  const onPointerMove = (event) => {
    if (disabled || event.pointerType !== 'mouse') return;
    const rect = frameRef.current.getBoundingClientRect();
    const clamp = (value) => Math.max(-1, Math.min(1, value));
    aim(
      clamp(((event.clientX - rect.left) / rect.width) * 2 - 1),
      clamp(((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
  };

  const onPointerLeave = () => aim(0, 0);

  return { onPointerMove, onPointerLeave };
}

export default function TeamCarousel() {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);
  const frameRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const parallax = useParallax(frameRef, reducedMotion);
  const count = semesters.length;
  /*
   * Slides load their layers once they are the current one or next to it,
   * and keep them after, so the first visit doesn't fetch every semester.
   */
  const [loaded, setLoaded] = useState(() => new Set([0, 1, count - 1]));

  useEffect(() => {
    setLoaded((previous) => {
      const near = [index - 1, index, index + 1].map((i) => (i + count) % count);
      if (near.every((i) => previous.has(i))) return previous;
      return new Set([...previous, ...near]);
    });
  }, [index, count]);

  const go = (step) => setIndex((current) => (current + step + count) % count);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') go(-1);
    if (event.key === 'ArrowRight') go(1);
  };

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragRef.current = { startX: event.clientX, startTime: performance.now(), id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event) => {
    parallax.onPointerMove(event);
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    let offset = event.clientX - drag.startX;
    // Past either end there is nothing to drag in, so the track gives way
    // grudgingly rather than following the pointer.
    if ((index === 0 && offset > 0) || (index === count - 1 && offset < 0)) offset /= 3;
    setDragOffset(offset);
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const width = frameRef.current?.offsetWidth || 1;
    const distance = event.clientX - drag.startX;
    const velocity = Math.abs(distance) / Math.max(1, performance.now() - drag.startTime);
    const turned = Math.abs(distance) > width * SWIPE_DISTANCE || (velocity > SWIPE_VELOCITY && Math.abs(distance) > 10);

    if (turned) {
      const step = distance < 0 ? 1 : -1;
      setIndex((current) => Math.min(count - 1, Math.max(0, current + step)));
    }

    dragRef.current = null;
    setDragging(false);
    setDragOffset(0);
  };

  return (
    <section
      className={styles.teamCarousel}
      aria-roledescription="carousel"
      aria-label="Open Project teams by semester"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className={styles.carouselStage}>
        <button
          type="button"
          className={`${styles.carouselArrow} ${styles.carouselPrev}`}
          aria-label="Previous semester"
          onClick={() => go(-1)}
        >
          <Chevron direction="prev" />
        </button>

        <div
          ref={frameRef}
          className={`${styles.carouselFrame} ${dragging ? styles.carouselDragging : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={parallax.onPointerLeave}
        >
          <div
            className={styles.carouselTrack}
            style={{
              transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
              transition: dragging || reducedMotion ? 'none' : undefined,
            }}
          >
            {semesters.map((semester, i) => (
              <div
                key={semester.label}
                className={styles.carouselSlide}
                role="img"
                aria-label={`Open Project team, ${semester.label}`}
                aria-hidden={i !== index}
                style={{
                  '--parallax-strength': semester.parallax ?? 1,
                  '--shift-x': semester.shiftX ?? 0,
                  '--zoom': semester.zoom ?? 1,
                }}
              >
                {loaded.has(i) && semester.layers.map((layer, depth) => (
                  <img
                    key={layer}
                    src={layer}
                    alt=""
                    className={styles.carouselLayer}
                    style={{
                      '--depth': semester.layers.length > 1
                        ? PARALLAX_BACK + (1 - PARALLAX_BACK) * (depth / (semester.layers.length - 1))
                        : 0,
                    }}
                    draggable={false}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`${styles.carouselArrow} ${styles.carouselNext}`}
          aria-label="Next semester"
          onClick={() => go(1)}
        >
          <Chevron direction="next" />
        </button>
      </div>

      <div className={styles.carouselFooter}>
        <ScrambleCaption text={semesters[index].label} reducedMotion={reducedMotion} />
        <div className={styles.carouselDots}>
          {semesters.map((semester, i) => (
            <button
              key={semester.label}
              type="button"
              className={`${styles.carouselDot} ${i === index ? styles.carouselDotActive : ''}`}
              aria-label={`Show ${semester.label}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
