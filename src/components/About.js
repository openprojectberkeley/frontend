import React from 'react';
import styles from "../css/About.module.css";
import orangeCurve from "../images/orangecurve.png";
import aboutBlueCurveBottom from "../images/about/aboutBlueCurveBottom.png";
import aboutBlueCurveTop from "../images/about/aboutBlueCurveTop.png";
import pwicon from "../images/pwicon.png";
import linkedinicon from "../images/about/linkedin_blue.png";
import websiteicon from "../images/about/web.png";
import coffeechaticon from "../images/coffeechat.png";
import inclusiveCommunity from "../images/about/bigerstarstar.png";
import chooseYourOwnPath from "../images/about/biggerrocketship.png";
import buildAndLearnTogether from "../images/about/squareshape.png";
import challengeYourLimits from "../images/about/astro.png";

//team photo
import teamCover from "../images/about/fall2025/board.jpg";

// Exec
import june from "../images/about/spring2025/june.jpg";
import arushi from "../images/about/fall2025/arushi.jpg";
import khush from "../images/about/fall2025/khush.jpg";
import meher from "../images/about/fall2025/meher.jpg";
import neel from "../images/about/spring2025/neel.jpg";
import helena from "../images/about/fall2025/helena.jpg";
import sia from "../images/about/fall2025/sia.jpg";
import mia from "../images/about/spring2025/mia.jpg";
import jenny from "../images/about/fall2025/jenny.jpg";
import thanh from "../images/about/fall2025/thanh.jpg";
import ava from "../images/about/fall2025/ava.jpg";
import devah from "../images/about/spring2025/devah.jpeg";
import anupriya from "../images/about/spring2025/anupriya.jpg";

