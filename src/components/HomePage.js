import styles from '../css/HomePage.module.css';
import homepageShapes from '../images/homepage-shapes.png';
import { NavLink } from 'react-router-dom';

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
    </div>
  );
}