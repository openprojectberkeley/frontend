import React from 'react';
import styles from "../css/About.module.css";
import orangeCurve from "../images/orangecurve.png";
import aboutBlueCurveBottom from "../images/about/aboutBlueCurveBottom.png";
import aboutBlueCurveTop from "../images/about/aboutBlueCurveTop.png";
import pwicon from "../images/pwicon.png";
import linkedinicon from "../images/linkedinicon.png";
import coffeechaticon from "../images/coffeechat.png";
import inclusiveCommunity from "../images/about/inclusiveCommunity.png";
import chooseYourOwnPath from "../images/about/chooseYourOwnPath.png";
import buildAndLearnTogether from "../images/about/buildAndLearnTogether.png";
import challengeYourLimits from "../images/about/challengeYourLimits.png";

//team photo
import teamCover from "../images/about/fall2024/website.JPG"; // Update this path

// Exec
import pranav from "../images/about/fall2024/pranav.JPG";
import nawoda from "../images/about/fall2024/Nawoda.JPG";
import rachel from "../images/about/fall2024/rachel.JPG";
import payamullah from "../images/about/fall2024/payam.JPG";
import chaerin from "../images/about/fall2024/chaerin.JPG";
import bilguun from "../images/about/fall2024/bilguun.JPG";
import sia from "../images/about/spring2025/sia.jpg";
import danh from "../images/about/fall2024/Danh.JPG";
import shobhan from "../images/about/fall2024/shobhan.JPG";
import morgan from "../images/about/fall2024/morgan.JPG";

// Project Leads
import gabriel from "../images/about/fall2024/gabriel.JPG";
import kunal from "../images/about/fall2024/kunal.JPG";
import thanh from "../images/about/fall2024/thanh.JPG";
import eric from "../images/about/fall2024/eric.JPG";
import damond from "../images/about/fall2024/Damon.JPG";
import kerry from "../images/about/fall2024/Kerry.JPG";
import chris from "../images/about/fall2024/chris.JPG";
import brittney from "../images/about/fall2024/Brittney.JPG";
import daniel from "../images/about/fall2024/daniel.JPG";

// Alumni
import ethan from "../images/about/fall2023/ethan.webp";
import colin from "../images/about/spring2023/colin.webp";
import nick from "../images/about/spring2023/nick.webp";
import uyen from "../images/about/fall2023/uyen.webp";
import joel from "../images/about/fall2023/joel.webp";
import nhu from "../images/about/fall2023/nhu.webp";
import jess from "../images/about/spring2024/jess.webp";
import christopher from "../images/about/spring2024/chris.webp";
import kitty from "../images/about/spring2024/kitty.webp";
import rohan from "../images/about/spring2024/rohan.webp";
import zee from "../images/about/fall2023/zee.webp";

