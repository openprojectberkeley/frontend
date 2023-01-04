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
            <h3>The field of projects we work on range from web/mobile development to data science. Projects are <span className={styles.blueText}>student led projects</span> which are directed towards members that want to work on projects they find most intriguing - these can range from social good to general interesting projects. Additionally, we plan to expand to <span className={styles.blueText}>client projects</span> which will be for members that want to work on real-world projects for organizations and will vary based on company needs.</h3>
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
            <h3>Project teams will be with a <span className={styles.orangeText}>small group of students (5-7)</span> to encourage a tight knit community where team members can really get to know each other. Socials beyond general team meetings will vary by team such as after-meeting dinners or late night boba runs. In addition, there will be multiple club wide socials throughout the semester so you have the chance to meet everyone in the club!</h3>
          </div>
        </div>
      </div>
      <img src={orangecurve} className={styles.orangeCurve}/>
      <div className="limitWidth">
        <div className={styles.joinUs}>
          <div className={styles.joinUsText}>
            <h1>Join us!</h1>
            <h3>Application deadline is Wednesday, February 1st at 11:59 pm. Click the button to learn more!</h3>
          </div>
          <div className={styles.joinUsRight}>
            <NavLink to="/apply"><button className={styles.getInvolvedButton}>Get Involved</button></NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}