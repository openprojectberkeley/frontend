import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import styles from '../css/Projects.module.css';
import homeStyles from '../css/HomePage.module.css';
import PageBackground from './PageBackground';
import { projects, sectionInfo, projectTypes } from '../data/projectsData';
import coffeeCupIcon from '../images/projects/coffee-cup.svg';

export default function Projects() {
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
      window.setTimeout(() => setFlashTargetId(''), 2000);
    }, 50);

    return () => window.clearTimeout(flashTimer);
  }, [location.hash, location.pathname]);

  const formatPMs = (pms) => {
    if (pms.length === 1) return pms[0];
    if (pms.length === 2) return `${pms[0]} and ${pms[1]}`;
    return `${pms.slice(0, -1).join(', ')}, and ${pms[pms.length - 1]}`;
  };

  const toAnchorId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const renderPMs = (pms) => pms.map((pm, index) => {
    const anchorId = `pm-${toAnchorId(pm)}`;

    return (
      <span key={pm}>
        <NavHashLink
          smooth
          className={styles.projectManagerLink}
          to={`/board/#${anchorId}`}
          scroll={el => {
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const top = window.pageYOffset + rect.top;
            const centeredTop = Math.max(0, top - (window.innerHeight / 2 - rect.height / 2));

            window.scrollTo({ top: centeredTop, behavior: 'smooth' });
          }}
        >
          {pm}
        </NavHashLink>
        {index < pms.length - 1 && (index === pms.length - 2 ? ' and ' : ', ')}
      </span>
    );
  });

  const renderProjectCard = (project, category) => (
    <div
      id={`project-${toAnchorId(project.name)}`}
      key={project.id}
      className={`${styles.projectCard}`}
      tabIndex={0}
      style={{ backgroundColor: `${sectionInfo[category]?.color}40` || 'transparent' }}
    >
      <div className={styles.cardFace}>
        {project.coffeeChatRequired && (
          <div className={styles.coffeeChatBadge}>
            <img
              src={coffeeCupIcon}
              alt=""
              className={styles.coffeeIcon}
              aria-hidden="true"
            />
            <span>Coffee Chat Required</span>
          </div>
        )}

        <div className={styles.cardContent}>
          {project.logo && (
            <div className={styles.logoContainer}>
              <img
                src={project.logo}
                alt={`${project.name} logo`}
                className={styles.projectLogo}
              />
            </div>
          )}

          <h3 className={styles.projectName}>{project.name}</h3>
        </div>
      </div>

      <div className={`${styles.cardHover} ${flashTargetId === `project-${toAnchorId(project.name)}` ? styles.flashTarget : ''}`}>
        <div className={styles.cardHoverInner}>
          <p className={styles.hoverLabel}>Project Managers</p>
          <p className={styles.projectPMs}>{renderPMs(project.pms)}</p>

          <p className={styles.hoverLabel}>Description</p>
          <p className={styles.projectDescription}>{project.description}</p>

          {project.clientName && (
            <p className={styles.projectClient}>
              <strong>Client:</strong> {project.clientName}
            </p>
          )}
        </div>
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
        <div className={styles.projectsGrid}>
          {categoryProjects.map((project) => renderProjectCard(project, category))}
        </div>
      </section>
    );
  };

  return (
    <PageBackground variant="projects" className={styles.pageContainer}>
      {({ showScrollCue }) => (
      <div className={`${styles.content} limitWidth`}>
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

        {/* Page Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Spring 2026 Projects</h1>
          <ul className={styles.projectTypesList}>
            {projectTypes.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
        </header>

        {/* Project Sections */}
        <div ref={nextSectionRef}>
          {renderSection('client')}
        </div>
        {renderSection('passion')}
        {renderSection('competitive')}
      </div>
      )}
    </PageBackground>
  );
}
