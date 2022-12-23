import styles from '../css/HomePage.module.css';
import homepageShapes from '../images/homepage-shapes.png';
import { NavLink } from 'react-router-dom';
import topBlueCurve from '../images/topbluecurve.png';
import bottomBlueCurve from '../images/bottombluecurve.png';
import wordbubble from '../images/wordbubble.png';

export default function HomePage() {
  return (
    <div>
      <div className={`${styles.cover} limitWidth`}>
        <div className={styles.coverLeft}>
          <h1>Experience For All</h1>
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
            <img src={wordbubble} />
            <div className={styles.bluetext}>
              <h1>What is Open Project?</h1>
              <h3>We are a group of students striving to redefine tech club culture at Berkeley. Open Project is dedicated to creating a medium for passionate students to meet and work on projects that make a positive difference in the world - without the unnecessary selective application process.</h3>
            </div>
          </div>
        </div>
        <img src={bottomBlueCurve} className={styles.bottomBlueCurve} />
      </div>
    </div>
  );
}