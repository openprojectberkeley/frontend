import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { NavHashLink } from 'react-router-hash-link';
import aboutStyles from '../css/About.module.css';
import styles from '../css/Projects.module.css';
import scrollToCentre from './scrollToCentre';
import PixelSwap from './PixelSwap';
import { useScrambleSwap } from './ScrambleText';
import { Chevron } from './TeamCarousel';
import { orderedProjects } from '../data/projectsData';
import coffeeCupIcon from '../images/projects/coffee-cup.svg';

export const toAnchorId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* How many of the three pips each difficulty fills. */
const DIFFICULTY_LEVELS = { beginner: 1, intermediate: 2, advanced: 3 };

// The collage's frames, filled from the first: photos are `photos` on a project
// in projectsData.js, and any frames left over stay as empty tinted ones.
const COLLAGE_FRAMES = 4;

// The size of the blocks the icon and the collage change in, in px.
const ICON_BLOCK = 6;
const COLLAGE_BLOCK = 16;

const FIELD_SCRAMBLE_MS = 500;
const DESCRIPTION_SCRAMBLE_MS = 700;
const DESCRIPTION_SCRAMBLE_HOLD = 0.08;
const COFFEE_CHAT_LABEL = 'Coffee Chat Required';

// How far a drag has to travel, as a share of the frame's width, to turn the
// page - or how fast it has to be flicked, in px/ms, if it is shorter - as in
// TeamCarousel. DRAG_START is how far it goes before it counts as one at all.
const SWIPE_DISTANCE = 0.18;
const SWIPE_VELOCITY = 0.5;
const DRAG_START = 8;

/* The same on a tile and on its slide. */
export function ProjectPMs({ pms }) {
  return (
    <p className={styles.projectPMs}>
      {pms.map((pm, index) => (
        <span key={pm}>
          <NavHashLink
            smooth
            className={styles.projectManagerLink}
            to={`/board/#pm-${toAnchorId(pm)}`}
            scroll={scrollToCentre}
            draggable={false}
          >
            {pm}
          </NavHashLink>
          {index < pms.length - 1 && (index === pms.length - 2 ? ' and ' : ', ')}
        </span>
      ))}
    </p>
  );
}

export function ProjectDifficulty({ difficulty }) {
  return (
    <p className={styles.projectDifficulty}>
      <span className={styles.difficultyPips} aria-hidden="true">
        {[1, 2, 3].map((pip) => (
          <span key={pip} className={pip <= DIFFICULTY_LEVELS[difficulty] ? styles.pipOn : undefined} />
        ))}
      </span>
      {difficulty}
    </p>
  );
}

export function CoffeeChatBadge() {
  return (
    <div className={styles.coffeeChatBadge}>
      <img src={coffeeCupIcon} alt="" className={styles.coffeeIcon} aria-hidden="true" />
      <span>{COFFEE_CHAT_LABEL}</span>
    </div>
  );
}

/* A field of the slide, scrambling into its next project's, with the real text
   for screen readers. */
function ScrambleSwap({ text, duration = FIELD_SCRAMBLE_MS, hold, instant }) {
  const liveRef = useRef(null);

  useScrambleSwap(
    text,
    (shown) => {
      if (liveRef.current) liveRef.current.textContent = shown;
    },
    { duration, hold, instant },
  );

  return (
    <>
      <span ref={liveRef} aria-hidden="true" />
      <span className={aboutStyles.visuallyHidden}>{text}</span>
    </>
  );
}

const pmSeparator = (pms, index) => {
  if (index === pms.length - 1) return '';

  return index === pms.length - 2 ? ' and ' : ', ';
};

/*
 * The project managers, scrambled as one line, cut up across their links and
 * what is between them: two names can become four with no name just appearing.
 * The links go to the new names at once. What is left of a longer old line, as
 * it goes, is in a span after them all.
 */
