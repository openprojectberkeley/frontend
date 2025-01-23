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
import teamCover from "../images/about/spring2025/group.jpg"; // Update this path

// Exec
import june from "../images/about/spring2025/june.jpg";
import alyssa from "../images/about/spring2025/alyssa.jpg";
import khush from "../images/about/spring2025/khush.jpg";
import khushi from "../images/about/spring2025/khushi.jpg";
import bilguun from "../images/about/spring2025/bilguun.jpg";
import sia from "../images/about/spring2025/sia.jpg";
import danh from "../images/about/fall2024/Danh.JPG";
import mia from "../images/about/spring2025/mia.jpg";
import jenny from "../images/about/spring2025/jenny.jpg";
import thanh from "../images/about/spring2025/thanh.jpg";
import gurmeher from "../images/about/spring2025/gurmeher.jpg";

// Project Leads
import gabriel from "../images/about/fall2024/gabriel.JPG";
import anthony from "../images/about/spring2025/anthony.jpg";
import ethan2 from "../images/about/spring2025/ethan.jpg";
import jesslyn from "../images/about/spring2025/jesslyn.jpg";
import mihir from "../images/about/spring2025/mihir.jpg";
import payam from "../images/about/spring2025/payam.jpg";
import sofia from "../images/about/spring2025/sofia.jpg";
import turner from "../images/about/spring2025/turner.jpg";
import yashom from "../images/about/spring2025/yashom.jpg";
import smriti from "../images/about/spring2025/smriti.jpg";
import rachelc from "../images/about/spring2025/rachelc.jpg";
import peyton from "../images/about/spring2025/peyton.jpg";
import isaac from "../images/about/spring2025/isaac.jpg";
import dennis from "../images/about/spring2025/dennis.jpeg";
import anupriya from "../images/about/spring2025/anupriya.jpg";
import ava from "../images/about/spring2025/ava.jpg";
import sibi from "../images/about/spring2025/sibi.jpeg";
import neel from "../images/about/spring2025/neel.jpg";
import devah from "../images/about/spring2025/devah.jpeg";
import arthur from "../images/about/spring2025/arthur.jpg";

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
      name: "Bilguun Bayarkhuu",
      link: "https://www.linkedin.com/in/bilguunbayarkhuu/",
      coffee_chat:"https://calendly.com/bilguunb-berkeley/open-project-coffee-chat",
      title: "Co-President",
      image: bilguun,
    },
    {
      name: "Mia Salinas ",
      link: "https://www.linkedin.com/in/mia-salinas-52384b1ba/",
      title: "VP of Marketing",
      image: mia,
    },
    {
      name: "Khushi Bhalla",
      link: "https://www.linkedin.com/in/khushi-bhalla/",
      coffee_chat:"https://calendly.com/khushibhalla/open-project-coffee-chats-sp-25",
      title: "VP of Internals",
      image: khushi,
    },
    {
      name: "Gurmeher Bhasin",
      link: "https://www.linkedin.com/in/gurmeher",
      coffee_chat:"https://calendly.com/grmeher/30min",
      title: "VP of Internals",
      image: gurmeher,
    },
    {
      name: "Alyssa Chiu",
      link: "https://www.linkedin.com/in/sia-sama-b50256235/",
      coffee_chat:"https://calendly.com/alyssachiu-berkeley/30min",
      title: "VP of Externals",
      image: alyssa,
    },
    {
      name: "Danh Tran",
      link: "https://www.linkedin.com/in/danh-tran-55b646212/",
      coffee_chat:"https://calendly.com/danht-berkeley/op-coffee-chat",
      title: "VP of Finance",
      image: danh,
    },
    {
      name: "June Mohan",
      link: "https://www.linkedin.com/in/arjun-mohan-1410851a6/",
      coffee_chat:"calendly.com/arjunpmohan05-berkeley",
      title: "VP of Projects",
      image: june,
    },
    {
      name: "Thanh Tran",
      link: "https://linkedin.com/in/thanhcongtran",
      coffee_chat:"https://calendly.com/thanhctran-berkeley/open-project-coffee-chats-clone",
      title: "VP of Projects",
      image: thanh,
    },
    {
      name: "Jenny Liang",
      link: "www.linkedin.com/in/jenny-liang-08571631a/",
      coffee_chat:"https://calendly.com/jennyl5118-berkeley/op-coffee-chat",
      title: "VP of Professional Development",
      image: jenny,
    },
    {
      name: "Khush Gandhi",
      link: "https://www.linkedin.com/in/khush-gandhi-0a9353233/",
      coffee_chat:"https://calendly.com/khushgandhi8-berkeley/opcoffeechatss",
      title: "VP of Professional Development",
      image: khush,
    },
  ];

  const projectLeads = [
    {
      name: "Anthony Kobzar",
      link: "https://www.linkedin.com/in/anthony-kobzar-182889252/",
      coffee_chat:"https://calendly.com/anthonykobzar-berkeley",
      title: "Project Manager",
      image: anthony,
    },
    {
      name: "Anupriya Islam",
      link: "https://www.linkedin.com/in/anupriya-islam/",
      coffee_chat:"https://calendly.com/anupriyaislam-berkeley/30min",
      title: "Project Manager",
      image: anupriya,
    },
    {
      name: "Arthur Wigo",
      link: "https://www.linkedin.com/in/arthur-wigo-2235062aa/",
      coffee_chat:"https://calendly.com/arthur-wigo-berkeley/op-coffee-chaty",
      title: "Project Manager",
      image: arthur,
    },
    {
      name: "Ava Joshi",
      coffee_chat:"https://calendly.com/joshi_ava-berkeley/open-project-coffee-chats",
      title: "Project Manager",
      image: ava,
    },
    {
      name: "Dennis Vengerov",
      link: "https://www.linkedin.com/in/dennis-vengerov-a78376294/",
      coffee_chat:"https://calendly.com/dennis_vengerov-berkeley/30min",
      title: "Project Manager",
      image: dennis,
    },
   
    {
      name: "Devh Schaefers",
      link: "https://www.linkedin.com/in/devah-schaefers-76b828253/",
      coffee_chat:"https://calendly.com/devahschaefers-berkeley/coffee-chat",
      title: "Project Manager",
      image: devah,
    },
    {
      name: "Ethan Zhang",
      link: "https://www.linkedin.com/in/ethan-zhang-693100270",
      coffee_chat:"https://calendly.com/ezhang06-berkeley",
      title: "Project Manager",
      image: ethan2,
    },
    {
      name: "Gabriel Gomes",
      coffee_chat:"https://calendly.com/gabgom784/30min?month=2025-01",
      title: "Project Manager",
      image: gabriel,
    },
    {
      name: "Isaac Lei",
      link: "https://www.linkedin.com/in/isaaclei018/",
      title: "Project Manager",
      image: isaac,
    },
    {
      name: "Jesslyn Ashley Ruswan",
      link: "https://www.linkedin.com/in/jesslyn-ruswan-650210264/",
      coffee_chat:"https://calendly.com/jesslyn_ruswan-berkeley/30min",
      title: "Project Manager",
      image: jesslyn,
    },
    {
      name: "Mihir Mirchandani",
      link: "https://www.linkedin.com/in/mihir-mirchandani/",
      coffee_chat:"https://calendly.com/mihirm-berkeley/30min",
      title: "Project Manager",
      image: mihir,
    },
    {
      name: "Neel Sharma",
      link: "https://www.linkedin.com/in/neel-sharma-906121240/",
      coffee_chat:"https://calendly.com/neel_sharma-berkeley/30min",
      title: "Project Manager",
      image: neel,
    },
    {
      name: "Payam Erfan",
      coffee_chat:"https://calendly.com/payamerfan-berkeley/30min",
      title: "Project Manager",
      image: payam,
    },
    {
      name: "Peyton Li",
      coffee_chat:"https://calendly.com/lipeyton2006/30min?month=2025-01",
      title: "Project Manager",
      image: peyton,
    },
    {
      name: "Rachel Cheung",
      coffee_chat:"https://calendly.com/cheungrachel-berkeley/30min",
      title: "Project Manager",
      image: rachelc,
    },
    {
      name: "Sibi Saravanan",
      coffee_chat:"https://calendly.com/4sibiking/30minn",
      title: "Project Manager",
      image: sibi,
    },
    {
      name: "Smriti Govindan",
      coffee_chat:"https://calendly.com/smritig-berkeley/open-project-coffee-chats",
      title: "Project Manager",
      image: smriti,
    },
    {
      name: "Sofia Valadez",
      coffee_chat:"https://calendly.com/sofvaladez-berkeley/30min",
      title: "Project Manager",
      image: sofia,
    },
    {
      name: "Turner Osswald",
      link: "www.linkedin.com/in/turner-osswald-6387a8307",
      coffee_chat:"https://calendly.com/torner-berkeley/30min",
      title: "Project Manager",
      image: turner,
    },
    {
      name: "Yashom Kapoor",
      coffee_chat:"https://calendly.com/ykapoor-berkeley/30min",
      title: "Project Manager",
      image: yashom,
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
            <h1>Spring 2025 Board</h1>
            <h2>Executive Team</h2>
            <div className={styles.people}>
              {renderPeople(board)}
            </div>
            <h2>Project Managers</h2>
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