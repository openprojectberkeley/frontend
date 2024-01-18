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

  "To help support the club's activities and ensure its sustainability, there is a $15 fee due at the start of each semester. This fee is used to cover expenses such as club socials, necessary supplies, and other costs associated with running the club. This small investment is essential to the club's success and allows us to provide a wide range of opportunities for members to learn, grow, and create meaningful projects."
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
              <p>Application deadline for Spring 2024 is <b>Sunday, January 28th at 11:59 pm</b>. Click the button to get started!</p>
              <a href="https://forms.gle/s18KXscypWYR14CL9" target="_blank" rel="noopener noreferrer"><button className={`${homeStyles.getInvolvedButton} ${styles.applyButton}`}>Apply Now</button></a>
            </div>
          </div>
        </div>
        <img src={applyCurveBlue} className={styles.blueCurve} />
        <div className="limitWidth">
          <div className={styles.timeline}>
            <div className={styles.timelineWidth} id="timeline">
              <h1>Recruitment Timeline</h1>
              <p className={styles.importantNote}>*It is mandatory to attend the infosession and team meet & greet to apply!</p>
              <div className={styles.timelineContent}>
                <div className={styles.outer}>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>01</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>1/17-1/22</h3>
                        {/* <h3 className={styles.subtitle}>Applications Due</h3> */}
                        <p className={styles.information}>Tabling - come meet us on Sproul!</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>02</h1>
                      <div className={styles.stackContent}>
                        <div className={styles.content}>
                          <h3 className={styles.date}>1/19</h3>
                          <h3 className={styles.subtitle}>Infosession #1</h3>
                          <p className={styles.information}>Join us for our first infosession on <span className={styles.blue}>Friday, January 19th 8pm @ Dwinelle 88</span>. We'll dive into what our club is all about and share our plans for the semester. To apply for the club, attending at least one of the two infosessions is a must!</p>
                        </div>
                        <div className={styles.content}>
                          <h3 className={styles.date}>1/22</h3>
                          <h3 className={styles.subtitle}>Infosession #2</h3>
                          <p className={styles.information}>Our second infosession is on <span className={styles.blue}>Monday, January 22nd 9pm @ DWIN 219</span>. If you couldn't make it to the first info session, this serves as an alternative!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>03</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>1/25</h3>
                        <p className={styles.information}>Application opens!</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>04</h1>
                      <div className={styles.stackContent}>
                        <div className={styles.content}>
                          <h3 className={styles.date}>1/24</h3>
                          <h3 className={styles.subtitle}>Team Meet & Greet #1</h3>
                          <p className={styles.information}>Join us for our first team meet & greet on <span className={styles.blue}>Wednesday, January 24th 9pm @ SOCS 60</span>. Discover this semester's projects and get your questions answered. Attending one of the two meet & greets is a must to apply for the club!</p>
                        </div>
                        <div className={styles.content}>
                          <h3 className={styles.date}>1/25</h3>
                          <h3 className={styles.subtitle}>Team Meet & Greet #2</h3>
                          <p className={styles.information}>Our second team meet & greet is on <span className={styles.blue}>Thursday, January 25th 9pm @ SOCS 126</span>. If you couldn't make it to the first meet & greet, this serves as an alternative!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>05</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>1/28</h3>
                        <p className={styles.information}>Applications are due <span className={styles.blue}>Sunday, January 28th at 11:59pm</span>!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a href="https://forms.gle/s18KXscypWYR14CL9" target="_blank" rel="noopener noreferrer"><button className={`${homeStyles.getInvolvedButton} ${styles.applyButton}`}>Apply Now</button></a>
            </div>
          </div>
        </div>
      </div>
      <img 
        src={orangeCurve} 
        className={styles.orangeCurve}
        alt="orangeCurve"  
      ></img>
      {renderAllFaqs()}
    </div>
  );
}
