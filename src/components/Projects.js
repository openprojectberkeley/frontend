import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import styles from '../css/Projects.module.css';
import homeStyles from '../css/HomePage.module.css';
import applyStyles from '../css/Apply.module.css';
import rocket from '../images/triangle.png';
import useScrollCue from './useScrollCue';
import useInViewOnce from './useInViewOnce';
import scrollToCentre from './scrollToCentre';
import accentInk from './accentInk';
import { FixedStarField } from './StarField';
import ProjectDetail, { CoffeeChatBadge, ProjectDifficulty, ScrambleSwap } from './ProjectDetail';
import ProjectFilters, { NO_FILTERS, matchesFilters } from './ProjectFilters';
import { ScrambleRuns } from './ScrambleText';
import { toAnchorId, projectsBySemester, sectionInfo, projectTypes, sectionOrder, logosFirst, orderedProjects, inPageOrder } from '../data/projectsData';
import { CURRENT_SEMESTER } from '../data/site';

/* Rows that come into view together start a beat apart. */
const ROW_GAP_MS = 60;
const NAME_SCRAMBLE_MS = 500;
const TAGLINE_SCRAMBLE_MS = 700;
// Where the things held in place beside each other sit under the fixed header.
const HEADER_CLEARANCE = 96;

// The project a link from the board names, by its #project-<name>, if any. The
// board is always the current semester's.
const projectInHash = (hash) => orderedProjects.findIndex(
  ({ name }) => `#project-${toAnchorId(name)}` === hash,
);

/*
 * A project in the list: its icon, and beside it the name, client, difficulty,
 * one line on it and its topics. Comes in once, the first time it is in view, its
 * name, difficulty and line typed in with the scramble as its client is
 * highlighted in - see .flash - and its topics blur in. Each row asks when it arrives, as a long list
 * would otherwise play out of sight below the fold.
 *
 * The whole row brings up the project beside the list. Filtered out, or in
 * another semester than the one showing, it is hidden rather than dropped, so that
 * coming back it has already come in.
 *
 * `anchorId` is what a link from the board arrives at it by.
 */
