import React, {useState} from 'react';
import styles from '../css/Apply.module.css';
import faqPlus from "../images/faqPlus.png"

export default function Apply() {

  const faqQuestions = [
    "this question 1 is very long and cannot fit on one line, it's actually very long",
    "this question 2",
    "this question 3",
  ];

  const faqAnswers = [
    "this answer 1",
    "this answer 2",
    "this answer 3",
  ];

  const [revealedAnswers, setRevealedAnswers] = useState(Array(faqQuestions.length).fill(false));

  const changeReveal = (index) => {
    let copy = revealedAnswers.slice();
    copy[index] = !copy[index];
    setRevealedAnswers(copy);
  };

  const renderFaqBox = (index) => {
    let boxKey = `faq-box-${index}`;
    let headerKey = `faq-header-${index}`;
    let answerKey = `faq-answer-${index}`;

    let faqElement = [];

    faqElement.push(
      <div className="faq-header" key={headerKey}>
          <div className="faq-question-container">
              <p className="faq-question">{faqQuestions[index]}</p>
          </div>
          <div className="faq-img-container">
              <img 
                  className="faq-plus" 
                  src={faqPlus} 
                  alt="faqPlus" 
                  onClick = { () => changeReveal(index)}
              >
              </img>
          </div>
      </div>
    );

    if (revealedAnswers[index]) {
        faqElement.push(
            <div key={answerKey} className="faq-answer-container">
                <p className="faq-answer">{faqAnswers[index]}</p>
            </div>
        );
    }

    return (
        <div key={boxKey} className="faq-box">
            {faqElement}
        </div>
    );  
  } 

  const renderAllFaqs = () => {
    let allFaqs = [];
    
    for (let index in faqAnswers) {
      let brKey = `faq-br-${index}`;

      allFaqs.push(renderFaqBox(index));
      allFaqs.push(<br key={brKey}></br>);
    }

    return (
        <div id="all-faqs">
            {allFaqs}
        </div>
    );
  }

  return (
    <div>
      <h1>Apply</h1>
      {renderAllFaqs()}
    </div>
  );
}