import styles from '../css/About.module.css';
import orangeCurve from "../images/orangecurve.png";
import colin from '../images/aboutPictures/colin.jpg';
import nhu from '../images/aboutPictures/nhu.jpg';
import uyen from '../images/aboutPictures/uyen.jpg';
import ethan from '../images/aboutPictures/ethan.jpg';
import nick from '../images/aboutPictures/nick.jpg';
import joel from '../images/aboutPictures/joel.jpg';
import pwicon from '../images/pwicon.png';
import linkedinicon from '../images/linkedinicon.png';

export default function About() {
    return (
      <div>
        <img src={orangeCurve} className={styles.orangeCurve} />
        <div className={`${styles.aboutBottomHalf} limitWidth`} id="team">
          <div className={styles.aboutPics}>
            <h1>Meet the Team</h1>
            <div className={styles.people}>
              <div className={styles.person}>
                <img className={styles.gridImage} src={ethan} />
                <div className={styles.name}>
                  <h3>Ethan Ikegami</h3>
                  <a href="https://ethanikegami.com/" target="_blank" rel="noopener noreferrer"><img src={pwicon} className={styles.icon} /></a>
                </div>
              </div>
              <div className={styles.person}>
                <img className={styles.gridImage} src={nick} />
                <div className={styles.name}>
                  <h3>Nick Litvinov</h3>
                  <a href="https://www.linkedin.com/in/nick-litvinov-ab04981b5/" target="_blank" rel="noopener noreferrer"><img src={linkedinicon} className={styles.icon} /></a>
                </div>
              </div>
              <div className={styles.person}>
                <img className={styles.gridImage} src={joel} />
                <div className={styles.name}>
                  <h3>Joel Jaison</h3>
                  <a href="https://www.linkedin.com/in/joel-jaison/" target="_blank" rel="noopener noreferrer"><img src={linkedinicon} className={styles.icon} /></a>
                </div>
              </div>
              <div className={styles.person}>
                <img className={styles.gridImage} src={colin} />
                <div className={styles.name}>
                  <h3>Colin FitzGerald</h3>
                  <a href="https://www.linkedin.com/in/colinfitzgerald328/" target="_blank" rel="noopener noreferrer"><img src={linkedinicon} className={styles.icon} /></a>
                </div>
              </div>
              <div className={styles.person}>
                <img className={styles.gridImage} src={nhu} />
                <div className={styles.name}>
                  <h3>Nhu Vu</h3>
                  <a href="https://www.linkedin.com/in/nhu-vu-0b9b89215/" target="_blank" rel="noopener noreferrer"><img src={linkedinicon} className={styles.icon} /></a>
                </div>
              </div>
              <div className={styles.person}>
                <img className={styles.gridImage} src={uyen} />
                <div className={styles.name}>
                  <h3>Uyen Phan</h3>
                  <a href="https://uyentphan.com/" target="_blank" rel="noopener noreferrer"><img src={pwicon} className={styles.icon} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
