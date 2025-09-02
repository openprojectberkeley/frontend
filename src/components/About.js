import React from 'react';
import styles from "../css/About.module.css";
import orangeCurve from "../images/orangecurve.png";
import aboutBlueCurveBottom from "../images/about/aboutBlueCurveBottom.png";
import aboutBlueCurveTop from "../images/about/aboutBlueCurveTop.png";
import pwicon from "../images/pwicon.png";
import linkedinicon from "../images/linkedinicon.png";
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
      link: "https://www.linkedin.com/in/nawodakw/",
      coffee_chat:"https://calendly.com/siasama-berkeley/30min",
      title: "Co-President",
      image: sia,
    },
    {
      name: "Khush Ghandi",
      link: "https://www.linkedin.com/in/bilguunbayarkhuu/",
      coffee_chat:"https://calendly.com/bilguunb-berkeley/open-project-coffee-chat",
      title: "Co-President",
      image: khush,
    },
    {
      name: "Arushi Garg",
      link: "https://www.linkedin.com/in/mia-salinas-52384b1ba/",
      title: "VP of Internals",
      image: arushi,
    },
    {
      name: "Meher Pereira",
      link: "https://www.linkedin.com/in/khushi-bhalla/",
      coffee_chat:"https://calendly.com/khushibhalla/open-project-coffee-chats-sp-25",
      title: "VP of Internals",
      image: meher,
    },
    {
      name: "Helena Zhang",
      link: "https://www.linkedin.com/in/gurmeher",
      coffee_chat:"https://calendly.com/grmeher/30min",
      title: "VP of Externals",
      image: helena,
    },
    {
      name: "Ava Joshi",
      link: "https://www.linkedin.com/in/sia-sama-b50256235/",
      coffee_chat:"https://calendly.com/alyssachiu-berkeley/30min",
      title: "VP of Marketing & Design",
      image: ava,
    },
    {
      name: "Mia Salinas",
      link: "https://www.linkedin.com/in/danh-tran-55b646212/",
      coffee_chat:"https://calendly.com/danht-berkeley/op-coffee-chat",
      title: "VP of Marketing & Design",
      image: mia,
    },
    {
      name: "June Mohan",
      link: "https://www.linkedin.com/in/arjun-mohan-1410851a6/",
      coffee_chat:"https://calendly.com/arjunpmohan05-berkeley/30min?back=1&month=2025-01",
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
      name: "Devah Schafers",
      link: "https://linkedin.com/in/thanhcongtran",
      coffee_chat:"https://calendly.com/thanhctran-berkeley/open-project-coffee-chats-clone",
      title: "VP of Projects",
      image: devah,
    },
    {
      name: "Jenny Liang",
      link: "https://www.linkedin.com/in/jenny-liang-08571631a",
      coffee_chat:"https://calendly.com/jennyl5118-berkeley/op-coffee-chat",
      title: "VP of Professional Development",
      image: jenny,
    },
    {
      name: "Neel Sharma",
      link: "https://www.linkedin.com/in/khush-gandhi-0a9353233/",
      coffee_chat:"https://calendly.com/khushgandhi8-berkeley/opcoffeechats",
      title: "VP of Professional Development",
      image: neel,
    },
    {
      name: "Anupriya Islam",
      link: "https://www.linkedin.com/in/khush-gandhi-0a9353233/",
      coffee_chat:"https://calendly.com/khushgandhi8-berkeley/opcoffeechats",
      title: "VP of Tech",
      image: anupriya,
    },
  ];

  const projectLeads = [
    {
      name: "Abhinav Kiran",
      link: "https://www.linkedin.com/in/anthony-kobzar-182889252/",
      coffee_chat:"https://calendly.com/anthonykobzar-berkeley",
      title: "Project Manager",
      image: abhi,
    },
    {
      name: "Andre Ramos",
      link: "https://www.linkedin.com/in/anupriya-islam/",
      coffee_chat:"https://calendly.com/anupriyaislam-berkeley/30min",
      title: "Project Manager",
      image: andre,
    },
    {
      name: "Ashwika Gampa",
      link: "https://www.linkedin.com/in/arthur-wigo-2235062aa/",
      coffee_chat:"https://calendly.com/arthur-wigo-berkeley/op-coffee-chat",
      title: "Project Manager",
      image: ashwika,
    },
    {
      name: "Aslesha Chandra",
      coffee_chat:"https://calendly.com/joshi_ava-berkeley/open-project-coffee-chats",
      title: "Project Manager",
      image: aslesha,
    },
    {
      name: "Ayman Islam",
      link: "https://www.linkedin.com/in/dennis-vengerov-a78376294/",
      coffee_chat:"https://calendly.com/dennis_vengerov-berkeley/30min",
      title: "Project Manager",
      image: ayman,
    },
   
    {
      name: "Ben Ross",
      link: "https://www.linkedin.com/in/devah-schaefers-76b828253/",
      coffee_chat:"https://calendly.com/devahschaefers-berkeley/coffee-chat",
      title: "Project Manager",
      image: ben,
    },
    {
      name: "Chad Park",
      link: "https://www.linkedin.com/in/ethan-zhang-693100270",
      coffee_chat:"https://calendly.com/ezhang06-berkeley",
      title: "Project Manager",
      image: chad,
    },
    {
      name: "David Cruz",
      coffee_chat:"https://calendly.com/gabgom784/30min?month=2025-01",
      title: "Project Manager",
      image: david2,
    },
    {
      name: "David Zhang",
      link: "https://www.linkedin.com/in/isaaclei018/",
      title: "Project Manager",
      image: david,
    },
    {
      name: "Devansh Ojha",
      link: "https://www.linkedin.com/in/jesslyn-ruswan-650210264/",
      coffee_chat:"https://calendly.com/jesslyn_ruswan-berkeley/30min",
      title: "Project Manager",
      image: devansh,
    },
    {
      name: "Dylan Stier",
      link: "https://www.linkedin.com/in/mihir-mirchandani/",
      coffee_chat:"https://calendly.com/mihirm-berkeley/30min",
      title: "Project Manager",
      image: dylan,
    },
    {
      name: "Edwin Luck",
      link: "https://www.linkedin.com/in/neel-sharma-906121240/",
      coffee_chat:"https://calendly.com/neel_sharma-berkeley/30min",
      title: "Project Manager",
      image: edwin,
    },
    {
      name: "Erin Lee",
      coffee_chat:"https://calendly.com/payamerfan-berkeley/coffee-chat",
      title: "Project Manager",
      image: erin,
    },
    {
      name: "Felicia Ye",
      coffee_chat:"https://calendly.com/lipeyton2006/30min?month=2025-01",
      title: "Project Manager",
      image: felicia,
    },
    {
      name: "Gunhui Kim",
      coffee_chat:"https://calendly.com/cheungrachel-berkeley/30min",
      title: "Project Manager",
      image: gunhui,
    },
    {
      name: "Holden Fees",
      coffee_chat:"https://calendly.com/4sibiking/30min",
      title: "Project Manager",
      image: holden,
    },
    {
      name: "Isaac Hwang",
      coffee_chat:"https://calendly.com/smritig-berkeley/open-project-coffee-chats",
      title: "Project Manager",
      image: isaac,
    },
    {
      name: "Jonathan Tran",
      coffee_chat:"https://calendly.com/sofvaladez-berkeley/30min",
      title: "Project Manager",
      image: jonathan,
    },
    {
      name: "Kailash Ramesh",
      link: "www.linkedin.com/in/turner-osswald-6387a8307",
      coffee_chat:"https://calendly.com/torner-berkeley/30min",
      title: "Project Manager",
      image: kailash,
    },
    {
      name: "Karthikeya Gannavarapu",
      coffee_chat:"https://calendly.com/ykapoor-berkeley/30min",
      title: "Project Manager",
      image: karthikeya,
    },
    {
      name: "Khushi Bhalla",
      coffee_chat:"https://calendly.com/ykapoor-berkeley/30min",
      title: "Project Manager",
      image: khushi,
    },
    {
      name: "Mahesh Arunachalam",
      coffee_chat:"https://calendly.com/ykapoor-berkeley/30min",
      title: "Project Manager",
      image: mahesh,
    },
    {
      name: "Nishaad Sovani",
      coffee_chat:"https://calendly.com/ykapoor-berkeley/30min",
      title: "Project Manager",
      image: nishaad,
    },
    {
      name: "Peyton Li",
      coffee_chat:"https://calendly.com/ykapoor-berkeley/30min",
      title: "Project Manager",
      image: peyton,
    },
    {
      name: "Sami Houssaini",
      coffee_chat:"https://calendly.com/ykapoor-berkeley/30min",
      title: "Project Manager",
      image: sami,
    },
    {
      name: "Sohpie Nguyen",
      coffee_chat:"https://calendly.com/ykapoor-berkeley/30min",
      title: "Project Manager",
      image: sophie,
    },
    {
      name: "Yashom Kapoor",
      coffee_chat:"https://calendly.com/ykapoor-berkeley/30min",
      title: "Project Manager",
      image: yashom,
    },
    {
      name: "Yonatan Herrera Gonzalez",
      coffee_chat:"https://calendly.com/ykapoor-berkeley/30min",
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