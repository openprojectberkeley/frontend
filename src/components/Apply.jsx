import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from '../css/Apply.module.css';
import homeStyles from '../css/HomePage.module.css';
import heroStyles from '../css/ImmersiveHero.module.css';
import useScrollCue from './useScrollCue';
import useInViewOnce from './useInViewOnce';
import { FixedStarField } from './StarField';
import JoinScene from './JoinScene';
import { ScrambleRuns } from './ScrambleText';
import { faqList } from '../data/faqList';
import { recruitmentTimeline, applySteps } from '../data/recruitmentTimeline';
import { CURRENT_SEMESTER, NEXT_SEMESTER } from '../data/site';
import { aboutValues } from '../data/aboutValues';
import circle from "../images/circle.png";

/*
 * The heading's sentence, marked the way the home page's is: each semester
 * gets a highlight of its own as its last letter lands - see JoinScene.
 */
const CLOSED_RUNS = [
  { text: 'Applications are now closed for the ' },
  { text: CURRENT_SEMESTER, colour: '#4DB6AC' },
  { text: ' cycle, come back for ' },
  { text: NEXT_SEMESTER, colour: '#AB8FF3' },
  { text: '!' },
];
const CLOSED_BUTTON = {
  label: 'Apply now!',
  disabled: true,
  note: 'open portal application period is over :(',
};

/*
 * Each step's number sits in white on a shape in one of the favicon's
 * gradients - see .shapeCircle - and its title is highlighted, and its lines
 * to the timeline drawn, in the gradient's last colour.
 */
const STEP_NUMBERS = [
  { shape: 'shapeCircle', colour: '#68E2C3' },
  { shape: 'shapeSquare', colour: '#FF910E' },
  { shape: 'shapeTriangle', colour: '#6EE978' },
];

/*
 * Each number (with its shape) and each step's words float on the hero's
 * drift, each on a period of its own so no two move together - see .drift1.
 */
const STEP_DRIFTS = [
  ['drift1', 'drift4'],
  ['drift3', 'drift2'],
  ['drift5', 'drift1'],
];

/*
 * The steps and the timeline come in by how far down the page the reader has
 * got rather than on a clock: the timeline's line and the lines from the
 * steps are drawn as the page is scrolled, and each step and each event comes
 * in as it - or for an event, its dot, which the line reaches at the same
 * moment - passes REVEAL_AT of the way down the window. Nothing goes back:
 * a line drawn stays drawn, and what has come in stays in.
 *
 * Once a step or event is reached, its own parts play on their own clock:
 * its number blurs in, its title is highlighted at --flash-at and its text
 * is typed in after.
 */
const REVEAL_AT = 0.75;
const FLASH_AT_MS = 200;
/* The title is highlighted .flashLater's beat behind the date. */
const FLASH_LATER_MS = 150;
const BODY_AFTER_FLASH_MS = 300;

/*
 * Body text is typed in with the scramble rather than highlighted, at a
 * steady rate whatever its length, within these bounds.
 */
const TYPE_MS_PER_LETTER = 14;
const TYPE_MIN_MS = 500;
const TYPE_MAX_MS = 1400;
const TYPE_HOLD = 0.08;
const typeMs = (runs) =>
  Math.min(
    TYPE_MAX_MS,
    Math.max(TYPE_MIN_MS, runs.reduce((length, run) => length + run.text.length, 0) * TYPE_MS_PER_LETTER),
  );

/*
 * The questions come in once, the first time the list is in view: each row
 * blurs in a beat after the one above it, and its question is typed in fast
 * as it does.
 */
const FAQ_GAP_MS = 70;
const FAQ_TYPE_AFTER_MS = 120;
const FAQ_TYPE_MS = 420;
/*
 * An answer is typed in every time it is opened, as closing it is its way
 * out - fast, as it is long, and starting as the row begins to open.
 */
const ANSWER_TYPE_MS = 700;

/* Each event's highlight is one of the about page's value colours, in turn. */
const EVENT_HIGHLIGHTS = aboutValues.map((value) => value.colour);

