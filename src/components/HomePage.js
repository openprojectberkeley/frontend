import styles from '../css/HomePage.module.css';
import { NavLink } from 'react-router-dom';
import ImmersiveHero from './ImmersiveHero';

/*
 * The home page is the hero and the call to action, and nothing in between.
 *
 * What used to sit here - the Learn More button, the clients carousel and the
 * Community section - is all in ImmersiveHero now: the clients ride the band,
 * and Community is the panel that comes up at the end of it, carrying the same
 * words it had here. Scrolling past the hero only to be shown the same three
 * things again was the page repeating itself.
 */
export default function HomePage() {
  return (
    <>
      <ImmersiveHero />

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
