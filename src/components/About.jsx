import React, { useRef } from 'react';
import styles from "../css/About.module.css";
import homeStyles from "../css/HomePage.module.css";
import useScrollCue from './useScrollCue';
import AboutIntro from './AboutIntro';
import linkedinicon from "../images/about/linkedin_blue.png";
import websiteicon from "../images/about/web.png";
import topHeaderCurve from "../images/about/topHeaderCurve.svg";
import bottomHeaderCurve from "../images/about/bottomHeaderCurve.svg";
import teamCover from "../images/about/spring2026/board.jpg";
import { alumni } from '../data/boardMembers';

export default function About() {
  const nextSectionRef = useRef(null);
  const showScrollCue = useScrollCue();

  const renderPeople = (people) => {
    return people.map((person) => (
      <div className={styles.person} key={person.name}>
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
                src={person.link.includes("linkedin") ? linkedinicon : websiteicon}
                className={styles.icon}
                alt={`${person.name}'s profile link`}
              />
            </a>
          )}
        </div>
        {person.title && <p className={styles.title}>{person.title}</p>}
      </div>
    ));
  };

  return (
    <>
      <div className={styles.topHeaderCurve}>
        <img src={topHeaderCurve} alt="Top header curve decoration" />
      </div>
      <section className={styles.teamHero}>
        <img src={teamCover} alt="Open Project Berkeley Team" />
      </section>
      <div className={styles.bottomHeaderCurve}>
        <img src={bottomHeaderCurve} alt="Bottom header curve decoration" />
      </div>

      <div className={`${styles.aboutTopHalf} limitWidth`}>
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
          <AboutIntro aboutRef={nextSectionRef} />
        </div>
      </div>

      <section className={`${styles.aboutBottomHalf} limitWidth`}>
        <div className={styles.aboutPics}>
          <h2>OP Alumni</h2>
          <div className={styles.people}>
            {renderPeople(alumni)}
          </div>
        </div>
      </section>
    </>
  );
}
