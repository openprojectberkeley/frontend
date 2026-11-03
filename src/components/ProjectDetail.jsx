import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { NavHashLink } from 'react-router-hash-link';
import aboutStyles from '../css/About.module.css';
import styles from '../css/Projects.module.css';
import arriveAt from './arriveAt';
import OpensElsewhere from './OpensElsewhere';
import useCursorTip from './useCursorTip';
import { HIGHLIGHT_TINTS } from './MomentStrip';
import PixelSwap from './PixelSwap';
import { ScrambleRuns, useScrambleSwap } from './ScrambleText';
import coffeeCupIcon from '../images/projects/coffee-cup.svg';

export const toAnchorId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* How many of the three pips each difficulty fills. */
export const DIFFICULTY_LEVELS = { beginner: 1, intermediate: 2, advanced: 3 };

// The collage's frames, filled from the first: photos are `photos` on a project
// in projectsData.js, and any frames left over stay as empty tinted ones.
const COLLAGE_FRAMES = 3;

// The size of the blocks the icon and the collage change in, in px.
const ICON_BLOCK = 6;
const COLLAGE_BLOCK = 16;

const FIELD_SCRAMBLE_MS = 500;
const DESCRIPTION_SCRAMBLE_MS = 700;
const DESCRIPTION_SCRAMBLE_HOLD = 0.08;
const COFFEE_CHAT_LABEL = 'Coffee Chat Required';

// In the list, the difficulty starts this beat behind its row's name.
const DIFFICULTY_BEHIND_NAME_MS = 150;

const pmSeparator = (pms, index) => {
  if (index === pms.length - 1) return '';

  return index === pms.length - 2 ? ' and ' : ', ';
};

/* A row of the list's, as words only: the links to the board are on the project
   beside the list. Highlighted in as one line - see .flash. */
export function ProjectPMs({ pms }) {
  return (
    <p className={styles.projectPMs}>
      <span className={`${styles.flash} ${styles.flashLater}`}>
        {pms.map((pm, index) => pm + pmSeparator(pms, index)).join('')}
      </span>
    </p>
  );
}

export function ProjectDifficulty({ difficulty, play, delay, instant }) {
  return (
    <p className={styles.projectDifficulty}>
      <span className={styles.difficultyPips} aria-hidden="true">
        {[1, 2, 3].map((pip) => (
          <span key={pip} className={pip <= DIFFICULTY_LEVELS[difficulty] ? styles.pipOn : undefined} />
        ))}
      </span>
      <ScrambleRuns
        runs={[{ text: difficulty }]}
        play={play}
        delay={delay + DIFFICULTY_BEHIND_NAME_MS}
        duration={FIELD_SCRAMBLE_MS}
        instant={instant}
      />
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

/* A field of the project, scrambling into the next one's, with the real text
   for screen readers. */
export function ScrambleSwap({ text, duration = FIELD_SCRAMBLE_MS, hold, instant }) {
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

/*
 * The project managers, scrambled as one line, cut up across their links and
 * what is between them: two names can become four with no name just appearing.
 * The links go to the new names at once. What is left of a longer old line, as
 * it goes, is in a span after them all. Hovered, a name says where it goes in a
 * highlight locked to the cursor.
 */
function ScrambledPMs({ pms, instant }) {
  const linkRefs = useRef([]);
  const separatorRefs = useRef([]);
  const restRef = useRef(null);
  const cursorTip = useCursorTip('', <OpensElsewhere shown />);
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
    <>
    {cursorTip.tip}
    <p className={styles.projectPMs}>
      {pms.map((pm, index) => (
        // By place, as their text is written from here rather than by React.
        <React.Fragment key={index}>
          <NavHashLink
            smooth
            className={styles.projectManagerLink}
            to={`/board/#pm-${toAnchorId(pm)}`}
            scroll={arriveAt}
            draggable={false}
            aria-label={pm}
            onPointerEnter={(event) => cursorTip.show(event, 'go to board', HIGHLIGHT_TINTS[index % HIGHLIGHT_TINTS.length])}
            onPointerMove={cursorTip.move}
            onPointerLeave={cursorTip.hide}
            onClick={cursorTip.hide}
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
    </>
  );
}

const ProjectIcon = ({ project }) => (project.logo ? (
  <img src={project.logo} alt={`${project.name} logo`} className={styles.projectLogo} draggable={false} />
) : (
  <span aria-hidden="true">{project.name[0]}</span>
));

/*
 * A project's words, laid out but never seen, all of them in one grid cell with
 * the live ones: the words' box is then as tall as the longest project's, and
 * the images under it hold still as the words change.
 */
function DetailTextSizer({ project }) {
  return (
    <div className={styles.detailSizer} aria-hidden="true" inert="">
      <div className={styles.detailHeading}>
        <div className={styles.detailIcon} />
        <div className={styles.projectTitle}>
          <h2 className={styles.detailName}>{project.name}</h2>
          {project.clientName && <p className={styles.projectClient}>{project.clientName}</p>}
        </div>
      </div>
      <p className={styles.projectPMs}>{project.pms.map((pm, index) => pm + pmSeparator(project.pms, index)).join('')}</p>
      <div className={styles.detailMeta}>
        <p className={styles.projectDifficulty}>{project.difficulty}</p>
        {project.coffeeChatRequired && <div className={styles.coffeeChatBadge}>{COFFEE_CHAT_LABEL}</div>}
      </div>
      <p className={styles.detailDescription}>{project.description}</p>
    </div>
  );
}

/*
 * The project picked in the list, its words above its images. The words scramble
 * into the next project's, and its icon and images give way to theirs in blocks
 * - see PixelSwap.
 *
 * Which one shows is up to the page, out of `projects`. It takes the focus when
 * the page scrolls back up to it.
 */
export default function ProjectDetail({ project, projects, sectionRef }) {
  const instant = useReducedMotion();
  const photos = project.photos || [];
  const level = DIFFICULTY_LEVELS[project.difficulty] || 0;

  // So that what comes next has something to show as it comes in.
  useEffect(() => {
    projects.forEach(({ logo, photos: others = [] }) => {
      [logo, ...others].forEach((src) => {
        if (src) new Image().src = src;
      });
    });
  }, [projects]);

  return (
    <section
      ref={sectionRef}
      className={styles.detail}
      aria-label="Selected project"
      tabIndex={-1}
    >
      <span className={aboutStyles.visuallyHidden} aria-live="polite">{project.name}</span>

      <div className={styles.detailText}>
        <div className={styles.detailLive}>
          <div className={styles.detailHeading}>
            <PixelSwap swapKey={project.name} block={ICON_BLOCK} className={styles.detailIcon}>
              <ProjectIcon project={project} />
            </PixelSwap>
            <div className={styles.projectTitle}>
              <h2 className={styles.detailName}>
                <ScrambleSwap text={project.name} instant={instant} />
              </h2>
              <p className={styles.projectClient}>
                <ScrambleSwap text={project.clientName || ''} instant={instant} />
              </p>
            </div>
          </div>

          <ScrambledPMs pms={project.pms} instant={instant} />

          {/* Always here, so that the description does not move for them. */}
          <div className={styles.detailMeta}>
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

          <p className={styles.detailDescription}>
            <ScrambleSwap
              text={project.description}
              duration={DESCRIPTION_SCRAMBLE_MS}
              hold={DESCRIPTION_SCRAMBLE_HOLD}
              instant={instant}
            />
          </p>
        </div>

        {projects.map((other) => <DetailTextSizer key={other.name} project={other} />)}
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
    </section>
  );
}