// Project Leads
import abhi from "../images/about/fall2025/abhi.jpg";
import andre from "../images/about/fall2025/andre.jpeg";
import ashwika from "../images/about/fall2025/ashwika.jpg";
import aslesha from "../images/about/fall2025/aslesha.jpg";
import ayman from "../images/about/fall2025/ayman.jpg";
import ben from "../images/about/fall2025/ben.jpeg";
import chad from "../images/about/fall2025/chad.jpg";
import david from "../images/about/fall2025/david.jpg";
import david2 from "../images/about/fall2025/david2.jpg";
import devansh from "../images/about/fall2025/devansh.jpeg";
import dylan from "../images/about/fall2025/dylan.jpg";
import edwin from "../images/about/fall2025/edwin.jpg";
import erin from "../images/about/fall2025/erin.jpg";
import felicia from "../images/about/fall2025/felicia.jpg";
import gunhui from "../images/about/fall2025/gunhui.jpg";
import holden from "../images/about/fall2025/holden.jpg";
import isaac from "../images/about/fall2025/isaac.jpg";
import jonathan from "../images/about/fall2025/jonathan.jpg";
import kailash from "../images/about/fall2025/kailash.jpg";
import karthikeya from "../images/about/fall2025/karthikeya.jpg";
import khushi from "../images/about/spring2025/khushi.jpg";
import mahesh from "../images/about/fall2025/mahesh.jpg";
import nishaad from "../images/about/fall2025/nishaad.jpg";
import peyton from "../images/about/fall2025/peyton.jpg";
import sami from "../images/about/fall2025/sami.jpg";
import sophie from "../images/about/fall2025/sophie.jpg";
import yashom from "../images/about/spring2025/yashom.jpg";
import yonatan from "../images/about/fall2025/yonatan.jpg";

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
      title: "Co-President",
      image: sia,
    },
    {
      name: "Khush Ghandi",
      title: "Co-President",
      image: khush,
    },
    {
      name: "Arushi Garg",
      title: "VP of Internals",
      image: arushi,
    },
    {
      name: "Meher Pereira",
      title: "VP of Internals",
      image: meher,
    },
    {
      name: "Helena Zhang",
      title: "VP of Externals",
      image: helena,
    },
    {
      name: "Ava Joshi",
      title: "VP of Marketing & Design",
      image: ava,
    },
    {
      name: "Mia Salinas",
      title: "VP of Marketing & Design",
      image: mia,
    },
    {
      name: "June Mohan",
      title: "VP of Projects",
      image: june,
    },
    {
      name: "Thanh Tran",
      title: "VP of Projects",
      image: thanh,
    },
    {
      name: "Devah Schafers",
      title: "VP of Projects",
      image: devah,
    },
    {
      name: "Jenny Liang",
      title: "VP of Professional Development",
      image: jenny,
    },
    {
      name: "Neel Sharma",
      title: "VP of Professional Development",
      image: neel,
    },
    {
      name: "Anupriya Islam",
      title: "VP of Tech",
      image: anupriya,
    },
  ];

  const projectLeads = [
    {
      name: "Abhinav Kiran",
      title: "Project Manager",
      image: abhi,
    },
    {
      name: "Andre Ramos",
      title: "Project Manager",
      image: andre,
    },
    {
      name: "Ashwika Gampa",
      title: "Project Manager",
      image: ashwika,
    },
    {
      name: "Aslesha Chandra",
      title: "Project Manager",
      image: aslesha,
    },
    {
      name: "Ayman Islam",
      title: "Project Manager",
      image: ayman,
    },
   
    {
      name: "Ben Ross",
      title: "Project Manager",
      image: ben,
    },
    {
      name: "Chad Park",
      title: "Project Manager",
      image: chad,
    },
    {
      name: "David Cruz",
      title: "Project Manager",
      image: david2,
    },
    {
      name: "David Zhang",
      title: "Project Manager",
      image: david,
    },
    {
      name: "Devansh Ojha",
      title: "Project Manager",
      image: devansh,
    },
    {
      name: "Dylan Stier",
      title: "Project Manager",
      image: dylan,
    },
    {
      name: "Edwin Luck",
      title: "Project Manager",
      image: edwin,
    },
    {
      name: "Erin Lee",
      title: "Project Manager",
      image: erin,
    },
    {
      name: "Felicia Ye",
      title: "Project Manager",
      image: felicia,
    },
    {
      name: "Gunhui Kim",
      title: "Project Manager",
      image: gunhui,
    },
    {
      name: "Holden Fees",
      title: "Project Manager",
      image: holden,
    },
    {
      name: "Isaac Hwang",
      title: "Project Manager",
      image: isaac,
    },
    {
      name: "Jonathan Tran",
      title: "Project Manager",
      image: jonathan,
    },
    {
      name: "Kailash Ramesh",
      title: "Project Manager",
      image: kailash,
    },
    {
      name: "Karthikeya Gannavarapu",
      title: "Project Manager",
      image: karthikeya,
    },
    {
      name: "Khushi Bhalla",
      title: "Project Manager",
      image: khushi,
    },
    {
      name: "Mahesh Arunachalam",
      title: "Project Manager",
      image: mahesh,
    },
    {
      name: "Nishaad Sovani",
      title: "Project Manager",
      image: nishaad,
    },
    {
      name: "Peyton Li",
      title: "Project Manager",
      image: peyton,
    },
    {
      name: "Sami Houssaini",
      title: "Project Manager",
      image: sami,
    },
    {
      name: "Sohpie Nguyen",
      title: "Project Manager",
      image: sophie,
    },
    {
      name: "Yashom Kapoor",
      title: "Project Manager",
      image: yashom,
    },
    {
      name: "Yonatan Herrera Gonzalez",
      title: "Project Manager",
      image: yonatan,
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
                    : websiteicon
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
                    : websiteicon
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
          <div className={styles.ourValues}>
            <h1>Our Values</h1>
            <div className={styles.values}>
              <div className={styles.value}>
                <img src={inclusiveCommunity} alt="Inclusive Community" />
                <h2 style={{ color: "#F9C12C" }}>Inclusive Community</h2>
                <h3>
                  We value individual differences and strive to build a
                  welcoming environment for everyone passionate about the tech
                  space and creating meaningful projects.
                </h3>
              </div>
              <div className={styles.value}>
                <img src={chooseYourOwnPath} alt="Choose Your Own Path" />
                <h2 style={{ color: "#4DB6AC" }}>Choose Your Own Path</h2>
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
                <h2 style={{ color: "#AB8FF3" }}>Build and Learn Together</h2>
                <h3>
                  We aim to maintain a curious space for everyone to collaborate
                  with and learn from one another by allowing every individual
                  to have pivotal roles in their respective development teams.
                </h3>
              </div>
              <div className={styles.value}>
                <img src={challengeYourLimits} alt="Challenge Your Limits" />
                <h2 style={{ color: "#83B8E0" }}>Challenge Your Limits</h2>
                <h3>
                  We always encourage our peers to reach beyond their comfort
                  zones and explore areas they are unfamiliar with as we believe
                  it is essential to their personal development.
                </h3>
              </div>
            </div>
          </div>
        </div>
          <div className={styles.aboutPics}>
            <h1>Fall 2025 Board</h1>
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
  );
}