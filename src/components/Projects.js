import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import styles from '../css/Projects.module.css';
import homeStyles from '../css/HomePage.module.css';
import useScrollCue from './useScrollCue';
import useInViewOnce from './useInViewOnce';
import scrollToCentre from './scrollToCentre';
import { FixedStarField } from './StarField';
import ProjectHighlights, { CoffeeChatBadge, ProjectDifficulty, ProjectPMs, toAnchorId } from './ProjectHighlights';
import { projects, sectionInfo, projectTypes, sectionOrder, logosFirst, orderedProjects } from '../data/projectsData';
import { CURRENT_SEMESTER } from '../data/site';

/*
 * White or near-black, whichever reads better on a filled tile, all along the
 * white sheen over its accent that the words sit on - see .cardWipe: from the
 * bare accent to the sheen as strong as it gets beside the words.
 */
const DARK_INK = '#14151E';
const SHEEN_AT_WORDS = 0.31;
const toChannels = (hex) => [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
const luminance = (channels) => {
  const [r, g, b] = channels.map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (x, y) => {
  const [lighter, darker] = [luminance(x), luminance(y)].sort((p, q) => q - p);

  return (lighter + 0.05) / (darker + 0.05);
};
const accentInk = (accent) => {
  const bare = toChannels(accent);
  const sheened = bare.map((channel) => channel + (1 - channel) * SHEEN_AT_WORDS);
  const worstOn = (ink) => Math.min(contrast(toChannels(ink), bare), contrast(toChannels(ink), sheened));

  return worstOn('#FFFFFF') >= worstOn(DARK_INK) ? '#FFFFFF' : DARK_INK;
};

/* The tiles blur in a beat apart. */
const TILE_GAP_MS = 60;

// The slide a link from the board names, by its #project-<name>, if any.
const slideInHash = (hash) => orderedProjects.findIndex(
  ({ name }) => `#project-${toAnchorId(name)}` === hash,
);

/* A section's tiles, which come in once, the first time the section is in view. */
function ProjectsGrid({ reducedMotion, children }) {
  const gridRef = useRef(null);
  const inView = useInViewOnce(gridRef);

  return (
    <div ref={gridRef} className={`${styles.projectsGrid} ${inView || reducedMotion ? styles.inView : ''}`}>
      {children}
    </div>
  );
}

export default function Projects() {
  const location = useLocation();
  const highlightsRef = useRef(null);
  const showScrollCue = useScrollCue();
  const reducedMotion = useReducedMotion();
  // A page arrived at by a link starts on that slide, rather than sweeping to it.
  const [slide, setSlide] = useState(() => Math.max(0, slideInHash(location.hash)));

  useEffect(() => {
    const linked = slideInHash(location.hash);

    if (linked !== -1) setSlide(linked);
  }, [location.hash]);

  /*
   * Back to the carousel first, then across, so the slide is seen to arrive.
   * Moving the focus with it puts the keyboard where the reader now is.
   */
  const showProject = (project) => {
    scrollToCentre(highlightsRef.current, () => {
      setSlide(orderedProjects.indexOf(project));
      highlightsRef.current?.focus({ preventScroll: true });
    });
  };

  const renderProjectCard = (project, index) => (
    <div
      key={project.id}
      className={styles.projectCard}
      style={{
        '--accent': project.accent,
        '--on-accent': accentInk(project.accent),
        '--reveal-delay': `${index * TILE_GAP_MS}ms`,
      }}
    >
      <span className={styles.cardWipe} aria-hidden="true" />

      <div className={styles.projectIcon} aria-hidden={project.logo ? undefined : 'true'}>
        {project.logo ? (
          <img src={project.logo} alt={`${project.name} logo`} className={styles.projectLogo} />
        ) : (
          project.name[0]
        )}
      </div>

      <div className={styles.cardText}>
        {/* The name is the tile's control, stretched over all of it - see
            .projectName - with the links to the board lifted above it. */}
        <div className={styles.projectTitle}>
          <h3 className={styles.projectName}>
            <button type="button" onClick={() => showProject(project)}>
              {project.name}
            </button>
          </h3>

          {project.clientName && <p className={styles.projectClient}>{project.clientName}</p>}
        </div>

        <ProjectPMs pms={project.pms} />

        {project.difficulty && <ProjectDifficulty difficulty={project.difficulty} />}

        {project.coffeeChatRequired && <CoffeeChatBadge />}
      </div>
    </div>
  );

  const renderSection = (category) => {
    const info = sectionInfo[category];
    const categoryProjects = projects[category];

    if (!categoryProjects || categoryProjects.length === 0) return null;

    return (
      <section className={styles.section} key={category}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle} style={{ color: info.color }}>
            {info.title}
          </h2>
          <p className={styles.sectionDescription}>{info.description}</p>
        </div>
        <ProjectsGrid reducedMotion={reducedMotion}>
          {logosFirst(categoryProjects).map((project, index) => renderProjectCard(project, index))}
        </ProjectsGrid>
      </section>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <FixedStarField />
      <div className={styles.content}>
        <button
          type="button"
          className={homeStyles.scrollCue}
          aria-label="Scroll down"
          onClick={() => scrollToCentre(highlightsRef.current)}
          style={{ opacity: showScrollCue ? 1 : 0, pointerEvents: showScrollCue ? 'auto' : 'none' }}
        >
          <span className={homeStyles.scrollCueMain}>⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho1}`} aria-hidden="true">⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho2}`} aria-hidden="true">⌄</span>
        </button>

        {/* Page Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{CURRENT_SEMESTER} Projects</h1>
          <ul className={styles.projectTypesList}>
            {projectTypes.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
        </header>
      </div>

      <ProjectHighlights index={slide} onSelect={setSlide} sectionRef={highlightsRef} />

      <div className={styles.content}>
        {/* Project Sections */}
        {sectionOrder.map(renderSection)}
      </div>
    </div>
  );
}
