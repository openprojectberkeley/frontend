import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from "../css/About.module.css";
import { NavHashLink } from 'react-router-hash-link';
import homeStyles from "../css/HomePage.module.css";
import linkedinicon from "../images/about/linkedin_blue.png";
import websiteicon from "../images/about/web.png";
import coffeechaticon from "../images/coffeechat.png";
import inclusiveCommunity from "../images/star.png";
import chooseYourOwnPath from "../images/triangle.png";
import buildAndLearnTogether from "../images/square.png";
import challengeYourLimits from "../images/circle.png";
import topHeaderCurve from "../images/about/topHeaderCurve.svg";
import bottomHeaderCurve from "../images/about/bottomHeaderCurve.svg";
import { alumni, board, projectLeads } from '../data/boardMembers';

//team photo
import teamCover from "../images/about/spring2026/board.jpg";

export default function About() {
  const location = useLocation();
  const pageBgRef = useRef(null);
  const [teamParallaxOffset, setTeamParallaxOffset] = useState(0);
  const nextSectionRef = useRef(null);
  const [showScrollCue, setShowScrollCue] = useState(true);
  const [flashTargetId, setFlashTargetId] = useState('');

  useEffect(() => {
    const pageBg = pageBgRef.current;

    if (!pageBg) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId = null;

    const updateParallax = () => {
      const offset = prefersReducedMotion ? 0 : Math.round(window.scrollY * 0.5);
      pageBg.style.setProperty('--page-bg-offset', `${offset}px`);
      setTeamParallaxOffset(Math.min(window.scrollY * 0.35, 300));
      setShowScrollCue(window.scrollY <= 8);
      frameId = null;
    };

    const onScroll = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

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
                  // center element vertically in viewport
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
    <div ref={pageBgRef} className={styles.pageBG}>
      <div className={styles.topHeaderCurve}>
        <img src={topHeaderCurve} alt="Top header curve decoration" />
      </div>
      <section className={styles.aboutTeam} >
        <img
          src={teamCover}
          style={{ transform: `translateY(${teamParallaxOffset}px)` }}
          alt="Open Project Berkeley Team"
        />
      </section>
      <div className={styles.bottomHeaderCurve}>
        <img src={bottomHeaderCurve} alt="Bottom header curve decoration" />
      </div>
      
      <div className={`${styles.aboutTopHalf} limitWidth`} >

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

        <div className={styles.marginFromScreen}>
          <section className={styles.aboutUs} ref={nextSectionRef}>
            <h1 >About Us</h1>
            <h3>
              <span style={{ color: "#F9C12C" }}>Mission statement:</span> We strive
              to build an open community for creators passionate about working
              on tech projects most meaningful to them.
            </h3>
          </section>
          <section className={styles.ourValues}>
            <h1>Our Values</h1>
            <div className={styles.values}>
              <div className={styles.value}>
                <img src={inclusiveCommunity} alt="Inclusive Community" />
                <h2 style={{ color: "#F9C12C" }}>Inclusive Community</h2>
                <h3>
                  We value individual differences and strive to build a
                  welcoming environment for everyone passionate about the tech
                  space and creating meaningful projects.
                </h3>
              </div>
              <div className={styles.value}>
                <img src={chooseYourOwnPath} alt="Choose Your Own Path" />
                <h2 style={{ color: "#4DB6AC" }}>Choose Your Own Path</h2>
                <h3>
                  We believe it is crucial that students are able to facilitate
                  and operate their own development teams, ensuring an outlet
                  for creative independence.
                </h3>
              </div>
              <div className={styles.value}>
                <img
                  src={buildAndLearnTogether}
                  alt="Build and Learn Together"
                />
                <h2 style={{ color: "#AB8FF3" }}>Build and Learn Together</h2>
                <h3>
                  We aim to maintain a curious space for everyone to collaborate
                  with and learn from one another by allowing every individual
                  to have pivotal roles in their respective development teams.
                </h3>
              </div>
              <div className={styles.value}>
                <img src={challengeYourLimits} alt="Challenge Your Limits" />
                <h2 style={{ color: "#83B8E0" }}>Challenge Your Limits</h2>
                <h3>
                  We always encourage our peers to reach beyond their comfort
                  zones and explore areas they are unfamiliar with as we believe
                  it is essential to their personal development.
                </h3>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <section className={`${styles.aboutBottomHalf} limitWidth`}>
        <div className={styles.aboutPics}>
          <h1>Spring 2026 Board</h1>
          <h2>Executive Team</h2>
          {/* Ensure Co-Presidents occupy the top row by rendering them separately */}
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
          <h2>OP Alumni</h2>
          <div className={styles.people}>
            {renderPeople(alumni)}
          </div>
        </div>
      </section>
    </div>
  );
}