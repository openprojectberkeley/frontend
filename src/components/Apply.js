import React, {useState} from 'react';
import styles from '../css/Apply.module.css';
import faqPlus from "../images/faqPlus.png";
import orangeCurve from "../images/orangecurve.png";
import homeStyles from "../css/HomePage.module.css";
import applyCurveBlue from '../images/applyCurveBlue.png';

const faqList = [
  [
    "What sets this club apart from other tech clubs?",
  
    `This club is unique in that it serves as a true medium for passionate creators to work on projects that are most meaningful to them. Members have the ability to suggest ideas for projects and then rank and choose the projects they want to work on each semester. 
    
Unlike other clubs that may rely on rigorous selection processes, we believe that every student with a technical background should have the opportunity to learn, grow and contribute. Our approach allows for a highly personalized and fulfilling experience for all members.`
  ],

  [
  "Who can join?",
  
  `If you are passionate about creating meaningful projects and working in a team environment, then this club is perfect for you! We are dedicated to redefining the culture of tech clubs at UC Berkeley, and welcome individuals of all backgrounds, from beginners to advanced developers.
  
While we welcome individuals of all backgrounds, to be able to fully participate and contribute, we expect members to have completed or be currently enrolled in CS 61A (or equivalent) or have previous coding experience. This technical background will allow members to engage fully in the projects of the club.

All prospective members must attend 1 infosession and 1 meet & greet!`
  ],

  [
  "Is there a social aspect to this club?",

  "Yes, getting close to your club members is one of our main focuses! You will be placed on a team to work on a project and are expected to meet frequently and collaborate with your team members. Socials beyond general project team meetings will vary by team, but there will be multiple club wide socials throughout the semester so you have the chance to meet everyone in the club!"
  ],


  [
  "How are teams decided?",

  "Creating teams is a vital aspect of our club and we take great care in ensuring that members are placed in teams that align with their interests and capabilities. We consider a variety of factors including previous experiences, project interests and written prompts when forming teams. A matching algorithm is used to group members, which takes into account the preferences of each member and attempts to place them in teams where they will thrive and be able to make a meaningful contribution."
  ],

  [
  "What is the time commitment?",

 " As a member of this club, you can expect to invest 4-8 hours per week in working on your project, collaborating with your team members, and attending team and club socials. However, it's important to note that the level of commitment may vary depending on the project team and the stage of the project. We understand that members have different schedules and priorities, so we aim to be flexible and accommodate members' needs while still ensuring that projects are completed successfully."
  ],

  [
 " I have no previous coding experience. What should I do?",

 "To be able to fully engage and contribute to the projects of the club, we expect members to have completed or be currently enrolled in CS 61A (or equivalent) or have previous coding experience. If you don't have these qualifications, we recommend either enrolling in CS 61A/CS 88 or following tutorials and building a personal project to gain familiarity and proficiency with coding. This will help ensure that members can fully participate and benefit from the club."
  ],

  [
  "Are there any club dues?",

  "To help support the club's activities and ensure its sustainability, there is a $30 fee due at the start of each semester. This fee is used to cover expenses such as club socials, necessary supplies, and other costs associated with running the club. This small investment is essential to the club's success and allows us to provide a wide range of opportunities for members to learn, grow, and create meaningful projects."
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
      <div>
        <div className={styles.faqHeader} key={`faq-header-${index}`}>
            <div className={styles.faqQuestionContainer}>
                <p className={styles.faqQuestion}>{faqList[index][0]}</p>
            </div>
            <div className={styles.faqImageContainer}>
                <img 
                    className={revealedAnswers[index] ? styles.faqPlusRotate : styles.faqPlus} 
                    src={faqPlus} 
                    alt="faqPlus" 
                >
                </img>
            </div>
        </div>
        <div key={`faq-answer-${index}`} className={styles.faqAnswerContainer}>
            <p className={revealedAnswers[index] ? styles.faqAnswer : styles.faqAnswerInvisible}>{faqList[index][1]}</p>
        </div>
      </div>
    );

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
        <div className={`${styles.allFaqs} limitWidth`} id="faqs">
          <h1 className={styles.faqTitle}>FAQs</h1>
          {allFaqs}
          <br></br>
        </div>
    );
  }

  return (
    <div>
      <div className={styles.applyWrapper}>
        <div className={styles.applyHeader}>
          <div className="limitWidth">
            <h1>Join us!</h1>
            <div className={styles.headerBlock}>
              <p>The application for Fall 2024 will open on <b>Wednesday, September 11th</b> and are due <b>Monday, September 16th at 11:59 pm</b>. Click the button to get started!</p>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLScq6GHf6vF4DdODvO6-vtPvgyzXSZ1ahQvL0wzuwqqbsIbGvA/closedform" target="_blank" rel="noopener noreferrer"><button className={`${homeStyles.getInvolvedButton} ${styles.applyButton}`}>Apply Now</button></a>
            </div>
          </div>
        </div>
        <img src={applyCurveBlue} className={styles.blueCurve} alt="Blue curve decoration" />
        <div className="limitWidth">
          <div className={styles.timeline}>
            <div className={styles.timelineWidth} id="timeline">
              <h1>Recruitment Timeline</h1>
              <p className={styles.importantNote}>*It is mandatory to attend the infosession, team meet & greet, and coffee chat a board member to apply!</p>
              <div className={styles.timelineContent}>
                <div className={styles.outer}>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>01</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>Sept 3</h3>
                        <h3 className={styles.subtitle}>Data Bytes</h3>
                        <p className={styles.information}>Join us for Data Bytes, the first ever joint Data Science club infosession on <span className={styles.blue}>Tuesday, September 3rd 8pm @ GPBB 100</span>!</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>02</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>Sept 6</h3>
                        <h3 className={styles.subtitle}>Club Infosession 1</h3>
                        <p className={styles.information}>Our first infosession is on <span className={styles.blue}>Friday, September 6th 8pm @ Dwinelle 88</span>.</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>03</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>Sept 10</h3>
                        <h3 className={styles.subtitle}>Club Infosession 2</h3>
                        <p className={styles.information}>Our second infosession is on <span className={styles.blue}>Tuesday, September 10th 8pm @ Evans 10</span>.</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>04</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>Sept 11</h3>
                        <h3 className={styles.subtitle}>Meet & Greet 1 and Applications Open</h3>
                        <p className={styles.information}>Applications open and our first Meet & Greet is on <span className={styles.blue}>Wednesday, September 11th 8pm @ Dwinelle 88</span>.</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>05</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>Sept 12</h3>
                        <h3 className={styles.subtitle}>Meet & Greet 2</h3>
                        <p className={styles.information}>Our second Meet & Greet is on <span className={styles.blue}>Thursday, September 12th 8pm @ Dwinelle 88</span>.</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>06</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>Sept 16</h3>
                        <h3 className={styles.subtitle}>Applications Due</h3>
                        <p className={styles.information}>Applications are due <span className={styles.blue}>Monday, September 16th at 11:59pm</span>!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSfwJ5pSjP_JMkqLiAFAeVxMnumnx1iE72FI8g4EGrrv0sOupQ/viewform" target="_blank" rel="noopener noreferrer"><button className={`${homeStyles.getInvolvedButton} ${styles.applyButton}`}>Apply Now</button></a>
            </div>
          </div>
        </div>
      </div>
      <img 
        src={orangeCurve} 
        className={styles.orangeCurve}
        alt="Orange curve decoration"  
      />
      {renderAllFaqs()}
    </div>
  );
}