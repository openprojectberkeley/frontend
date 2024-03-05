import styles from "../css/About.module.css";
import orangeCurve from "../images/orangecurve.png";
import pwicon from "../images/pwicon.png";
import linkedinicon from "../images/linkedinicon.png";
import inclusiveCommunity from "../images/about/inclusiveCommunity.png";
import chooseYourOwnPath from "../images/about/chooseYourOwnPath.png";
import buildAndLearnTogether from "../images/about/buildAndLearnTogether.png";
import challengeYourLimits from "../images/about/challengeYourLimits.png";

import teamCover from "../images/about/spring2024/team.png";

import ayush from "../images/about/fall2023/ayush.webp";
import ethan from "../images/about/fall2023/ethan.webp";
import uyen from "../images/about/fall2023/uyen.webp";
import nawoda from "../images/about/spring2024/nawoda.webp";
import pranav from "../images/about/spring2024/pranav.webp";
import rachel from "../images/about/spring2024/rachel.webp";
import anish from "../images/about/spring2024/anish.webp";
import joel from "../images/about/fall2023/joel.webp";
import nhu from "../images/about/fall2023/nhu.webp";
import harika from "../images/about/spring2024/harika.webp";
import iris from "../images/about/fall2023/iris.webp";
import zee from "../images/about/fall2023/zee.webp";
import chris from "../images/about/spring2024/chris.webp";
import jess from "../images/about/spring2024/jess.webp";
import shobhan from "../images/about/spring2024/shobhan.webp";
import rohan from "../images/about/spring2024/rohan.webp";
import areeya from "../images/about/spring2024/areeya.webp";
import damond from "../images/about/spring2024/damond.webp";
import eric from "../images/about/spring2024/eric.webp";
import japinder from "../images/about/spring2024/japinder.webp";
import kitty from "../images/about/spring2024/kitty.webp";
import morgan from "../images/about/spring2024/morgan.webp";



import colin from "../images/about/spring2023/colin.webp";
import nick from "../images/about/spring2023/nick.webp";

