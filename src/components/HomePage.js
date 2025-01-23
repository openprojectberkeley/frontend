import styles from '../css/HomePage.module.css';
import homepageShapes from '../images/homepage-shapes.png';
import { NavLink } from 'react-router-dom';
import topBlueCurve from '../images/topbluecurve.png';
import bottomBlueCurve from '../images/bottombluecurve.png';
import wordbubble from '../images/wordbubble.png';
import computer from '../images/computer.png';
import threeIcons from '../images/threeIcons.png';
import orangecurve from '../images/orangecurve.png';

export default function HomePage() {
  return (
    <div>
      <div className={`${styles.cover} limitWidth`}>
        <div className={styles.coverLeft}>
          <h1 className={styles.blueText}>Experience</h1>
          <h1 className={styles.orangeText}>For All.</h1>
          <h2>We strive to build an open community for creators passionate about working on tech projects most meaningful to them.</h2>
          <NavLink to="/apply"><button className={styles.getInvolvedButton}>Get Involved</button></NavLink>
        </div>
        <div className={styles.coverRight}>
          <img src={homepageShapes} alt="Homepage Shapes" />
        </div>
      </div>
      <div className={styles.bluesection}>
        <img src={topBlueCurve} className={styles.topBlueCurve} />
        <div className={styles.bluebackground}>
          <div className={`${styles.blue} limitWidth`}>
            <div>
              <img src={wordbubble} />
            </div>
            <div className={styles.bluetext}>
              <h1>What is Open Project?</h1>
              <h3>We are a group of students striving to redefine tech club culture at Berkeley. Open Project is dedicated to creating a medium for passionate students to meet and work on projects that make a positive difference in the world - without the unnecessary selective application process.</h3>
            </div>
          </div>
        </div>
        <img src={bottomBlueCurve} className={styles.bottomBlueCurve} />
      </div>
      <div className="limitWidth">
        <div className={`${styles.about} ${styles.aboutProjects}`}>
          <div>
            <h1>Projects</h1>
            <h3>Our club offers a dynamic array of projects, ranging from web/mobile development to data science. The projects undertaken each semester are <span className={styles.blueText}>student-led</span>, with members empowered to propose ideas, evaluate options, and select the projects they want to work on. This allows for a highly personalized and fulfilling experience for all members.<br/><br/>Additionally, we offer <span className={styles.blueText}>client</span> projects, giving members the opportunity to work on impactful projects for organizations and gain valuable experience. By providing a combination of student-led and client projects, we aim to offer a truly enriching and rewarding experience for all members.</h3>
          </div>
          <div>
            <img src={computer} />
          </div>
        </div>
        <div className={`${styles.about} ${styles.aboutCommunity}`}>
          <div>
            <img src={threeIcons} />
          </div>
          <div>
            <h1>Community</h1>
            <h3>Project teams will be with a <span className={styles.orangeText}>group of students (10-15)</span> to encourage a tight knit community where team members can really get to know each other. Socials beyond general team meetings will vary by team such as after-meeting dinners or late night boba runs. In addition, there will be multiple club wide socials throughout the semester so you have the chance to meet everyone in the club!</h3>
          </div>
        </div>
      </div>
      <img src={orangecurve} className={styles.orangeCurve}/>
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