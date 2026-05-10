import React from 'react';
import styles from "../css/About.module.css";
import orangeCurve from "../images/orangecurve.png";
import aboutBlueCurveBottom from "../images/about/aboutBlueCurveBottom.png";
import aboutBlueCurveMiddle from "../images/about/aboutBlueCurveMiddle.png";
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
import teamCover from "../images/about/spring2026/board.jpg";

// TODO: Uncomment and update for Fall 2026
// Exec
import mia from "../images/about/spring2025/mia.thumb.jpg"; // President
import jenny from "../images/about/spring2026/jenny.thumb.jpg";
import anupriya from "../images/about/spring2026/anupriya.thumb.jpg"; // VPP
import ashwika from "../images/about/spring2026/ashwika.thumb.jpg";
import yashom from "../images/about/spring2025/yashom.thumb.jpg";
import jonathan from "../images/about/spring2026/jonathan.thumb.jpg"; // VPPD
import benh from "../images/about/spring2026/benh.thumb.jpg";
import diego from "../images/about/spring2026/diego.thumb.jpg"; // VP Finance
import sophie from "../images/about/spring2026/sophie.thumb.jpg";
import felicia from "../images/about/spring2026/felicia.thumb.jpg";
import ashleyl from "../images/about/spring2026/ashleyl.thumb.jpg"; // VP Marketing
import ava from "../images/about/spring2025/ava.thumb.jpg";
import ashleyi from "../images/about/spring2026/ashleyi.thumb.jpg"; // VP Design
import devah from "../images/about/spring2026/devah.thumb.jpg"; // VP Tech
import peter from "../images/about/spring2026/peter.thumb.jpg";
import helena from "../images/about/spring2026/helena.thumb.jpg"; // VP Externals
import karthik from "../images/about/spring2026/karthik.thumb.jpg";
import ryan from "../images/about/spring2026/ryan.thumb.jpg"; // VP Internals
import benr from "../images/about/spring2026/benr.thumb.jpg";
import yon from "../images/about/spring2026/yon.thumb.jpg"; // VP Clients
// import anupriya from "../images/about/spring2026/anupriya.thumb.jpg";
// import jonathan from "../images/about/spring2026/jonathan.thumb.jpg";
// import ashleyi from "../images/about/spring2026/ashleyi.thumb.jpg"; // VP Community

// TODO: Uncomment and update for Fall 2026
// Project Leads
// import karthikeya from "../images/about/spring2026/karthikeya.thumb.jpg"; // CoPatible
import zehra from "../images/about/spring2026/zehra.thumb.jpg";
import charmi from "../images/about/spring2026/charmi.thumb.jpg"; // Village Hub
import harshini from "../images/about/spring2026/harshini.thumb.jpg";
import sainik from "../images/about/spring2026/sainik.thumb.jpg"; // Operative
import justin from "../images/about/spring2026/justin.thumb.jpg";
// import anupriya from "../images/about/spring2026/anupriya.thumb.jpg"; // Atlas
import andre from "../images/about/fall2025/andre.thumb.jpg";
import erin from "../images/about/spring2026/erin.thumb.jpg";
import andrew from "../images/about/spring2026/andrew.thumb.jpg"; // Nexus
import ganesh from "../images/about/spring2026/ganesh.thumb.jpg";
import jaydens from "../images/about/spring2026/jaydens.thumb.jpg";
import arnav from "../images/about/spring2026/arnav.thumb.jpg";
import chris from "../images/about/spring2026/chris.thumb.jpg"; // MatX
import jaydenl from "../images/about/spring2026/jaydenl.thumb.jpg";
import leo from "../images/about/spring2026/leo.thumb.jpg";
// import jonathan from "../images/about/spring2026/jonathan.thumb.jpg"; // IBM
// import diego from "../images/about/spring2026/diego.thumb.jpg";
// import benh from "../images/about/spring2026/benh.thumb.jpg";
// import jenny from "../images/about/spring2026/jenny.thumb.jpg"; // BM
// import mia from "../images/about/spring2026/mia.thumb.jpg";
import annie from "../images/about/spring2026/annie.thumb.jpg"; // Huddle
import parsa from "../images/about/spring2026/parsa.thumb.jpg";
import jessica from "../images/about/spring2026/jessica.thumb.jpg"; // TRACKLIST
import megan from "../images/about/spring2026/megan.thumb.jpg";
import nishaad from "../images/about/spring2026/nishaad.thumb.jpg"; // Fonar
// import benr from "../images/about/spring2026/benr.thumb.jpg";
import emily from "../images/about/spring2026/emily.thumb.jpg"; // GIStice League
import david from "../images/about/spring2026/david.thumb.jpg";
// import yashom from "../images/about/spring2026/yashom.thumb.jpg"; // ChessBlitz
// import peter from "../images/about/spring2026/peter.thumb.jpg";
import noor from "../images/about/spring2026/noor.thumb.jpg"; // MatchLab
import surabhi from "../images/about/spring2026/surabhi.thumb.jpg";
import chad from "../images/about/spring2026/chad.thumb.jpg"; // SightLine
// import ryan from "../images/about/spring2026/ryan.thumb.jpg";
// import felicia from "../images/about/spring2026/felicia.thumb.jpg"; // Syncrate
// import helena from "../images/about/spring2026/helena.thumb.jpg";