/*
 * The lines from each step to the events it is done at, as paths across the
 * section: from the right of the step's title to the left of the event's
 * number, leaving and arriving level. Measured from the page as laid out, in
 * the section's own coordinates.
 */
function measureLinks(section) {
  const box = section.getBoundingClientRect();

  return applySteps.flatMap((step, index) => {
    const from = section.querySelector(`[data-step="${index}"] [data-anchor]`);

    if (!from) return [];

    const start = from.getBoundingClientRect();
    const x1 = start.right - box.left + 14;
    const y1 = start.top + start.height / 2 - box.top;

    return step.events.flatMap((id) => {
      const to = section.querySelector(`[data-event="${id}"] [data-anchor]`);

      if (!to) return [];

      const end = to.getBoundingClientRect();
      const x2 = end.left - box.left - 10;
      const y2 = end.top + end.height / 2 - box.top;
      const bend = (x2 - x1) / 2;
      const at = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;

      return [
        {
          key: `${index}-${id}`,
          colour: STEP_NUMBERS[index].colour,
          d: `M ${at(x1, y1)} C ${at(x1 + bend, y1)}, ${at(x2 - bend, y2)}, ${at(x2, y2)}`,
          end: [x2, y2],
          top: Math.min(y1, y2),
          bottom: Math.max(y1, y2),
        },
      ];
    });
  });
}

/* Each of `now` that is raised, raised in `current` too - the same array if
   nothing new is, so a render is only asked for when something is. */
const latch = (current, now) =>
  now.some((value, index) => value && !current[index])
    ? current.map((value, index) => value || now[index])
    : current;

/*
 * Draws the steps' lines and the timeline's own as the page is scrolled, and
 * says which steps and events have been reached - see REVEAL_AT. Written
 * straight to the elements on the frame after each scroll, as
 * useScrollPlayhead does; React only hears when something new is reached.
 *
 * A line is drawn over the scroll that carries it, top to bottom, past
 * REVEAL_AT - the timeline's from its first dot to its last - and never
 * undrawn. Under reduced motion everything is there from the start.
 */
function useScrollDrawing(sectionRef, spineRef, linkRefs, reducedMotion) {
  const [links, setLinks] = useState([]);
  const [stepsSeen, setStepsSeen] = useState(() => applySteps.map(() => false));
  const [eventsSeen, setEventsSeen] = useState(() => recruitmentTimeline.map(() => false));
  const drawnRef = useRef({});

  // Where the lines go, measured again whenever the section changes size.
  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    let frameId = null;

    const measure = () => {
      frameId = null;
      setLinks(measureLinks(section));

      // The timeline's line, from its first dot to its last.
      const dots = section.querySelectorAll('[data-dot]');
      const spine = spineRef.current;

      if (spine && dots.length) {
        const box = spine.parentElement.getBoundingClientRect();
        const first = dots[0].getBoundingClientRect();
        const last = dots[dots.length - 1].getBoundingClientRect();

        spine.style.top = `${first.top + first.height / 2 - box.top}px`;
        spine.style.height = `${last.top - first.top}px`;
      }
    };

    // On the next frame rather than in the observer's own callback, as the
    // measuring can itself change the layout it reports on.
    const schedule = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(measure);
    };

    const observer = new ResizeObserver(schedule);

    measure();
    observer.observe(section);

    return () => {
      observer.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [sectionRef, spineRef]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    let frameId = null;

    const draw = () => {
      frameId = null;

      const reach = window.innerHeight * REVEAL_AT;
      const box = section.getBoundingClientRect();
      const drawn = drawnRef.current;
      // How much of a line from `top` to `bottom`, in the section, is drawn.
      const progress = (key, top, bottom) => {
        const now = reducedMotion
          ? 1
          : Math.min(1, Math.max(0, (reach - (box.top + top)) / Math.max(1, bottom - top)));

        drawn[key] = Math.max(drawn[key] ?? 0, now);

        return drawn[key];
      };

      links.forEach((link) => {
        const path = linkRefs.current[link.key];
        const shown = progress(link.key, link.top, link.bottom);

        if (path) {
          path.style.strokeDashoffset = `${1 - shown}`;
          path.parentElement.classList.toggle(styles.linkDone, shown >= 1);
        }
      });

      const spine = spineRef.current;

      if (spine) {
        const top = spine.parentElement.getBoundingClientRect().top - box.top + spine.offsetTop;

        spine.style.transform = `scaleY(${progress('spine', top, top + spine.offsetHeight)})`;
      }

      // Raised once the step's top, or the event's dot, is past REVEAL_AT.
      const passed = (selector) =>
        [...section.querySelectorAll(selector)].map(
          (node) => reducedMotion || node.getBoundingClientRect().top < reach,
        );
      const steps = passed('[data-step]');
      const events = passed('[data-dot]');

      setStepsSeen((current) => latch(current, steps));
      setEventsSeen((current) => latch(current, events));
    };

    const schedule = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(draw);
    };

    // On a frame rather than here, so that ScrollToTop has moved the window off
    // wherever the last page left it - from there, everything would be passed.
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [sectionRef, spineRef, linkRefs, links, reducedMotion]);

  return { links, stepsSeen, eventsSeen };
}

