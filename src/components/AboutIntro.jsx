import styles from '../css/About.module.css';
import inclusiveCommunity from '../images/star.png';
import chooseYourOwnPath from '../images/triangle.png';
import buildAndLearnTogether from '../images/square.png';
import challengeYourLimits from '../images/circle.png';

/*
 * The about page's own opening: the heading, the mission statement and the
 * four values with their shapes.
 *
 * One copy, read in two places - the about page, and the sheet that comes up
 * at the end of the home page's hero - so the club's words cannot drift apart
 * between them. `aboutRef` is the about page's scroll cue target.
 */
export default function AboutIntro({ aboutRef }) {
  return (
    <>
      <section className={styles.aboutUs} ref={aboutRef}>
        <h1>About Us</h1>
        <h3>
          <span style={{ color: "#F9C12C" }}>Mission statement:</span> We strive
          to build an open community for creators passionate about working
          on tech projects most meaningful to them.
        </h3>
      </section>
      <section className={styles.ourValues}>
        <h1>Our Values</h1>
        <div className={styles.values}>
          <div className={`${styles.value} ${styles.star}`}>
            <img src={inclusiveCommunity} alt="Inclusive Community" />
            <h2 style={{ color: "#F9C12C" }}>Inclusive Community</h2>
            <h3>
              We value individual differences and strive to build a
              welcoming environment for everyone passionate about the tech
              space and creating meaningful projects.
            </h3>
          </div>
          <div className={`${styles.value} ${styles.triangle}`}>
            <img src={chooseYourOwnPath} className={styles.triangle} alt="Choose Your Own Path" />
            <h2 style={{ color: "#4DB6AC" }}>Choose Your Own Path</h2>
            <h3>
              We believe it is crucial that students are able to facilitate
              and operate their own development teams, ensuring an outlet
              for creative independence.
            </h3>
          </div>
          <div className={`${styles.value} ${styles.square}`}>
            <img src={buildAndLearnTogether} className={styles.square} alt="Build and Learn Together" />
            <h2 style={{ color: "#AB8FF3" }}>Build and Learn Together</h2>
            <h3>
              We aim to maintain a curious space for everyone to collaborate
              with and learn from one another by allowing every individual
              to have pivotal roles in their respective development teams.
            </h3>
          </div>
          <div className={`${styles.value} ${styles.circle}`}>
            <img src={challengeYourLimits} className={styles.circle} alt="Challenge Your Limits" />
            <h2 style={{ color: "#83B8E0" }}>Challenge Your Limits</h2>
            <h3>
              We always encourage our peers to reach beyond their comfort
              zones and explore areas they are unfamiliar with as we believe
              it is essential to their personal development.
            </h3>
          </div>
        </div>
      </section>
    </>
  );
}
