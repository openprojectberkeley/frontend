import React, {useState} from 'react';
import styles from '../css/Apply.module.css';
import faqPlus from "../images/faqPlus.png";
import purpleCurve from "../images/purplewave.png";
import homeStyles from "../css/HomePage.module.css";
import applyCurveTan from '../images/tanwave.png';

const faqList = [
  [
    "What sets this club apart from other tech clubs?",
  
    `Open Project is unique in that our community is built on the principle of ensuring the best club experience possible for everybody. 

We do not believe in a rigorous application process as we believe that every student with an interest in tech and the motivation to succed in tech should have a space to improve their technical skills while finding a like-minded community they can be a part of.

We also have a unique project matching process, where prospective members rank the projets they are interested in the most, to ensure that the work our members engage in are meaningful to them. This ensures a highly personalized and fulfilling process for all members. `
  ],

  [
  "Who can join?",
  
  `We welcome everybody of all interests and ages! Whether you are a seasoned programmer or just trying to see if tech is a career for you, OP has a space dedicated to helping you grow. 

  Open Project offers several programs to it’s members based on skill level. For those just getting started in tech, we have our Professional Development program where members will learn the fundamentals of web development and data science. 
  
  For more seasoned programmers and data scientists, we have passion projects led by project managers in teams of 10-15 where they work semester long in projects of varying scope and interests.
  
  We also have several client projects, where we work with entities outside of UC Berkeley. These projects are led by our most talented and skilled project managers to ensure our highest quality of work. 
  
  As a reminder, all prospective applicants must attend 1 infosession, 1 meet and greet, and coffee chat one member to apply. Infosession 1 and 2 cover the same material but serve as alternative dates for those that can’t make one.`
  ],

  [
  "Is there a social aspect to this club?", "Yes! One of the main focuses outside of building technical experience in Open Project is fostering a strong tech community on campus. We have a big-little program, where new members can be paired with either upperclassmen or those who have spent more time in the club. They serve as friends and mentors! You will also be spending a lot of time in your project team, and chumming is a big part of our club, where you can spend time outside of work to bond with your teammates! We also host various socials and cross-club socials to help you build an extensive network."
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

 "No worries! Our Professional Development progam has been meticuously engineered to help you build the fundamental skills necessary to succeed in the industry. From learning about web development to data science, you can build skills that will outlast college! "
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
              <p>The application for Fall 2025 are now open! Applications are due September 6th at 11:59pm!</p>
              {<a href="https://forms.gle/ELsu1uuSVV1EMrJM7" target="_blank" rel="noopener noreferrer"><button className={`${homeStyles.getInvolvedButton} ${styles.applyButton}`}>Apply Now</button></a> }
            </div>
          </div>
        </div>
        <img src={applyCurveTan} className={styles.blueCurve} alt="Blue curve decoration" />
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
                        <h3 className={styles.date}>August 29</h3>
                        <h3 className={styles.subtitle}>Data Bytes</h3>
                        <p className={styles.information}>Join us for Data Bytes, a joint Data Science club infosession on <span className={styles.blue}>Friday, Aug 29th 8pm @ VLSB 2050</span>!</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>02</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>September 4</h3>
                        <h3 className={styles.subtitle}>Club Infosession 1/Meet & Greet 1</h3>
                        <p className={styles.information}>Our first infosession is on <span className={styles.blue}>Thursday, Sept 4th 8-10pm @ Dwinelle 234</span>.</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>03</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>September 5</h3>
                        <h3 className={styles.subtitle}>Club Infosession 2/Meet & Greet 2</h3>
                        <p className={styles.information}>Our second infosession is on <span className={styles.blue}>Friday, Sept 5th 8-10pm @ VLSB 2040</span>.</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>04</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>September 6</h3>
                        <h3 className={styles.subtitle}>Applications Due</h3>
                        <p className={styles.information}>Applications are due <span className={styles.blue}>11:59 PM</span> that night.</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.info}>
                      <h1 className={styles.title}>05</h1>
                      <div className={styles.content}>
                        <h3 className={styles.date}>September 9</h3>
                        <h3 className={styles.subtitle}>Welcome Night</h3>
                        <p className={styles.information}>Welcome night is on <span className={styles.blue}>Tuesday, Sept 9th</span>! We are excited to have you on board!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <a href="https://docs.google.com/forms/d/e/1FAIpQLSd6BszZZDpva4geAYaK6WZSptI86x92fTRwQx6XSdfBLJZuyQ/viewform?usp=dialog" target="_blank" rel="noopener noreferrer"><button className={`${homeStyles.getInvolvedButton} ${styles.applyButton}`}>Apply Now</button></a> */}
            </div>
          </div>
        </div>
      </div>
      <img 
        src={purpleCurve} 
        className={styles.orangeCurve}
        alt="Orange curve decoration"  
      />
      {renderAllFaqs()}
    </div>
  );
}