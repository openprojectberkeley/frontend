import React, { useRef } from 'react';
import styles from "../css/About.module.css";
import homeStyles from "../css/HomePage.module.css";
import PageBackground from './PageBackground';
import linkedinicon from "../images/about/linkedin_blue.png";
import websiteicon from "../images/about/web.png";
import inclusiveCommunity from "../images/star.png";
import chooseYourOwnPath from "../images/triangle.png";
import buildAndLearnTogether from "../images/square.png";
import challengeYourLimits from "../images/circle.png";
import topHeaderCurve from "../images/about/topHeaderCurve.svg";
import bottomHeaderCurve from "../images/about/bottomHeaderCurve.svg";
import teamCover from "../images/about/spring2026/board.jpg";
import { alumni } from '../data/boardMembers';

export default function About() {
  const nextSectionRef = useRef(null);

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
    <PageBackground variant="about">
      {({ showScrollCue, scrollY }) => {
        const teamParallaxOffset = Math.min(scrollY * 0.35, 300);

        return (
    <>
      <div className={styles.topHeaderCurve}>
        <img src={topHeaderCurve} alt="Top header curve decoration" />
      </div>
      <section className={styles.teamHero}>
        <img
          src={teamCover}
          style={{ transform: `translateY(${teamParallaxOffset}px)` }}
          alt="Open Project Berkeley Team"
        />
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
          <section className={styles.aboutUs} ref={nextSectionRef}>
            <h1>About Us</h1>
            <h3>
              <span style={{ color: "#F9C12C" }}>Mission statement:</span> We strive
              to build an open community for creators passionate about working
              on tech projects most meaningful to them.
            </h3>
          </section>
          <section className={styles.ourValues}>
            <h1>Our Values</h1>
            <div className={styles.values}>
              <div className={`${styles.value} ${styles.star}`}>
                <img src={inclusiveCommunity} alt="Inclusive Community" />
                <h2 style={{ color: "#F9C12C" }}>Inclusive Community</h2>
                <h3>
                  We value individual differences and strive to build a
                  welcoming environment for everyone passionate about the tech
                  space and creating meaningful projects.
                </h3>
              </div>
              <div className={`${styles.value} ${styles.triangle}`}>
                <img src={chooseYourOwnPath} className={styles.triangle} alt="Choose Your Own Path" />
                <h2 style={{ color: "#4DB6AC" }}>Choose Your Own Path</h2>
                <h3>
                  We believe it is crucial that students are able to facilitate
                  and operate their own development teams, ensuring an outlet
                  for creative independence.
                </h3>
              </div>
              <div className={`${styles.value} ${styles.square}`}>
                <img src={buildAndLearnTogether} className={styles.square} alt="Build and Learn Together" />
                <h2 style={{ color: "#AB8FF3" }}>Build and Learn Together</h2>
                <h3>
                  We aim to maintain a curious space for everyone to collaborate
                  with and learn from one another by allowing every individual
                  to have pivotal roles in their respective development teams.
                </h3>
              </div>
              <div className={`${styles.value} ${styles.circle}`}>
                <img src={challengeYourLimits} className={styles.circle} alt="Challenge Your Limits" />
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
          <h2>OP Alumni</h2>
          <div className={styles.people}>
            {renderPeople(alumni)}
          </div>
        </div>
      </section>
    </>
        );
      }}
    </PageBackground>
  );
}