// Alumni
import ethan from "../images/about/fall2023/ethan.thumb.jpg";
import colin from "../images/about/spring2023/colin.thumb.jpg";
import nick from "../images/about/spring2023/nick.thumb.jpg";
import uyen from "../images/about/fall2023/uyen.thumb.jpg";
import joel from "../images/about/fall2023/joel.thumb.jpg";
import nhu from "../images/about/fall2023/nhu.thumb.jpg";
import jess from "../images/about/spring2024/jess.thumb.jpg";
import christopher from "../images/about/spring2024/chris.thumb.jpg";
import kitty from "../images/about/spring2024/kitty.thumb.jpg";
import rohan from "../images/about/spring2024/rohan.thumb.jpg";
import zee from "../images/about/fall2023/zee.thumb.jpg";

export default function About() {
  // TODO: Uncomment and update board array for Spring 2026
  const board = [
    {
      name: "Jenny Liang",
      title: "Co-President",
      image: jenny,
    },
    {
      name: "Mia Salinas",
      title: "Co-President",
      image: mia,
    },
    {
      name: "Anupriya Islam",
      title: "VP of Projects",
      image: anupriya,
    },
    {
      name: "Ashwika Gampa",
      title: "VP of Projects",
      image: ashwika,
    },
    {
      name: "Yashom Kapoor",
      title: "VP of Projects",
      image: yashom,
    },
    {
      name: "Jonathan Tran",
      title: "VP of Professional Development",
      image: jonathan,
    },
    {
      name: "Ben Huang",
      title: "VP of Professional Development",
      image: benh,
    },
    {
      name: "Diego Llamas",
      title: "VP of Finance",
      image: diego,
    },
    {
      name: "Sophie Nguyen",
      title: "VP of Finance",
      image: sophie,
    },
    {
      name: "Felicia Ye",
      title: "VP of Finance",
      image: felicia,
    },
    {
      name: "Ashley Li",
      title: "VP of Marketing",
      image: ashleyl,
    },
    {
      name: "Ava Joshi",
      title: "VP of Marketing",
      image: ava,
    },
    {
      name: "Ashley Iattoni",
      title: "VP of Design",
      image: ashleyi,
    },
    {
      name: "Devah Schaefers",
      title: "VP of Tech",
      image: devah,
    },
    {
      name: "Peter Lourenco",
      title: "VP of Tech",
      image: peter,
    },
    {
      name: "Helena Zhang",
      title: "VP of Externals",
      image: helena,
    },
    {
      name: "Karthik Subramanian",
      title: "VP of Externals",
      image: karthik,
    },
    {
      name: "Ryan Lin",
      title: "VP of Internals",
      image: ryan,
    },
    {
      name: "Ben Ross",
      title: "VP of Internals",
      image: benr,
    },
    {
      name: "Yonatan Herrera Gonzalez",
      title: "VP of Clients",
      image: yon,
    },
    // {
    //   name: "Anupriya Islam",
    //   title: "VP of Clients",
    //   image: anupriya,
    // },
    // {
    //   name: "Jonathan Tran",
    //   title: "VP of Clients",
    //   image: jonathan,
    // },
    // {
    //   name: "Ashley Iattoni",
    //   title: "VP of Community",
    //   image: ashleyi,
    // },
  ];

  // TODO: Uncomment and update projectLeads array for Spring 2026
  const projectLeads = [
    {
      name: "Zehra Naqvi",
      title: "Project Manager",
      image: zehra,
    },
    {
      name: "Charmi Buddaluru",
      title: "Instructor PM",
      image: charmi,
    },
    {
      name: "Harshini Pulivarthi",
      title: "Instructor PM",
      image: harshini,
    },
    {
      name: "Sainik Ghosh",
      title: "Project Manager",
      image: sainik,
    },
    {
      name: "Justin Le",
      title: "Project Manager",
      image: justin,
    },
    {
      name: "Anupriya Islam",
      title: "Project Manager",
      image: anupriya,
    },
    {
      name: "Andre Ramos",
      title: "Project Manager",
      image: andre,
    },
    {
      name: "Erin Lee",
      title: "Project Manager",
      image: erin,
    },
    {
      name: "Andrew Zhou",
      title: "Project Manager",
      image: andrew,
    },
    {
      name: "Ganesh Karayi",
      title: "Project Manager",
      image: ganesh,
    },
    {
      name: "Jayden Szeto",
      title: "Project Manager",
      image: jaydens,
    },
    {
      name: "Arnav Mahadev",
      title: "Project Manager",
      image: arnav,
    },
    {
      name: "Christopher Chang",
      title: "Project Manager",
      image: chris,
    },
    {
      name: "Jayden Lee",
      title: "Project Manager",
      image: jaydenl,
    },
    {
      name: "Leo Park",
      title: "Project Manager",
      image: leo,
    },
    {
      name: "Jonathan Tran",
      title: "Project Manager",
      image: jonathan,
    },
    {
      name: "Diego Llamas",
      title: "Project Manager",
      image: diego,
    },
    {
      name: "Ben Huang",
      title: "Project Manager",
      image: benh,
    },
    {
      name: "Jenny Liang",
      title: "Project Manager",
      image: jenny,
    },
    {
      name: "Mia Salinas",
      title: "Project Manager",
      image: mia,
    },
    {
      name: "Annie Lin",
      title: "Instructor PM",
      image: annie,
    },
    {
      name: "Parsa Faraji Alamouti",
      title: "Instructor PM",
      image: parsa,
    },
    {
      name: "Jessica Chiu",
      title: "Project Manager",
      image: jessica,
    },
    {
      name: "Megan Nguyen",
      title: "Project Manager",
      image: megan,
    },
    {
      name: "Nishaad Sovani",
      title: "Project Manager",
      image: nishaad,
    },
    {
      name: "Ben Ross",
      title: "Project Manager",
      image: benr,
    },
    {
      name: "Emily Ma",
      title: "Project Manager",
      image: emily,
    },
    {
      name: "David Zhang",
      title: "Project Manager",
      image: david,
    },
    {
      name: "Yashom Kapoor",
      title: "Project Manager",
      image: yashom,
    },
    {
      name: "Peter Lourenco",
      title: "Project Manager",
      image: peter,
    },
    {
      name: "Noor Pirzada",
      title: "Project Manager",
      image: noor,
    },
    {
      name: "Surabhi Verma",
      title: "Project Manager",
      image: surabhi,
    },
    {
      name: "Chad Park",
      title: "Project Manager",
      image: chad,
    },
    {
      name: "Ryan Lin",
      title: "Project Manager",
      image: ryan,
    },
    {
      name: "Felicia Ye",
      title: "Project Manager",
      image: felicia,
    },
    {
      name: "Helena Zhang",
      title: "Project Manager",
      image: helena,
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
      <img src={aboutBlueCurveMiddle} className={styles.blueCurve} alt="Blue curve decoration" />
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
            {/* <h1>Spring 2026 Board</h1>*/}
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