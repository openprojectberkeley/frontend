import React from 'react';
import styles from '../css/Projects.module.css';
import { projects, sectionInfo, projectTypes } from '../data/projectsData';
import coffeeCupIcon from '../images/coffee-cup.svg';

export default function Projects() {
  const formatPMs = (pms) => {
    if (pms.length === 1) return pms[0];
    if (pms.length === 2) return `${pms[0]} and ${pms[1]}`;
    return `${pms.slice(0, -1).join(', ')}, and ${pms[pms.length - 1]}`;
  };

  const renderProjectCard = (project) => (
    <div key={project.id} className={styles.projectCard}>
      {/* Coffee Chat Badge */}
      {project.coffeeChatRequired && (
        <div className={styles.coffeeChatBadge}>
          <img 
            src={coffeeCupIcon} 
            alt="" 
            className={styles.coffeeIcon}
            aria-hidden="true"
          />
          <span>Coffee Chat Highly Recommended</span>
        </div>
      )}

      <div className={styles.cardContent}>
        {/* Logo (if available) */}
        {project.logo && (
          <div className={styles.logoContainer}>
            <img 
              src={project.logo} 
              alt={`${project.name} logo`} 
              className={styles.projectLogo}
            />
          </div>
        )}

        <div className={styles.cardInfo}>
          <h3 className={styles.projectName}>{project.name}</h3>
          <p className={styles.projectPMs}>
            Led by {formatPMs(project.pms)}
          </p>
        </div>
      </div>

      <p className={styles.projectDescription}>
        {project.description}
      </p>

      {project.clientName && (
        <p className={styles.projectClient}>
          <strong>Client:</strong> {project.clientName}
        </p>
      )}
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
          {categoryProjects.map((project) => renderProjectCard(project))}
        </div>
      </section>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={`${styles.content} limitWidth`}>
        {/* Page Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Spring 2026 Projects</h1>
          <p className={styles.exploreText}>Explore more projects at the info sessions!</p>
          <ul className={styles.projectTypesList}>
            {projectTypes.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
        </header>

        {/* Project Sections */}
        {renderSection('client')}
        {renderSection('passion')}
        {renderSection('competitive')}
      </div>
    </div>
  );
}