function ScrambledPMs({ pms, instant }) {
  const linkRefs = useRef([]);
  const separatorRefs = useRef([]);
  const restRef = useRef(null);
  const line = pms.map((pm, index) => pm + pmSeparator(pms, index)).join('');

  useScrambleSwap(
    line,
    (shown) => {
      let start = 0;
      const take = (node, length) => {
        if (node) node.textContent = shown.slice(start, start + length);
        start += length;
      };

      pms.forEach((pm, index) => {
        take(linkRefs.current[index], pm.length);
        take(separatorRefs.current[index], pmSeparator(pms, index).length);
      });
      if (restRef.current) restRef.current.textContent = shown.slice(start);
    },
    { duration: FIELD_SCRAMBLE_MS, instant },
  );

  return (
    <p className={styles.projectPMs}>
      {pms.map((pm, index) => (
        // By place, as their text is written from here rather than by React.
        <React.Fragment key={index}>
          <NavHashLink
            smooth
            className={styles.projectManagerLink}
            to={`/board/#pm-${toAnchorId(pm)}`}
            scroll={scrollToCentre}
            draggable={false}
            aria-label={pm}
          >
            <span
              ref={(node) => {
                linkRefs.current[index] = node;
              }}
            />
          </NavHashLink>
          <span
            ref={(node) => {
              separatorRefs.current[index] = node;
            }}
          />
        </React.Fragment>
      ))}
      <span ref={restRef} aria-hidden="true" />
    </p>
  );
}

const ProjectIcon = ({ project }) => (project.logo ? (
  <img src={project.logo} alt={`${project.name} logo`} className={styles.projectLogo} draggable={false} />
) : (
  <span aria-hidden="true">{project.name[0]}</span>
));

/*
 * A project's words, laid out but never seen, all of them in one grid cell with
 * the live ones: stacked up, the column is then as tall as the longest project's,
 * and the page under it holds still as the words change.
 */
function SlideTextSizer({ project }) {
  return (
    <div className={styles.highlightSizer} aria-hidden="true" inert="">
      <div className={styles.highlightHeading}>
        <div className={styles.highlightIcon} />
        <div className={styles.projectTitle}>
          <h2 className={styles.highlightName}>{project.name}</h2>
          {project.clientName && <p className={styles.projectClient}>{project.clientName}</p>}
        </div>
      </div>
      <p className={styles.projectPMs}>{project.pms.map((pm, index) => pm + pmSeparator(project.pms, index)).join('')}</p>
      <div className={styles.highlightMeta}>
        <p className={styles.projectDifficulty}>{project.difficulty}</p>
        {project.coffeeChatRequired && <div className={styles.coffeeChatBadge}>{COFFEE_CHAT_LABEL}</div>}
      </div>
      <p className={styles.highlightDescription}>{project.description}</p>
    </div>
  );
}

function HighlightSlide({ project }) {
  const instant = useReducedMotion();
  const photos = project.photos || [];
  const level = DIFFICULTY_LEVELS[project.difficulty] || 0;

  return (
    <div
      id={`project-${toAnchorId(project.name)}`}
      className={styles.highlightSlide}
      role="group"
      aria-roledescription="slide"
      aria-label={project.name}
    >
      <div className={styles.highlightText}>
        <div className={styles.highlightLive}>
          <div className={styles.highlightHeading}>
            <PixelSwap swapKey={project.name} block={ICON_BLOCK} className={styles.highlightIcon}>
              <ProjectIcon project={project} />
            </PixelSwap>
            <div className={styles.projectTitle}>
              <h2 className={styles.highlightName}>
                <ScrambleSwap text={project.name} instant={instant} />
              </h2>
              <p className={styles.projectClient}>
                <ScrambleSwap text={project.clientName || ''} instant={instant} />
              </p>
            </div>
          </div>

          <ScrambledPMs pms={project.pms} instant={instant} />

          {/* Always here, so that the description does not move for them. */}
          <div className={styles.highlightMeta}>
            <p className={`${styles.projectDifficulty} ${project.difficulty ? '' : styles.metaAbsent}`}>
              <span className={styles.difficultyPips} aria-hidden="true">
                {[1, 2, 3].map((pip) => (
                  <span key={pip} className={pip <= level ? styles.pipOn : undefined} />
                ))}
              </span>
              <span><ScrambleSwap text={project.difficulty || ''} instant={instant} /></span>
            </p>
            <div className={`${styles.coffeeChatBadge} ${project.coffeeChatRequired ? '' : styles.metaAbsent}`}>
              <img src={coffeeCupIcon} alt="" className={styles.coffeeIcon} aria-hidden="true" />
              <span><ScrambleSwap text={project.coffeeChatRequired ? COFFEE_CHAT_LABEL : ''} instant={instant} /></span>
            </div>
          </div>

          <p className={styles.highlightDescription} data-selectable>
            <ScrambleSwap
              text={project.description}
              duration={DESCRIPTION_SCRAMBLE_MS}
              hold={DESCRIPTION_SCRAMBLE_HOLD}
              instant={instant}
            />
          </p>
        </div>

        {orderedProjects.map((other) => <SlideTextSizer key={other.name} project={other} />)}
      </div>

      <div className={styles.collage}>
        {Array.from({ length: COLLAGE_FRAMES }, (_, slot) => {
          const photo = photos[slot];
          const frameStyle = { '--accent': project.accent };

          return (
            <PixelSwap key={slot} swapKey={project.name} block={COLLAGE_BLOCK} seed={slot + 1} className={styles.collageSlot}>
              {photo ? (
                <img
                  src={photo}
                  alt={`${project.name}, ${slot + 1} of ${photos.length}`}
                  className={styles.collageFrame}
                  style={frameStyle}
                  draggable={false}
                />
              ) : (
                <span className={styles.collageFrame} style={frameStyle} aria-hidden="true" />
              )}
            </PixelSwap>
          );
        })}
      </div>
    </div>
  );
}

