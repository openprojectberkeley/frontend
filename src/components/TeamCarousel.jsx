import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from "../css/About.module.css";
import scramble from './scramble';
import spring2026 from "../images/about/spring2026/carousel.jpg";
import fall2025 from "../images/about/fall2025/carousel.jpg";
import spring2025 from "../images/about/spring2025/carousel.jpg";
import fall2024 from "../images/about/fall2024/carousel.jpg";
import spring2024 from "../images/about/spring2024/carousel.jpg";
import fall2023 from "../images/about/fall2023/carousel.jpg";
import spring2023 from "../images/about/spring2023/carousel.jpg";

// Newest first: the carousel opens on the current team.
const semesters = [
  { label: 'Spring 2026', image: spring2026 },
  { label: 'Fall 2025', image: fall2025 },
  { label: 'Spring 2025', image: spring2025 },
  { label: 'Fall 2024', image: fall2024 },
  { label: 'Spring 2024', image: spring2024 },
  { label: 'Fall 2023', image: fall2023 },
  { label: 'Spring 2023', image: spring2023 },
];

// How far a drag has to travel, as a share of the frame's width, to turn the
// page - or how fast it has to be flicked, in px/ms, if it is shorter.
const SWIPE_DISTANCE = 0.18;
const SWIPE_VELOCITY = 0.5;
const CAPTION_SCRAMBLE_MS = 450;

const Chevron = ({ direction }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.carouselChevron}>
    <path d={direction === 'prev' ? 'M15 4 7 12l8 8' : 'M9 4l8 8-8 8'} />
  </svg>
);

/*
 * The semester's name under the photo. When it changes, the old name
 * scrambles into the new one; the real name is what screen readers get.
 */
function ScrambleCaption({ text, reducedMotion }) {
  const liveRef = useRef(null);
  const shownRef = useRef(text);

  useEffect(() => {
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

    const step = (now) => {
      const progress = Math.min(1, (now - start) / CAPTION_SCRAMBLE_MS);
      setShown(scramble(from, text, progress));
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
      <span ref={liveRef} aria-hidden="true">{text}</span>
    </span>
  );
}

export default function TeamCarousel() {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);
  const frameRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const count = semesters.length;

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
        >
          <div
            className={styles.carouselTrack}
            style={{
              transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
              transition: dragging || reducedMotion ? 'none' : undefined,
            }}
          >
            {semesters.map((semester, i) => (
              <img
                key={semester.label}
                src={semester.image}
                alt={`Open Project team, ${semester.label}`}
                className={styles.carouselSlide}
                aria-hidden={i !== index}
                draggable={false}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
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
