import styles from '../css/Apply.module.css';
import homeStyles from "../css/HomePage.module.css";
import applyCurveBlue from '../images/applyCurveBlue.png';
import timeline from "../images/timeline.png";
import { NavLink } from 'react-router-dom';

export default function Apply() {
    return (
      <div className={styles.applyWrapper}>
        <div className={`${styles.applyHeader} limitWidth`}>
          <h1>Join us!</h1>
          <div className={styles.headerBlock}>
          <p>Application deadline for Spring 2023 is <b>Wednesday, February 1st at 11:59 pm</b>. Click the button to get started!</p>
            <NavLink to="/apply"><button className={`${homeStyles.getInvolvedButton} ${styles.applyButton}`}>Apply Now</button></NavLink>
          </div>
        </div>
        <img src={applyCurveBlue} className={styles.blueCurve} />
        <div className={`${styles.timeline} limitWidth`}>
          <h1>Recruitment Timeline</h1>
          <img src={timeline} className={styles.timelineImg} />
          <NavLink to="/apply"><button className={`${homeStyles.getInvolvedButton} ${styles.applyButton}`}>Apply Now</button></NavLink>
        </div>
      </div>
    );
}