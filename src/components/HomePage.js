import styles from '../css/HomePage.module.css';
import homepageIcons from '../images/homepageIcons.png';
import { NavLink } from 'react-router-dom';
import speechbubble from '../images/speechbubbles.png';
import rockettriangle from '../images/rocket-triangle.png';
import ClientsCarousel from "./ClientsCarousel";
import star from '../images/star.png';
import c5 from "../images/clients/carbongraph.png";
import c2 from "../images/clients/harp.jpg";
import c3 from "../images/clients/lmnt-logo-full.png";
import c4 from "../images/clients/otterz.png";
import c1 from "../images/clients/relativity-logo-square.png";
import c6 from "../images/clients/superhuman.png";
import c7 from "../images/clients/walmart.png";
import c8 from "../images/clients/webai.png";
import c9 from "../images/clients/numistoken_full.jpeg";

const CLIENTS = [c1, c2, c3, c4, c5, c6, c7, c8, c9];

function Section({ title, children, imgSrc, imgAlt, reverse = false, className = '' }) {
  return (
    <section className={`limitWidth ${styles.section} ${reverse ? styles.reverse : ''} ${className}`}>
      <div className={styles.media}>
        <img src={imgSrc} alt={imgAlt} />
      </div>
      <div className={styles.text}>
        {title && <h1>{title}</h1>}
        <h3>{children}</h3>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className={styles.pageBG}>
      <div className={`${styles.heroSection} limitWidth`}>
        <div className={styles.coverLeft}>
          <h1 className={styles.tealText}>Experience</h1>
          <h1 className={styles.purpleText}>For All.</h1>
          <h2>We strive to build an open community for creators passionate about working on tech projects most meaningful to them.</h2>
          <NavLink to="/apply"><button className={styles.getInvolvedButton}>Get Involved</button></NavLink>
        </div>
        <div className={styles.coverRight}>
          <img src={homepageIcons} alt="Homepage Shapes" />
        </div>
      </div>

      <div className={styles.blueSectionBg}>
        <Section
          imgSrc={speechbubble}
          imgAlt="Speech bubbles"
          title="What is Open Project?"
          className={styles.blueSectionInner}
        >
          We are a group of students striving to redefine tech club culture at Berkeley. Open Project is dedicated to creating a medium for passionate students to meet and work on projects that make a positive difference in the world — without the unnecessary selective application process.
        </Section>
      </div>

      <Section
        reverse
        imgSrc={rockettriangle}
        imgAlt="Rocket triangle icon"
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
            <h3>Application deadline is Tuesday, Feb 4th at 11:59 pm. Click the button to learn more!</h3>
          </div>
          <div className={styles.joinUsRight}>
            <NavLink to="/apply"><button className={styles.getInvolvedButton}>Get Involved</button></NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