export default function About() {
  const board = [
    {
      name: "Sia Sama",
      link: "https://www.linkedin.com/in/nawodakw/",
      coffee_chat:"https://calendly.com/siasama-berkeley/30min",
      title: "Co-President",
      image: sia,
    },
    {
      name: "Nawoda W",
      link: "https://www.linkedin.com/in/nawodakw/",
      coffee_chat:"https://calendly.com/nawodakw/open-project-coffee-chats",
      title: "Co-President",
      image: nawoda,
    },
    {
      name: "Rachel Hong",
      link: "https://www.linkedin.com/in/rachelgiahong/",
      coffee_chat:"https://calendly.com/rachelgiahong",
      title: "VP of Marketing",
      image: rachel,
    },
    {
      name: "Payamullah Erfan",
      link: "https://www.linkedin.com/in/payam-erfan/",
      coffee_chat:"https://calendly.com/payamerfan-berkeley/30min",
      title: "VP of Marketing/Project Lead",
      image: payamullah,
    },
    {
      name: "Chaerin Lim",
      link: "https://www.linkedin.com/in/chaerinlim/",
      coffee_chat:"https://calendly.com/chaerinlim",
      title: "VP of Internals",
      image: chaerin,
    },
    {
      name: "Bilguun Bayarkhuu",
      link: "https://www.linkedin.com/in/bilguunbayarkhuu/",
      coffee_chat:"https://calendly.com/bilguunb-berkeley",
      title: "VP of Internals",
      image: bilguun,
    },
    {
      name: "Sia Sama",
      link: "https://www.linkedin.com/in/sia-sama-b50256235/",
      coffee_chat:"https://calendly.com/siasama-berkeley/30min",
      title: "VP of Externals",
      image: sia,
    },
    {
      name: "Danh Tran",
      link: "https://www.linkedin.com/in/danh-tran-55b646212/",
      coffee_chat:"https://calendly.com/danht-berkeley/op-coffee-chat",
      title: "VP of Finance",
      image: danh,
    },
    {
      name: "Shobhan Mangla",
      link: "https://www.linkedin.com/in/shobhanmangla/",
      coffee_chat:"https://calendly.com/shobhan-mangla-berkeley/30min",
      title: "VP of Projects",
      image: shobhan,
    },
    {
      name: "Morgan Dehdashti",
      link: "https://www.linkedin.com/in/morgan-dehdashti-46b160272/",
      coffee_chat:"https://calendly.com/mdehdashti-berkeley/open-project-coffee-chats",
      title: "VP of Projects",
      image: morgan,
    },
  ];

  const projectLeads = [
    {
      name: "Gabriel Gomes",
      link: "https://www.linkedin.com/in/gabriel-gomes-1a0a03203/",
      coffee_chat:"https://calendly.com/gabgom784/30min",
      title: "Project Lead",
      image: gabriel,
    },
    {
      name: "Brittney Chan",
      link: "https://www.linkedin.com/in/brittney-chan/",
      coffee_chat:"https://calendly.com/brittneychan-berkeley/30min",
      title: "Project Lead",
      image: brittney,
    },
    {
      name: "Kunal Agrawal",
      link: "https://www.linkedin.com/in/kunal-agrawal-697824203/",
      coffee_chat:"https://calendly.com/kunal-agrawal-berkeley",
      title: "Project Lead",
      image: kunal,
    },
    {
      name: "Thanh Tran",
      link: "https://www.linkedin.com/in/thanhcongtran/",
      coffee_chat:"https://calendly.com/thanhctran-berkeley/opcc",
      title: "Project Lead",
      image: thanh,
    },
    {
      name: "Damond Fang",
      link: "https://www.linkedin.com/in/damond-fang-2b941520b/",
      coffee_chat:"https://calendly.com/damond-berkeley/30min",
      title: "Project Lead",
      image: damond,
    },
   
    {
      name: "Kerry Pan",
      link: "https://www.linkedin.com/in/kerrypan25/",
      coffee_chat:"https://calendly.com/kerrypan25/coffee-chat",
      title: "Project Lead",
      image: kerry,
    },
    {
      name: "Eric Liang",
      link: "https://www.linkedin.com/in/ericjliang/",
      coffee_chat:"https://calendly.com/eliang17-berkeley/open-project-coffee-chat",
      title: "Project Lead",
      image: eric,
    },
    {
      name: "Daniel O Garcia",
      link: "https://www.linkedin.com/in/danielochoaga/",
      coffee_chat:"https://calendly.com/daniel_ochoa-1",
      title: "Project Lead",
      image: daniel,
    },
    
    {
      name: "Chris Lopez",
      link: "https://www.linkedin.com/in/chrislopez35/",
      coffee_chat:"https://calendly.com/chris-osw-lopez-berkeley/30min",
      title: "Project Lead",
      image: chris,
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
      name: "Uyen Phan",
      link: "https://uyentphan.com/",
      title: "Co-Founder",
      image: uyen,
    },
    {
      name: "Nhu Vu",
      link: "https://www.linkedin.com/in/nhu-vu-0b9b89215/",
      title: "Co-Founder",
      image: nhu,
    },
    {
      name: "Joel Jaison",
      link: "https://www.linkedin.com/in/joel-jaison/",
      title: "Co-Founder",
      image: joel,
    },
    {
      name: "Jessica Lee",
      link: "https://www.linkedin.com/in/jessica-lee-5370b71b4",
      title: "",
      image: jess,
    },
    {
      name: "Christopher Bannon",
      link: "https://cbannon.com/",
      title: "",
      image: christopher,
    },
    {
      name: "Kitty Ng",
      link: "https://www.linkedin.com/in/kitty-ng-443678246/",
      title: "",
      image: kitty,
    },
    {
      name: "Rohan Agarwal",
      link: "https://www.linkedin.com/in/rohan-agarwal-2908321a1",
      title: "",
      image: rohan,
    },
    {
      name: "Zee Babar",
      link: "https://www.linkedin.com/in/moebabar",
      title: "",
      image: zee,
    },
  ];



  const renderPeople = (people) => {
    return people.map((person) => (
      <div className={styles.person} key={person.name}>
        <div className={styles.imageWrapper}>
          <img
            className={styles.gridImage}
            src={person.image}
            alt={person.name}
          />
        </div>
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
                alt={`${person.name}'s profile link`}
              />
            </a>

          )}
          {person.coffee_chat && (
            <a
              href={person.coffee_chat}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={
                  person.coffee_chat.includes("calendly")
                    ? coffeechaticon
                    : pwicon
                }
                className={styles.icon}
                alt={`${person.name}'s profile link`}
              />
            </a>
          )}
        </div>
        <p className={styles.title}>{person.title}</p>
      </div>
    ));
  };

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
          <div className={styles.aboutPics}>
            <h1>Fall 2024 Board</h1>
            <h2>Executive Team</h2>
            <div className={styles.people}>
              {renderPeople(board)}
            </div>
            <h2>Project Leads</h2>
            <div className={styles.people}>
              {renderPeople(projectLeads)}
            </div>
            <h2>OP Alumni</h2>
            <div className={styles.people}>
              {renderPeople(alumni)}
            </div>
          </div>
        </div>
      </div>
        <div className={styles.marginFromScreen}>
          <div className={styles.ourValues}>
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
   
  );
}