/* An event's text as ScrambleRuns' runs: its links and marked dates blue. */
const runsOf = (segments) =>
  segments.map((segment) => ({
    text: segment.text,
    href: segment.href,
    className: segment.href || segment.highlight ? styles.blue : undefined,
  }));

export default function Apply() {
  const showScrollCue = useScrollCue();
  const reducedMotion = useReducedMotion();

  const [revealedAnswers, setRevealedAnswers] = useState(Array(faqList.length).fill(false));
  /* How many times each answer has been opened: a new key for its typing on
     each, which types it in again - see ScrambleRuns. */
  const [answerOpens, setAnswerOpens] = useState(Array(faqList.length).fill(0));
  const nextSectionRef = useRef(null);
  const headRef = useRef(null);
  /*
   * The heading plays in as the home page's scene six does, but only once:
   * raised the first time it is in view and left raised, so scrolling back up
   * to it finds it as it was - see JoinScene.
   */
  const headIn = useInViewOnce(headRef, 0);

  const spineRef = useRef(null);
  const linkRefs = useRef({});
  const { links, stepsSeen, eventsSeen } = useScrollDrawing(nextSectionRef, spineRef, linkRefs, reducedMotion);

  const faqsRef = useRef(null);
  const faqsIn = useInViewOnce(faqsRef) || reducedMotion;

  const changeReveal = (index) => {
    let copy = revealedAnswers.slice();
    copy[index] = !copy[index];
    setRevealedAnswers(copy);
    if (copy[index]) setAnswerOpens((opens) => opens.map((count, at) => (at === index ? count + 1 : count)));
  };

  return (
    <>
      <FixedStarField />
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

        {/* Under everything from the heading down, taking no room - see
            .circle. */}
        <div className={styles.circle} aria-hidden="true">
          <img src={circle} alt="" />
        </div>

        <div ref={headRef} className={`${styles.applyHeader} limitWidth`}>
          <JoinScene
            arrived={headIn}
            reducedMotion={reducedMotion}
            runs={CLOSED_RUNS}
            button={CLOSED_BUTTON}
          />
        </div>

        {/* The steps down the left and the timeline down the right, with a
            line from each step to the events it is done at. */}
        <section ref={nextSectionRef} className={`${styles.process} limitWidth`} id="timeline">
          <svg className={styles.links} aria-hidden="true">
            {links.map((link) => (
              <g key={link.key} style={{ '--hl': link.colour }}>
                <path
                  ref={(node) => {
                    linkRefs.current[link.key] = node;
                  }}
                  d={link.d}
                  pathLength="1"
                />
                <circle cx={link.end[0]} cy={link.end[1]} r="4" />
              </g>
            ))}
          </svg>

          <ol className={styles.applySteps}>
            {applySteps.map((step, index) => {
              const runs = [{ text: step.text }];

              return (
                <li
                  className={`${styles.stepItem} ${stepsSeen[index] ? styles.inView : ''}`}
                  key={step.title}
                  data-step={index}
                  style={{
                    '--hl': STEP_NUMBERS[index].colour,
                    '--flash-at': `${FLASH_AT_MS}ms`,
                  }}
                >
                  <div className={`${styles.stepFigure} ${heroStyles[STEP_DRIFTS[index][0]]}`} aria-hidden="true">
                    <span className={`${styles.stepShape} ${styles[STEP_NUMBERS[index].shape]}`} />
                    <span className={styles.stepNumber}>
                      {index + 1}
                    </span>
                  </div>
                  <div className={`${styles.stepBody} ${heroStyles[STEP_DRIFTS[index][1]]}`}>
                    <p className={styles.stepTitle}>
                      <span className={styles.flash} data-anchor>{step.title}</span>
                    </p>
                    <p className={styles.stepText}>
                      <ScrambleRuns
                        runs={runs}
                        play={stepsSeen[index]}
                        delay={FLASH_AT_MS + BODY_AFTER_FLASH_MS}
                        duration={typeMs(runs)}
                        hold={TYPE_HOLD}
                        instant={reducedMotion}
                      />
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className={styles.timeline}>
            <h2 className={styles.sectionTitle}>Recruitment Timeline</h2>

            {/* Down a line, a dot on it for each event, its number to the
                left of the line and the rest to the right - see .events. */}
            <div className={styles.eventsColumn}>
              <span ref={spineRef} className={styles.spine} aria-hidden="true" />
              <ol className={styles.events}>
                {recruitmentTimeline.map((item, index) => (
                  <li
                    className={`${styles.event} ${eventsSeen[index] ? styles.inView : ''}`}
                    key={item.id}
                    data-event={item.id}
                    style={{
                      '--hl': EVENT_HIGHLIGHTS[index % EVENT_HIGHLIGHTS.length],
                      '--flash-at': `${FLASH_AT_MS}ms`,
                    }}
                  >
                    <p className={styles.eventNumber} data-anchor>{item.id}</p>
                    <span className={styles.eventDot} data-dot aria-hidden="true" />
                    <div className={styles.eventBody}>
                      <p className={styles.date}><span className={styles.flash}>{item.date}</span></p>
                      <h3 className={styles.subtitle}>
                        <span className={`${styles.flash} ${styles.flashLater}`}>{item.subtitle}</span>
                      </h3>
                      <p className={styles.information}>
                        <ScrambleRuns
                          runs={runsOf(item.information)}
                          play={eventsSeen[index]}
                          delay={FLASH_AT_MS + FLASH_LATER_MS + BODY_AFTER_FLASH_MS}
                          duration={typeMs(item.information)}
                          hold={TYPE_HOLD}
                          instant={reducedMotion}
                        />
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className={`${styles.faqs} limitWidth`} id="faqs">
          <h2 className={styles.sectionTitle}>FAQs</h2>
          <div ref={faqsRef} className={`${styles.faqList} ${faqsIn ? styles.inView : ''}`}>
            {faqList.map(([question, answer], index) => (
              <div
                key={question}
                className={`${styles.faqItem} ${revealedAnswers[index] ? styles.faqOpen : ''}`}
                style={{ transitionDelay: `${index * FAQ_GAP_MS}ms` }}
              >
                <button
                  type="button"
                  className={styles.faqQuestion}
                  aria-expanded={revealedAnswers[index]}
                  aria-controls={`faq-answer-${index}`}
                  aria-label={question}
                  onClick={() => changeReveal(index)}
                >
                  <ScrambleRuns
                    runs={[{ text: question }]}
                    play={faqsIn}
                    delay={index * FAQ_GAP_MS + FAQ_TYPE_AFTER_MS}
                    duration={FAQ_TYPE_MS}
                    hold={TYPE_HOLD}
                    instant={reducedMotion}
                  />
                  <span className={styles.faqToggle} aria-hidden="true" />
                </button>
                <div className={styles.faqAnswer} id={`faq-answer-${index}`}>
                  <div className={styles.faqAnswerInner}>
                    <p>
                      <ScrambleRuns
                        key={answerOpens[index]}
                        runs={[{ text: answer }]}
                        play={revealedAnswers[index]}
                        duration={ANSWER_TYPE_MS}
                        hold={TYPE_HOLD}
                        instant={reducedMotion}
                      />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
