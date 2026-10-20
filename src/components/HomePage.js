import styles from '../css/HomePage.module.css';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import ImmersiveHero from './ImmersiveHero';
import ClientsCarousel from "./ClientsCarousel";
import star from '../images/star.png';
import { clients } from '../data/clientsData';

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
  const nextSectionRef = useRef(null);

  return (
    <>
      <ImmersiveHero nextSectionRef={nextSectionRef} />

      {/* "What is Open Project?" and "Projects" are not here any more: they are
          laid over the two circles inside ImmersiveHero, and the page picks up
          below them. */}
      <div ref={nextSectionRef} className="limitWidth">
        <div style={{ textAlign: 'center', marginBottom: '100px', marginTop: '-40px' }}>
          <NavLink to="/about"><button className={`${styles.getInvolvedButton} ${styles.learnMoreButton}`}>Learn More</button></NavLink>
        </div>
      </div>

      <section className={styles.clientsSection}>
        <div className="limitWidth">
          <ClientsCarousel images={clients} altPrefix="Client" />
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
    </>
  );
}
