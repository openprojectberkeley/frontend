import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/ImmersiveHero.module.css';
import homeStyles from '../css/HomePage.module.css';
import scramble from './scramble';
import { applicationDeadline } from '../data/recruitmentTimeline';

/*
 * Scene six's copy: the call to apply, set the way the about page sets its
 * opening (see AboutScene) - the heading blurring in beside a sentence that
 * scrambles in after it - with the hero's own button under the sentence.
 *
 * All three are set off by `arrived`, which the hero raises once the copy is
 * coming up the screen and lowers again above it, and run on their own clock
 * from there, so coming back down plays them again. The button waits for most
 * of the sentence, then blurs in the way the one at the top of the hero blurs
 * out.
 *
 * The sentence is in runs so the date and the time can each be marked: as the
 * last letter of either lands, a highlight in a colour of its own sweeps in
 * under it, as the mission's label does on the about page. The date and time
 * are applicationDeadline in data/recruitmentTimeline.js.
 */

const JOIN_RUNS = [
  { text: 'Application deadline is ' },
  { text: applicationDeadline.day, colour: '#4DB6AC' },
  { text: ' at ' },
  { text: applicationDeadline.time, colour: '#AB8FF3' },
  { text: '. Click the button to learn more!' },
];
const JOIN_BODY = JOIN_RUNS.map((run) => run.text).join('');
/* A beat after the heading has started to clear, then the sentence. */
const JOIN_BODY_DELAY_MS = 250;
const JOIN_BODY_MS = 1400;
const JOIN_BODY_HOLD = 0.08;

/*
 * Where each run starts in the sentence, and where in the scramble its last
 * letter lands - letter i starts i steps in and holds for JOIN_BODY_HOLD -
 * which is when its highlight sets off.
 */
const JOIN_SPANS = JOIN_RUNS.reduce((spans, run) => {
  const start = spans.length ? spans[spans.length - 1].end : 0;
  const end = start + run.text.length;
  const done =
    ((end - 1) * (1 - JOIN_BODY_HOLD)) / (JOIN_BODY.length - 1) + JOIN_BODY_HOLD;

  return [...spans, { ...run, start, end, done }];
}, []);

export default function JoinScene({ arrived, reducedMotion }) {
  const shown = arrived || reducedMotion;
  const runRefs = useRef([]);

  useEffect(() => {
    const write = (text, progress) => {
      JOIN_SPANS.forEach((span, index) => {
        const node = runRefs.current[index];

        if (!node) return;

        node.textContent = text.slice(span.start, span.end);
        if (span.colour) node.classList.toggle(styles.highlightOn, progress >= span.done);
      });
    };

    if (reducedMotion) {
      write(JOIN_BODY, 1);
      return undefined;
    }

    // Above the copy it is empty, so coming back down plays it again.
    if (!arrived) {
      write('', 0);
      return undefined;
    }

    let frame = null;
    const start = performance.now() + JOIN_BODY_DELAY_MS;

    const step = (now) => {
      const progress = Math.min(1, Math.max(0, (now - start) / JOIN_BODY_MS));

      write(scramble('', JOIN_BODY, progress, JOIN_BODY_HOLD), progress);
      frame = progress < 1 ? window.requestAnimationFrame(step) : null;
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [arrived, reducedMotion]);

  return (
    <div className={styles.aboutHead}>
      <h2 className={`${styles.aboutTitle} ${shown ? styles.revealed : ''}`}>Join us!</h2>

      <div className={styles.joinBody}>
        <p className={styles.aboutMission}>
          <span className={styles.srOnly}>{JOIN_BODY}</span>
          {/* The full sentence, invisible and with its marked runs padded as
              the live ones are, holds the paragraph's shape so the lines do
              not reflow as the letters arrive over it. */}
          <span className={styles.missionSizer} aria-hidden="true">
            {JOIN_SPANS.map((span, index) => (
              <span key={index} className={span.colour ? styles.highlight : undefined}>
                {span.text}
              </span>
            ))}
          </span>
          <span className={styles.missionLive} aria-hidden="true">
            {JOIN_SPANS.map((span, index) => (
              <span
                key={index}
                ref={(node) => {
                  runRefs.current[index] = node;
                }}
                className={span.colour ? styles.highlight : undefined}
                style={span.colour ? { '--hl': span.colour } : undefined}
              />
            ))}
          </span>
        </p>

        <Link
          to="/apply"
          className={`${styles.cta} ${styles.joinCta} ${shown ? '' : styles.ctaGone}`}
          tabIndex={shown ? undefined : -1}
        >
          <button className={`${homeStyles.getInvolvedButton} ${styles.ctaButton} ${styles.joinButton}`}>
            Get Involved
            <span className={styles.ctaArrow} aria-hidden="true">→</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
