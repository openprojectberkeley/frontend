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
import aboutTeam from '../images/aboutPictures/aboutTeam.png'
import inclusiveCommunity from '../images/aboutPictures/inclusiveCommunity.png'
import chooseYourOwnPath from '../images/aboutPictures/chooseYourOwnPath.png'
import buildAndLearnTogether from '../images/aboutPictures/buildAndLearnTogether.png'
import challengeYourLimits from '../images/aboutPictures/challengeYourLimits.png'

export default function About() {
    return (
      <div>
        <img src={aboutTeam} className={styles.aboutTeam} alt="Open Project Berkeley Team"/>
        <div className={`${styles.aboutTopHalf} limitWidth`}>
          <div className={styles.marginFromScreen}>
            <div className={styles.aboutUs}>
              <h1>About Us</h1>
              <h3><span className={styles.bold}>Mission statement:</span> We strive to build an open community for creators passionate about working on tech projects most meaningful to them.</h3>
            </div>
            <div className={styles.ourValues}>
              <h1>Our Values</h1>
              <div className={styles.values}>
                <div className={styles.value}>
                  <img src={inclusiveCommunity} alt="Inclusive Community"/>
                  <h2>Inclusive Community</h2>
                  <h3>We value individual differences and strive to build a welcoming environment for everyone passionate about the tech space and creating meaningful projects.</h3>
                </div>
                <div className={styles.value}>
                  <img src={chooseYourOwnPath} alt="Choose Your Own Path"/>
                  <h2>Choose Your Own Path</h2>
                  <h3>We believe it is crucial that students are able to facilitate and operate their own development teams, ensuring an outlet for creative independence.</h3>
                </div>
                <div className={styles.value}>
                  <img src={buildAndLearnTogether} alt="Build and Learn Together"/>
                  <h2>Build and Learn Together</h2>
                  <h3>We aim to maintain a curious space for everyone to collaborate with and learn from one another by allowing every individual to have pivotal roles in their respective development teams.</h3>
                </div>
                <div className={styles.value}>
                  <img src={challengeYourLimits} alt="Challenge Your Limits"/>
                  <h2>Challenge Your Limits</h2>
                  <h3>We always encourage our peers to reach beyond their comfort zones and explore areas they are unfamiliar with as we believe it is essential to their personal development.</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img src={orangeCurve} className={styles.orangeCurve} alt=""/>
        <div className={`${styles.aboutBottomHalf} limitWidth`} id="team">
          <div className={styles.aboutPics}>
            <h1>Meet the Team</h1>
            <div className={styles.people}>
              <div className={styles.person}>
                <img className={styles.gridImage} src={ethan} alt="Ethan Ikegami"/>
                <div className={styles.name}>
                  <h3>Ethan Ikegami</h3>
                  <a href="https://ethanikegami.com/" target="_blank" rel="noopener noreferrer"><img src={pwicon} className={styles.icon} alt=""/></a>
                </div>
              </div>
              <div className={styles.person}>
                <img className={styles.gridImage} src={nick} alt="Nick Litvinov"/>
                <div className={styles.name}>
                  <h3>Nick Litvinov</h3>
                  <a href="https://www.linkedin.com/in/nick-litvinov-ab04981b5/" target="_blank" rel="noopener noreferrer"><img src={linkedinicon} className={styles.icon} alt=""/></a>
                </div>
              </div>
              <div className={styles.person}>
                <img className={styles.gridImage} src={joel} alt="Joel Jaison"/>
                <div className={styles.name}>
                  <h3>Joel Jaison</h3>
                  <a href="https://www.linkedin.com/in/joel-jaison/" target="_blank" rel="noopener noreferrer"><img src={linkedinicon} className={styles.icon} alt=""/></a>
                </div>
              </div>
              <div className={styles.person}>
                <img className={styles.gridImage} src={colin} alt="Colin FitzGerald"/>
                <div className={styles.name}>
                  <h3>Colin FitzGerald</h3>
                  <a href="https://www.linkedin.com/in/colinfitzgerald328/" target="_blank" rel="noopener noreferrer"><img src={linkedinicon} className={styles.icon} alt=""/></a>
                </div>
              </div>
              <div className={styles.person}>
                <img className={styles.gridImage} src={nhu} alt="Nhu Vu"/>
                <div className={styles.name}>
                  <h3>Nhu Vu</h3>
                  <a href="https://www.linkedin.com/in/nhu-vu-0b9b89215/" target="_blank" rel="noopener noreferrer"><img src={linkedinicon} className={styles.icon} alt=""/></a>
                </div>
              </div>
              <div className={styles.person}>
                <img className={styles.gridImage} src={uyen} alt="Uyen Phan"/>
                <div className={styles.name}>
                  <h3>Uyen Phan</h3>
                  <a href="https://uyentphan.com/" target="_blank" rel="noopener noreferrer"><img src={pwicon} className={styles.icon} alt=""/></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