export default function About() {
  const team = [
    {
      name: "Pranav Dogra",
      link: "https://www.linkedin.com/in/pranav-dogra-19953a208",
      title: "Co-President/Project Lead",
      image: pranav,
    },
    {
      name: "Nawoda Wijesooriya",
      link: "https://www.linkedin.com/in/nawoda-wijesooriya-a7903b254",
      title: "Co-President/Project Lead",
      image: nawoda,
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
      title: "Senior Advisor/Co-Founder",
      image: nhu,
    },
    {
      name: "Iris Tsui",
      link: "https://www.linkedin.com/in/iris-tsui/",
      title: "VP of Finance",
      image: iris,
    },
    {
      name: "Japinder Narula",
      link: "https://www.linkedin.com/in/japinder-singh-narula-ab48a9192/",
      title: "VP of Finance/Project Lead",
      image: japinder,
    },
    {
      name: "Jessica Lee",
      link: "https://www.linkedin.com/in/jessica-lee-5370b71b4",
      title: "Senior Advisor",
      image: jess,
    },
    {
      name: "Anish Goel",
      link: "",
      title: "VP of Externals",
      image: anish,
    },
    {
      name: "Ayush Verma",
      link: "https://www.linkedin.com/in/averma18",
      title: "Project Lead",
      image: ayush,
    },
    {
      name: "Harika Muthalraj",
      link: "https://www.linkedin.com/in/harika-raj-5b9182261",
      title: "Project Lead",
      image: harika,
    },
    {
      name: "Christopher Bannon",
      link: "https://cbannon.com/",
      title: "Project Lead",
      image: chris,
    },
    {
      name: "Rachel Hong",
      link: "https://www.linkedin.com/in/rachelgiahong/",
      title: "Project Lead",
      image: rachel,
    },
    {
      name: "Shobhan Mangla",
      link: "https://www.linkedin.com/in/shobhanmangla/",
      title: "Project Lead",
      image: shobhan,
    },
    {
      name: "Rohan Agarwal",
      link: "https://www.linkedin.com/in/rohan-agarwal-2908321a1",
      title: "Project Lead",
      image: rohan,
    },
    {
      name: "Areeya Tipyasothi",
      link: "https://www.linkedin.com/in/areeya-tipyasothi/",
      title: "Project Lead",
      image: areeya,
    },
    {
      name: "Dadmond Fang",
      link: "https://www.linkedin.com/in/damond-fang-2b941520b/",
      title: "Project Lead",
      image: damond,
    },
    {
      name: "Eric Liang",
      link: "https://www.linkedin.com/in/ericjliang/",
      title: "Project Lead",
      image: eric,
    },
    {
      name: "Kitty Ng",
      link: "https://www.linkedin.com/in/kitty-ng-443678246/",
      title: "Project Lead",
      image: kitty,
    },
    {
      name: "Morgan Dehdashti",
      link: "https://www.linkedin.com/in/morgan-dehdashti-46b160272/",
      title: "Project Lead",
      image: morgan,
    },
  ];

  const alumni = [
    {
      name: "Ethan Ikegami",
      link: "https://ethanikegami.com/",
      title: "Co-Founder",
      image: ethan,
    },
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
    {
      name: "Zee Babar",
      link: "https://www.linkedin.com/in/moebabar",
      title: "Project Lead",
      image: zee,
    },
  ];

  return (
    <div>
      <img
        src={teamCover}
        className={styles.aboutTeam}
        alt="Open Project Berkeley Team"
      />
      <div className={`${styles.aboutTopHalf} limitWidth`}>
        <div className={styles.marginFromScreen}>
          <div className={styles.aboutUs}>
            <h1>About Us</h1>
            <h3>
              <span className={styles.bold}>Mission statement:</span> We strive
              to build an open community for creators passionate about working
              on tech projects most meaningful to them.
            </h3>
          </div>
          <div className={styles.ourValues} id="values">
            <h1>Our Values</h1>
            <div className={styles.values}>
              <div className={styles.value}>
                <img src={inclusiveCommunity} alt="Inclusive Community" />
                <h2>Inclusive Community</h2>
                <h3>
                  We value individual differences and strive to build a
                  welcoming environment for everyone passionate about the tech
                  space and creating meaningful projects.
                </h3>
              </div>
              <div className={styles.value}>
                <img src={chooseYourOwnPath} alt="Choose Your Own Path" />
                <h2>Choose Your Own Path</h2>
                <h3>
                  We believe it is crucial that students are able to facilitate
                  and operate their own development teams, ensuring an outlet
                  for creative independence.
                </h3>
              </div>
              <div className={styles.value}>
                <img
                  src={buildAndLearnTogether}
                  alt="Build and Learn Together"
                />
                <h2>Build and Learn Together</h2>
                <h3>
                  We aim to maintain a curious space for everyone to collaborate
                  with and learn from one another by allowing every individual
                  to have pivotal roles in their respective development teams.
                </h3>
              </div>
              <div className={styles.value}>
                <img src={challengeYourLimits} alt="Challenge Your Limits" />
                <h2>Challenge Your Limits</h2>
                <h3>
                  We always encourage our peers to reach beyond their comfort
                  zones and explore areas they are unfamiliar with as we believe
                  it is essential to their personal development.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img src={orangeCurve} className={styles.orangeCurve} alt="" />
      <div className={`${styles.aboutBottomHalf} limitWidth`} id="team">
        <div className={styles.aboutPics}>
          <h1>Meet the Team</h1>
          <div className={styles.people}>
            {team.map((person) => (
              <div className={styles.person}>
                <img
                  className={styles.gridImage}
                  src={person.image}
                  alt={person.name}
                />
                <div className={styles.name}>
                  <h3>{person.name}</h3>
                  {person.link && (
                    <a
                      href={person.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={
                          person.link.includes("linkedin")
                            ? linkedinicon
                            : pwicon
                        }
                        className={styles.icon}
                        alt=""
                      />
                    </a>
                  )}
                </div>
                <p className={styles.title}>{person.title}</p>
              </div>
            ))}
          </div>
          <h1>Alumni</h1>
          <div className={styles.people}>
            {alumni.map((person) => (
              <div className={styles.person}>
                <img
                  className={styles.gridImage}
                  src={person.image}
                  alt={person.name}
                />
                <div className={styles.name}>
                  <h3>{person.name}</h3>
                  <a
                    href={person.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={
                        person.link.includes("linkedin") ? linkedinicon : pwicon
                      }
                      className={styles.icon}
                      alt=""
                    />
                  </a>
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
