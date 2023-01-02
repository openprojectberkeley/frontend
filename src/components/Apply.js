import React, {useState} from 'react';
import styles from '../css/Apply.module.css';
import faqPlus from "../images/faqPlus.png";
import orangeCurve from "../images/orangecurve.png";

const faqList = [
  [
  `Who can join?`,

  `If you are passionate and want to work on a team to create meaningful projects this club is for you! This club is looking to redefine the culture of tech clubs at UC Berkeley. People of all backgrounds, from beginner to advanced developers, are welcome to join. Generally, we do expect members to have taken or are currently enrolled in CS 61A (or equivalent) or have previous coding experience. `
  ],

  [
  `What kind of projects does Open Project work on?`,

  `We work on projects in many different technical fields from web/mobile development to data science that are either student led or client projects.
  
Student-led projects are ideas from club members that can range from social good to just interesting projects. In Fall 2023, we plan on introducing client projects which will be for people that want to work on real-world projects for organizations and will vary based on company needs.
  
Each project team will have 5-7 members including 1 or 2 project leads. There will be multiple officer check ins and project deadlines throughout the semester.`
  ],

  [
  `Is there a social aspect to this club?`,

  `Yes, getting close to your club members is one of our main focuses! You will be placed on a team to work on a project and are expected to meet frequently and collaborate with your team members. Socials beyond general project team meetings will vary by team, but there will be multiple club wide socials throughout the semester so you have the chance to meet everyone in the club!`
  ],


  [
  `How are teams decided?`,

  `We take into account previous experiences, project interests, and written prompts when creating teams. A matching algorithm is used to group members and attempts to make sure everyone is on the teams they want to work in.`
  ],

  [
  `What is the time commitment?`,

  `You should expect to spend 4-8 hours a week in this club working on a project, collaborating with your team members, and attending team/club socials, but commitment will vary for each project team.`
  ],

  [
  `Can I be a project lead?`,

  `On the project interest form, people interested in leading a project will have a separate section to fill out. People with previous leadership and technical experience are encouraged to apply. However, if you have limited leadership/technical experience, we still encourage you to apply! We are mainly looking for people that are passionate about the project they want to lead. `
  ],

  [
  `I have no previous coding experience. What should I do?`,

  `We expect members to have taken or are currently enrolled in CS 61A (or equivalent) or have previous coding experience. If you haven't, we recommend either enrolling in CS 61A/CS 88 or following tutorials and building a personal project to get comfortable with coding. `
  ],

  [
  `Are there any club dues?`,

  `There is a $15 fee due at the beginning of every semester to help keep the club running. It helps us fund club socials, necessary supplies, and more!`
  ]
];

export default function Apply() {

  const [revealedAnswers, setRevealedAnswers] = useState(Array(faqList.length).fill(false));

  const changeReveal = (index) => {
    let copy = revealedAnswers.slice();
    copy[index] = !copy[index];
    setRevealedAnswers(copy);
  };

  const renderFaqBox = (index) => {
    let faqElement = [];

    faqElement.push(
      <div className={styles.faqHeader} key={`faq-header-${index}`}>
          <div className={styles.faqQuestionContainer}>
              <p className={styles.faqQuestion}>{faqList[index][0]}</p>
          </div>
          <div className={styles.faqImageContainer}>
              <img 
                  className={styles.faqPlus} 
                  src={faqPlus} 
                  alt="faqPlus" 
              >
              </img>
          </div>
      </div>
    );

    if (revealedAnswers[index]) {
        faqElement.push(
            <div key={`faq-answer-${index}`} className={styles.faqAnswerContainer}>
                <p className={styles.faqAnswer}>{faqList[index][1]}</p>
            </div>
        );
    }

    return (
        <div key={`faq-box-${index}`} className={styles.faqBox} 
          onClick = { () => changeReveal(index)}
        >
            {faqElement}
        </div>
    );  
  } 

  const renderAllFaqs = () => {
    let allFaqs = [];
    
    for (let index in faqList) {
      let brKey = `faq-br-${index}`;

      allFaqs.push(renderFaqBox(index));
      allFaqs.push(<br key={brKey}></br>);
    }

    return (
        <div className={`${styles.allFaqs} limitWidth`}>
          <h1 className={styles.faqTitle}>FAQs</h1>
          {allFaqs}
          <br></br>
        </div>
    );
  }

  return (
    <div>
      <h1>Apply</h1>
      <img 
        src={orangeCurve} 
        className={styles.orangeCurve}
        alt="orangeCurve"  
      ></img>
      {renderAllFaqs()}
    </div>
  );
}