function ProjectRow({ project, anchorId, current, hidden, filterKey, reducedMotion, takeTurn, onShow }) {
  const rowRef = useRef(null);
  const inView = useInViewOnce(rowRef, undefined, filterKey);
  const delayRef = useRef(null);

  if (inView && delayRef.current === null) delayRef.current = takeTurn();

  const delay = delayRef.current ?? 0;

  return (
    <li
      ref={rowRef}
      id={anchorId}
      hidden={hidden}
      className={`${styles.projectRow} ${current ? styles.projectRowCurrent : ''} ${inView || reducedMotion ? styles.inView : ''}`}
      style={{
        '--accent': project.accent,
        '--on-accent': accentInk(project.accent),
        '--reveal-delay': `${delay}ms`,
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
        {/* The name is the row's control, stretched over all of it - see
            .projectName. */}
        <div className={styles.rowHead}>
          <div className={styles.projectTitle}>
            <h3 className={styles.projectName}>
              <button
                type="button"
                aria-label={project.name}
                aria-current={current ? 'true' : undefined}
                onClick={() => onShow(project)}
              >
                <ScrambleRuns
                  runs={[{ text: project.name }]}
                  play={inView}
                  delay={delay}
                  duration={NAME_SCRAMBLE_MS}
                  instant={reducedMotion}
                />
              </button>
            </h3>

            {project.clientName && (
              <p className={styles.projectClient}>
                <span className={styles.flash}>{project.clientName}</span>
              </p>
            )}
          </div>

          {project.difficulty && (
            <ProjectDifficulty
              difficulty={project.difficulty}
              play={inView}
              delay={delay}
              instant={reducedMotion}
            />
          )}
        </div>

        <p className={styles.projectTagline}>
          <ScrambleRuns
            runs={[{ text: project.tagline }]}
            play={inView}
            delay={delay}
            duration={TAGLINE_SCRAMBLE_MS}
            instant={reducedMotion}
          />
        </p>

        <ul className={styles.projectTags}>
          {project.tags.map((tag) => (
            <li key={tag} className={styles.projectTag}>
              {tag}
            </li>
          ))}
        </ul>

        {project.coffeeChatRequired && <CoffeeChatBadge />}
      </div>
    </li>
  );
}

export default function Projects() {
  const location = useLocation();
  const detailRef = useRef(null);
  const listRef = useRef(null);
  const nextTurnRef = useRef(0);
  const showScrollCue = useScrollCue();
  const reducedMotion = useReducedMotion();
  // A page arrived at by a link starts on that project.
  const [selected, setSelected] = useState(() => Math.max(0, projectInHash(location.hash)));
  const [semester, setSemester] = useState(CURRENT_SEMESTER);
  const [filters, setFilters] = useState(NO_FILTERS);
  const semesterProjects = projectsBySemester[semester];
  const shownProjects = useMemo(() => inPageOrder(semesterProjects), [semesterProjects]);
  const selectedProject = shownProjects[selected];
  const trimmedFilters = { ...filters, query: filters.query.trim() };
  const filterKey = JSON.stringify({ semester, ...trimmedFilters });
  const isShown = (project, category) => matchesFilters(project, category, trimmedFilters);
  const shownCount = sectionOrder.reduce(
    (count, category) => count + (semesterProjects[category] || []).filter((project) => isShown(project, category)).length,
    0,
  );

  useEffect(() => {
    const linked = projectInHash(location.hash);

    if (linked === -1) return;

    setSemester(CURRENT_SEMESTER);
    setSelected(linked);
  }, [location.hash]);

  /*
   * Every row as tall as the tallest, across all the sections and whatever is
   * filtered out, which only a measurement can tell: for that one moment, before
   * anything paints, the rows are all there at their own heights - see
   * .measuringRows. Again when the width changes, and when the fonts arrive.
   */
  useLayoutEffect(() => {
    const list = listRef.current;
    let width = list.offsetWidth;
    let frame = null;

    const measure = () => {
      list.classList.add(styles.measuringRows);

      const heights = [...list.querySelectorAll(`.${styles.projectRow}`)].map(
        (row) => Math.ceil(row.getBoundingClientRect().height),
      );

      list.classList.remove(styles.measuringRows);
      list.style.setProperty('--row-height', `${Math.max(0, ...heights)}px`);
    };

    // On the next frame, as changing the list's height from inside the observer's
    // own callback is a ResizeObserver loop.
    const observer = new ResizeObserver(() => {
      if (list.offsetWidth === width) return;

      width = list.offsetWidth;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    });

    measure();
    observer.observe(list);
    document.fonts?.ready.then(measure);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  // Filtering from far down the list goes back up to the top of what is left.
  useLayoutEffect(() => {
    const { top } = listRef.current.getBoundingClientRect();

    if (top < HEADER_CLEARANCE) window.scrollBy(0, top - HEADER_CLEARANCE);
  }, [filterKey]);

  /*
   * Beside the list the project is always in view, and the keyboard stays on the
   * list. Stacked above it, back up to the project first, so the change is seen,
   * and the focus goes along to where the reader now is.
   */
  const showProject = (project) => {
    const detail = detailRef.current;
    const select = () => setSelected(shownProjects.indexOf(project));

    if (detail && window.getComputedStyle(detail).position === 'sticky') {
      select();
      return;
    }

    scrollToCentre(detail, () => {
      select();
      detail?.focus({ preventScroll: true });
    });
  };

  // How long a row just come into view has to wait for its turn.
  const takeTurn = () => {
    const now = performance.now();
    const turn = Math.max(now, nextTurnRef.current);

    nextTurnRef.current = turn + ROW_GAP_MS;

    return turn - now;
  };

  const changeSemester = (next) => {
    setSemester(next);
    setSelected(0);
  };

  const renderSection = (rowsSemester, category) => {
    const info = sectionInfo[category];
    const categoryProjects = projectsBySemester[rowsSemester][category];
    const rowShown = (project) => rowsSemester === semester && isShown(project, category);

    if (!categoryProjects || categoryProjects.length === 0) return null;

    return (
      <section
        className={styles.section}
        key={`${rowsSemester} ${category}`}
        hidden={!categoryProjects.some(rowShown)}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle} style={{ color: info.color }}>
            {info.title}
          </h2>
          <p className={styles.sectionDescription}>{info.description}</p>
        </div>
        <ul className={styles.projectRows}>
          {logosFirst(categoryProjects).map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              anchorId={rowsSemester === CURRENT_SEMESTER ? `project-${toAnchorId(project.name)}` : undefined}
              current={selectedProject === project}
              hidden={!rowShown(project)}
              filterKey={filterKey}
              reducedMotion={reducedMotion}
              takeTurn={takeTurn}
              onShow={showProject}
            />
          ))}
        </ul>
      </section>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <FixedStarField />

      {/* Under everything from the heading down, taking no room - the apply
          page's astronaut, see its .circle. */}
      <div className={applyStyles.circle} aria-hidden="true">
        <img src={rocket} alt="" />
      </div>

      <div className={styles.content}>
        <button
          type="button"
          className={homeStyles.scrollCue}
          aria-label="Scroll down"
          onClick={() => scrollToCentre(detailRef.current)}
          style={{ opacity: showScrollCue ? 1 : 0, pointerEvents: showScrollCue ? 'auto' : 'none' }}
        >
          <span className={homeStyles.scrollCueMain}>⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho1}`} aria-hidden="true">⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho2}`} aria-hidden="true">⌄</span>
        </button>

        {/* Page Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            <ScrambleSwap text={`${semester} Projects`} instant={reducedMotion} />
          </h1>
          <ul className={styles.projectTypesList}>
            {projectTypes.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
        </header>
      </div>

      <div className={`${styles.content} ${styles.projectsLayout}`}>
        <div ref={listRef}>
          <ProjectFilters
            filters={filters}
            onChange={setFilters}
            semester={semester}
            onSemesterChange={changeSemester}
            shown={shownCount}
            total={shownProjects.length}
          />

          {shownCount === 0 && (
            <p className={styles.noMatches}>
              {shownProjects.length === 0 ? `No projects listed for ${semester} yet.` : 'No projects match that.'}
            </p>
          )}

          {/* Project Sections */}
          {Object.keys(projectsBySemester).flatMap((rowsSemester) => (
            sectionOrder.map((category) => renderSection(rowsSemester, category))
          ))}
        </div>

        {selectedProject && (
          <ProjectDetail project={selectedProject} projects={shownProjects} sectionRef={detailRef} />
        )}
      </div>
    </div>
  );
}
