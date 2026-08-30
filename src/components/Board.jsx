import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from "../css/Board.module.css";
import { NavHashLink } from 'react-router-hash-link';
import homeStyles from "../css/HomePage.module.css";
import PageBackground from './PageBackground';
import linkedinicon from "../images/about/linkedin_blue.png";
import websiteicon from "../images/about/web.png";
import coffeechaticon from "../images/about/coffeechat.png";
import { board, projectLeads } from '../data/boardMembers';
import { projects } from '../data/projectsData';

// Canonical project order, matching how projects render on the /projects page
// (client then passion, logos first within each section).
const projectOrder = ['client', 'passion', 'competitive'].flatMap((category) =>
  [...(projects[category] || [])]
    .sort((a, b) => (b.logo ? 1 : 0) - (a.logo ? 1 : 0))
    .map((project) => project.name)
);

// Group project managers by their project, following projectOrder. People with
// no (or an unrecognized) project fall to the end. Array.sort is stable, so
// relative order within a group — and among the unassigned — is preserved.
const projectRank = (person) => {
  if (!person.project) return Number.MAX_SAFE_INTEGER;
  const firstProject = person.project.split(',')[0].trim();
  const index = projectOrder.indexOf(firstProject);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const orderedProjectLeads = [...projectLeads].sort(
  (a, b) => projectRank(a) - projectRank(b)
);

export default function Board() {
  const location = useLocation();
  const nextSectionRef = useRef(null);
  const [flashTargetId, setFlashTargetId] = useState('');

  useEffect(() => {
    const hashId = location.hash.replace('#', '');

    if (!hashId) {
      setFlashTargetId('');
      return undefined;
    }

    const flashTimer = window.setTimeout(() => {
      setFlashTargetId(hashId);
      window.setTimeout(() => setFlashTargetId(''), 5000);
    }, 50);

    return () => window.clearTimeout(flashTimer);
  }, [location.hash, location.pathname]);

  const toAnchorId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const renderPeople = (people, idPrefix = '') => {
    return people.map((person) => (
      <div
        className={`${styles.person} ${idPrefix ? styles.anchorTarget : ''} ${flashTargetId === `${idPrefix}${toAnchorId(person.name)}` ? styles.flashTarget : ''}`}
        key={person.name}
        id={idPrefix ? `${idPrefix}${toAnchorId(person.name)}` : undefined}
      >
        <div className={styles.imageWrapper}>
          <img
            className={styles.gridImage}
            src={person.image}
            alt={person.name}
          />
        </div>
        <div className={styles.name}>
          <h3>{person.name}</h3>
          {person.link && (
            <a
              href={person.link}
              target="_blank"
              rel="noopener noreferrer"
            >
            <img
              src={
                person.link.includes("linkedin")
                  ? linkedinicon
                  : websiteicon
              }
              className={`${styles.icon}`}
              alt={`${person.name}'s profile link`}
            />
            </a>
          )}
          {person.coffee_chat && (
            <a
              href={person.coffee_chat}
              target="_blank"
              rel="noopener noreferrer"
            >
            <img
              src={
                person.coffee_chat.includes("calendly")
                  ? coffeechaticon
                  : websiteicon
              }
              className={`${styles.icon}`}
              alt={`${person.name}'s profile link`}
            />
            </a>
          )}
        </div>
            {person.title ? (
              <p className={styles.title}>{person.title}</p>
            ) : (person.project && (
              <p className={styles.title}>
                {person.project.split(',').map((project) => project.trim()).map((project, index, projects) => (
                  <React.Fragment key={project}>
                    <NavHashLink
                      to={`/projects/#project-${toAnchorId(project)}`}
                      className={`${styles.title} ${styles.projectLink}`}
                      scroll={el => {
                        if (!el) return;
                        const rect = el.getBoundingClientRect();
                        const elTop = window.pageYOffset + rect.top;
                        const target = Math.max(0, elTop - (window.innerHeight / 2 - rect.height / 2));
                        window.scrollTo({ top: target, behavior: 'smooth' });
                      }}
                    >
                      {project}
                    </NavHashLink>
                    {index < projects.length - 1 ? ', ' : ''}
                  </React.Fragment>
                ))}
              </p>
            ))}
      </div>
    ));
  };

  return (
    <PageBackground variant="about">
      {({ showScrollCue }) => (
    <section className={`${styles.contentSection} ${styles.bottomSection} limitWidth`}>
        <button
          type="button"
          className={homeStyles.scrollCue}
          aria-label="Scroll down"
          onClick={() => nextSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          style={{ opacity: showScrollCue ? 1 : 0, pointerEvents: showScrollCue ? 'auto' : 'none' }}
        >
          <span className={homeStyles.scrollCueMain}>⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho1}`} aria-hidden="true">⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho2}`} aria-hidden="true">⌄</span>
        </button>

        <div className={styles.boardPics} id="team" ref={nextSectionRef}>
          <h1>Fall 2026 Board</h1>
          <h2>Executive Team</h2>
          {(() => {
            const coPresidents = board.filter(p => (p.title || '').toLowerCase().includes('co-president'));
            const otherBoard = board.filter(p => !(p.title || '').toLowerCase().includes('co-president'));

            return (
              <>
                {coPresidents.length > 0 && (
                  <div className={styles.coPresidentsRow}>
                    {renderPeople(coPresidents)}
                  </div>
                )}

                <div className={styles.people}>
                  {renderPeople(otherBoard)}
                </div>
              </>
            );
          })()}
          <h2>Project Managers</h2>
          <div className={styles.people}>
            {renderPeople(orderedProjectLeads, 'pm-')}
          </div>
        </div>
      </section>
      )}
    </PageBackground>
  );
}
