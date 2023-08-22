import styles from '../css/About.module.css';
import orangeCurve from "../images/orangecurve.png";
import colin from '../images/about/fall2023/colin.webp';
import nhu from '../images/about/fall2023/nhu.jpg';
import uyen from '../images/about/fall2023/uyen.jpg';
import ethan from '../images/about/fall2023/ethan.jpg';
import nick from '../images/about/fall2023/nick.webp';
import joel from '../images/about/fall2023/joel.jpg';
import pwicon from '../images/pwicon.png';
import linkedinicon from '../images/linkedinicon.png';
import aboutTeam from '../images/about/fall2023/aboutTeam.png'
import inclusiveCommunity from '../images/about/inclusiveCommunity.png'
import chooseYourOwnPath from '../images/about/chooseYourOwnPath.png'
import buildAndLearnTogether from '../images/about/buildAndLearnTogether.png'
import challengeYourLimits from '../images/about/challengeYourLimits.png'

export default function About() {
    const team = [
      {
        name: "Ethan Ikegami",
        link: "https://ethanikegami.com/",
        title: "President/Co-Founder",
        image: ethan,
      },
      {
        name: "Joel Jaison",
        link: "https://www.linkedin.com/in/joel-jaison/",
        title: "VP of Tech/Co-Founder",
        image: joel,
      },
      {
        name: "Uyen Phan",
        link: "https://uyentphan.com/",
        title: "VP of Marketing/Co-Founder",
        image: uyen,
      },
      {
        name: "Nhu Vu",
        link: "https://www.linkedin.com/in/nhu-vu-0b9b89215/",
        title: "VP of Internals/Co-Founder",
        image: nhu,
      },
    ]

    const alumni = [
      {
        name: "Nick Litvinov",
        link: "https://www.linkedin.com/in/nick-litvinov-ab04981b5/",
        title: "Co-Founder",
        image: nick,
      },
      {
        name: "Colin FitzGerald",
        link: "https://www.linkedin.com/in/colinfitzgerald328/",
        title: "Co-Founder",
        image: colin,
      },
    ]

    return (
      <div>
        <img src={aboutTeam} className={styles.aboutTeam} alt="Open Project Berkeley Team"/>
        <div className={`${styles.aboutTopHalf} limitWidth`}>
          <div className={styles.marginFromScreen}>
            <div className={styles.aboutUs}>
              <h1>About Us</h1>
              <h3><span className={styles.bold}>Mission statement:</span> We strive to build an open community for creators passionate about working on tech projects most meaningful to them.</h3>
            </div>
            <div className={styles.ourValues} id="values">
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
              {team.map(person => (
                <div className={styles.person}>
                  <img className={styles.gridImage} src={person.image} alt={person.name}/>
                  <div className={styles.name}>
                    <h3>{person.name}</h3>
                    <a href={person.link} target="_blank" rel="noopener noreferrer"><img src={person.link.includes("linkedin") ? linkedinicon : pwicon} className={styles.icon} alt=""/></a>
                  </div>
                  <p className={styles.title}>{person.title}</p>
                </div>
              ))}
            </div>
            <h1>Alumni</h1>
            <div className={styles.people}>
              {alumni.map(person => (
                <div className={styles.person}>
                  <img className={styles.gridImage} src={person.image} alt={person.name}/>
                  <div className={styles.name}>
                    <h3>{person.name}</h3>
                    <a href={person.link} target="_blank" rel="noopener noreferrer"><img src={person.link.includes("linkedin") ? linkedinicon : pwicon} className={styles.icon} alt=""/></a>
                  </div>
                  <p className={styles.title}>{person.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
