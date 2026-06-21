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
              <NavHashLink
                to={`/projects/#project-${toAnchorId(person.project)}`}
                className={`${styles.title} ${styles.projectLink}`}
                scroll={el => {
                  if (!el) return;
                  const rect = el.getBoundingClientRect();
                  const elTop = window.pageYOffset + rect.top;
                  const target = Math.max(0, elTop - (window.innerHeight / 2 - rect.height / 2));
                  window.scrollTo({ top: target, behavior: 'smooth' });
                }}
              >
                {person.project}
              </NavHashLink>
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
          <h1>Spring 2026 Board</h1>
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
            {renderPeople(projectLeads, 'pm-')}
          </div>
        </div>
      </section>
      )}
    </PageBackground>
  );
}