/*
 * Every project in turn, under the page's heading: the about page's carousel,
 * how it is steered and what it looks like, but holding still. The words on the
 * slide scramble into the next project's, and its icon and pictures give way to
 * theirs in blocks - see PixelSwap.
 *
 * A press is not a drag until it has moved, which leaves the links to the board
 * their clicks, and a mouse pressed on a description selects its text.
 *
 * Which one shows is up to the page, as the tiles below it choose too.
 */
export default function ProjectHighlights({ index, onSelect, sectionRef }) {
  const dragRef = useRef(null);
  const frameRef = useRef(null);
  const count = orderedProjects.length;

  const go = (step) => onSelect((index + step + count) % count);

  // So that what comes next has something to show as it comes in.
  useEffect(() => {
    orderedProjects.forEach(({ logo }) => {
      if (logo) new Image().src = logo;
    });
  }, []);

  useEffect(() => {
    [index - 1, index + 1].forEach((near) => {
      (orderedProjects[(near + count) % count].photos || []).forEach((photo) => {
        new Image().src = photo;
      });
    });
  }, [index, count]);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') go(-1);
    if (event.key === 'ArrowRight') go(1);
  };

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.pointerType === 'mouse' && event.target.closest('[data-selectable]')) return;

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startTime: performance.now(),
      id: event.pointerId,
      moved: false,
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId || drag.moved) return;

    const offset = Math.abs(event.clientX - drag.startX);

    if (offset < DRAG_START || offset < Math.abs(event.clientY - drag.startY)) return;

    // From here the release is the frame's, so it is no click on a link.
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.moved = true;
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    if (drag.moved) {
      const width = frameRef.current?.offsetWidth || 1;
      const distance = event.clientX - drag.startX;
      const velocity = Math.abs(distance) / Math.max(1, performance.now() - drag.startTime);

      if (Math.abs(distance) > width * SWIPE_DISTANCE || velocity > SWIPE_VELOCITY) {
        onSelect(Math.min(count - 1, Math.max(0, index + (distance < 0 ? 1 : -1))));
      }
    }

    dragRef.current = null;
  };

  return (
    <section
      ref={sectionRef}
      className={`${aboutStyles.teamCarousel} ${styles.highlights}`}
      aria-roledescription="carousel"
      aria-label="Project highlights"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className={aboutStyles.carouselStage}>
        <button
          type="button"
          className={`${aboutStyles.carouselArrow} ${aboutStyles.carouselPrev}`}
          aria-label="Previous project"
          onClick={() => go(-1)}
        >
          <Chevron direction="prev" />
        </button>

        <div
          ref={frameRef}
          className={`${aboutStyles.carouselFrame} ${styles.highlightFrame}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <HighlightSlide project={orderedProjects[index]} />
        </div>

        <button
          type="button"
          className={`${aboutStyles.carouselArrow} ${aboutStyles.carouselNext}`}
          aria-label="Next project"
          onClick={() => go(1)}
        >
          <Chevron direction="next" />
        </button>
      </div>

      <div className={`${aboutStyles.carouselFooter} ${styles.highlightFooter}`}>
        <span className={aboutStyles.visuallyHidden} aria-live="polite">{orderedProjects[index].name}</span>
        <div className={`${aboutStyles.carouselDots} ${styles.highlightDots}`}>
          {orderedProjects.map((project, i) => (
            <button
              key={project.name}
              type="button"
              className={`${aboutStyles.carouselDot} ${i === index ? aboutStyles.carouselDotActive : ''}`}
              aria-label={`Show ${project.name}`}
              aria-current={i === index}
              onClick={() => onSelect(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
