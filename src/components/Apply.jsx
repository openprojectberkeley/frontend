import React, {useState, useEffect, useRef} from 'react';
import styles from '../css/Apply.module.css';
import homeStyles from '../css/HomePage.module.css';
import useComingSoonLabel from './useComingSoonLabel';
import faqPlus from "../images/apply/faqPlus.png";
import headerCurve from "../images/apply/headerCurve.svg";
import faqCurve from "../images/apply/faqCurve.svg";
import { faqList } from '../data/faqList';
import { recruitmentTimeline } from '../data/recruitmentTimeline';
import circle from "../images/circle.png";

export default function Apply() {

  const pageBgRef = useRef(null);
  const [revealedAnswers, setRevealedAnswers] = useState(Array(faqList.length).fill(false));
  const { label: comingSoonLabel, onMouseEnter, onMouseMove, onMouseLeave } = useComingSoonLabel();
  const nextSectionRef = useRef(null);
  const [showScrollCue, setShowScrollCue] = useState(true);

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
    }

    return (
        <div className={`${styles.allFaqs} limitWidth`} id="faqs">
          <h1 className={styles.faqTitle}>FAQs</h1>
          {allFaqs}
        </div>
    );
  }

  const renderTimelineText = (segments) => {
    return segments.map((segment, index) => {
      if (segment.highlight) {
        return (
          <span key={`${segment.text}-${index}`} className={styles.blue}>
            {segment.text}
          </span>
        );
      }

      return <React.Fragment key={`${segment.text}-${index}`}>{segment.text}</React.Fragment>;
    });
  };

  useEffect(() => {
    const pageBg = pageBgRef.current;

    if (!pageBg) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId = null;

    const updateParallax = () => {
      const offset = prefersReducedMotion ? 0 : Math.round(window.scrollY * 0.5);
      pageBg.style.setProperty('--page-bg-offset', `${offset}px`);
      setShowScrollCue(window.scrollY <= 8);
      frameId = null;
    };

    const onScroll = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div ref={pageBgRef} className={styles.pageBG}>
      {comingSoonLabel}

      <div className={styles.applyWrapper}>
        <button
          type="button"
          className={homeStyles.scrollCue}
          aria-label="Scroll down"
          onClick={() => nextSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          style={{ opacity: showScrollCue ? 1 : 0, pointerEvents: showScrollCue ? 'auto' : 'none' }}
        >
          <span className={homeStyles.scrollCueMain}>⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho1}`} aria-hidden="true">⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho2}`} aria-hidden="true">⌄</span>
        </button>
        <div className="limitWidth">
          <div className={styles.applyHeader}>
            <div className={styles.headerBlock}>
              <h1>Join us!</h1>
              <p>The application for the Spring 2026 cycle is closed, check back for Fall 2026!</p>
            </div>
            <button
              className={styles.applyButton}
              style={{ opacity: 0.15 }}
              onMouseEnter={onMouseEnter}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
            >
              Apply in August!
            </button> {/* https://docs.google.com/forms/d/e/1FAIpQLSfe-V2VIBt2JrB-GguIqrsyPRPNnX0YJFZQom5mwdmXF-ck7w/viewform */}
          </div>
        </div>
        <img src={headerCurve} className={styles.headerCurve} alt="Header curve decoration" />
        
        <div className="limitWidth">
          <div className={styles.timeline}>
            <div className={styles.timelineWidth} id="timeline" ref={nextSectionRef}>
              <h1>Recruitment Timeline</h1>
              <p className={styles.importantNote}>*It is mandatory to attend an infosession and coffee chat a board member to apply!</p>
              <div className={styles.timelineContent}>
                <div className={styles.outer}>
                  {recruitmentTimeline.map((item) => (
                    <div className={styles.card} key={item.id}>
                      <div className={styles.info}>
                        <h1 className={styles.title}>{item.id}</h1>
                        <div className={styles.content}>
                          <h3 className={styles.date}>{item.date}</h3>
                          <h3 className={styles.subtitle}>{item.subtitle}</h3>
                          <p className={styles.information}>{renderTimelineText(item.information)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* <a href="https://docs.google.com/forms/d/e/1FAIpQLSd6BszZZDpva4geAYaK6WZSptI86x92fTRwQx6XSdfBLJZuyQ/viewform?usp=dialog" target="_blank" rel="noopener noreferrer"><button className={`${homeStyles.getInvolvedButton} ${styles.applyButton}`}>Apply Now</button></a> */}
            </div>
            <div className={styles.circle}>
              <img src={circle} alt="Circle decoration" />
            </div>
          </div>
        </div>
      </div>
      <img 
        src={faqCurve} 
        className={styles.faqCurve}
        alt="FAQ curve decoration"  
      />
      {renderAllFaqs()}
    </div>
  );
}
