import styles from '../css/About.module.css';
import { aboutValues, MISSION, MISSION_PREFIX } from '../data/aboutValues';

/*
 * The about page's opening: the heading, the mission statement and the four
 * values with their shapes. The words are in aboutValues.js, which the end of
 * the home page's hero reads too. `aboutRef` is the scroll cue's target.
 */
export default function AboutIntro({ aboutRef }) {
  return (
    <>
      <section className={styles.aboutUs} ref={aboutRef}>
        <h1>About Us</h1>
        <h3>
          <span style={{ color: "#F9C12C" }}>{MISSION_PREFIX}</span> {MISSION}
        </h3>
      </section>
      <section className={styles.ourValues}>
        <h1>Our Values</h1>
        <div className={styles.values}>
          {aboutValues.map((value) => (
            <div key={value.key} className={`${styles.value} ${styles[value.key]}`}>
              <img
                src={value.image}
                className={value.key === 'star' ? undefined : styles[value.key]}
                alt={value.title}
              />
              <h2 style={{ color: value.colour }}>{value.title}</h2>
              <h3>{value.body}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
