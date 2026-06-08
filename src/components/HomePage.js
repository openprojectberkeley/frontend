import styles from '../css/HomePage.module.css';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import speechbubble from '../images/speechbubbles.png';
import ClientsCarousel from "./ClientsCarousel";
import star from '../images/star.png';
import triangle from '../images/triangle.png';
import square from '../images/square.png';
import circle from '../images/circle.png';

import c1 from "../images/clients/carbongraph.png";
import c2 from "../images/clients/getgreen.png";
import c3 from "../images/clients/harp.png";
import c4 from "../images/clients/lg.png";
import c5 from "../images/clients/lmnt.png";
import c6 from "../images/clients/numistoken.png";
import c7 from "../images/clients/ore.png";
import c8 from "../images/clients/otterz.png";
import c9 from "../images/clients/relativity.png";
import c10 from "../images/clients/superhuman.png";
import c11 from "../images/clients/walmart.png";
import c12 from "../images/clients/webai.png";
import c13 from "../images/clients/woosh.png";

const CLIENTS = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13];

function Section({ title, children, imgSrc, imgAlt, reverse = false, className = '', titleClassName = '' }) {
  return (
    <section className={`limitWidth ${styles.section} ${reverse ? styles.reverse : ''} ${className}`}>
      <div className={styles.media}>
        <img src={imgSrc} alt={imgAlt} />
      </div>
      <div className={styles.text}>
        {title && <h1 className={titleClassName}>{title}</h1>}
        <h3>{children}</h3>
      </div>
    </section>
  );
}

export default function HomePage() {
  const pageBgRef = useRef(null);
  const nextSectionRef = useRef(null);
  const [showScrollCue, setShowScrollCue] = useState(true);

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

  return (
    <div ref={pageBgRef} className={styles.pageBG}>
      <div className={`${styles.heroSection} limitWidth`}>
        <div className={styles.coverLeft}>
          <h1 className={styles.experienceText}>Experience</h1>
          <div className={styles.forAllText}>
            <h1 className={styles.forText}>For</h1>
            <h1 className={styles.allText}>All.</h1>
          </div>
          <h2>We strive to build an open community for creators passionate about working on tech projects most meaningful to them.</h2>
          <NavLink to="/apply"><button className={styles.getInvolvedButton}>Get Involved</button></NavLink>
        </div>
        <div className={styles.coverRight}>
          <div className={styles.shapeOrbit} aria-hidden="true">
            <span className={`${styles.shapeOrbitItem} ${styles.shapeOrbitTop}`}>
              <img className={styles.shapeOrbitGlyph} src={square} alt="" />
            </span>
            <span className={`${styles.shapeOrbitItem} ${styles.shapeOrbitRight}`}>
              <img className={styles.shapeOrbitGlyph} src={triangle} alt="" />
            </span>
            <span className={`${styles.shapeOrbitItem} ${styles.shapeOrbitBottom}`}>
              <img className={styles.shapeOrbitGlyph} src={star} alt="" />
            </span>
            <span className={`${styles.shapeOrbitItem} ${styles.shapeOrbitLeft}`}>
              <img className={styles.shapeOrbitGlyph} src={circle} alt="" />
            </span>
          </div>
        </div>

        <button
          type="button"
          className={styles.scrollCue}
          aria-label="Scroll down"
          onClick={() => nextSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          style={{ opacity: showScrollCue ? 1 : 0, pointerEvents: showScrollCue ? 'auto' : 'none' }}
        >
          <span className={styles.scrollCueMain}>⌄</span>
          <span className={`${styles.scrollCueEcho} ${styles.scrollCueEcho1}`} aria-hidden="true">⌄</span>
          <span className={`${styles.scrollCueEcho} ${styles.scrollCueEcho2}`} aria-hidden="true">⌄</span>
        </button>
      </div>

      <div ref={nextSectionRef}>
        <Section
          imgSrc={speechbubble}
          imgAlt="Speech bubbles"
          title="What is Open Project?"
          titleClassName={styles.bluesectiontitle}
        >
          We are a group of students striving to redefine tech club culture at Berkeley. Open Project is dedicated to creating a medium for passionate students to meet and work on projects that make a positive difference in the world — without the unnecessary selective application process.
        </Section>
      </div>

      <Section
        reverse
        imgSrc={triangle}
        imgAlt="Triangle icon"
        title="Projects"
        className={styles.aboutProjects}
      >
        Our club offers a dynamic array of projects, ranging from web/mobile development to data science.
        The projects undertaken each semester are <span className={styles.tealText}>student-led</span>, with members
        empowered to propose ideas, evaluate options, and select the projects they want to work on. This
        allows for a highly personalized and fulfilling experience for all members.
        <br /><br />
        Additionally, we offer <span className={styles.tealText}>client projects</span>, giving members the opportunity
        to work on impactful projects for organizations and gain valuable experience. By providing a combination of
        student-led and client projects, we aim to offer a truly enriching and rewarding experience for all members.
      </Section>

      <div className="limitWidth">
        <div style={{ textAlign: 'center', marginBottom: '100px', marginTop: '-40px' }}>
          <NavLink to="/about"><button className={`${styles.getInvolvedButton} ${styles.learnMoreButton}`}>Learn More</button></NavLink>
        </div>
      </div>

      <section className={styles.clientsSection}>
        <div className="limitWidth">
          <ClientsCarousel images={CLIENTS} altPrefix="Client" />
        </div>
      </section>

      <Section
        imgSrc={star}
        imgAlt="Star icon"
        title="Community"
        className={styles.aboutCommunity}
      >
        Project teams will be with a <span className={styles.orangeText}>group of students (10-15)</span> to encourage a tight-knit community
        where team members can really get to know each other. Socials beyond general team meetings will vary by team
        such as after-meeting dinners or late-night boba runs. In addition, there will be multiple club-wide socials
        throughout the semester so you have the chance to meet everyone in the club!
      </Section>

      <div className="limitWidth">
        <div className={styles.joinUs}>
          <div className={styles.joinUsText}>
            <h1>Join us!</h1>
            <h3>Application deadline is Thursday, January 30th at 11:59 pm. Click the button to learn more!</h3>
          </div>
          <div className={styles.joinUsRight}>
            <NavLink to="/apply"><button className={`${styles.getInvolvedButton} ${styles.getInvolvedButton2}`}>Get Involved</button></NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
