import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/ImmersiveHero.module.css';
import homeStyles from '../css/HomePage.module.css';
import scramble from './scramble';
import useCursorTip from './useCursorTip';
import { HIGHLIGHT_TINTS } from './MomentStrip';
import { applicationDeadline } from '../data/recruitmentTimeline';

/*
 * Scene six's copy: the call to apply, set the way the about page sets its
 * opening (see AboutScene) - the heading blurring in beside a sentence that
 * scrambles in after it - with the hero's own button under the sentence.
 *
 * All three are set off by `arrived`, which the hero raises once the copy is
 * coming up the screen and lowers again above it, and run on their own clock
 * from there. The heading and the button blur back out above it and so blur
 * in again coming back down; the sentence has no way out, so once it is typed
 * it stays typed. The button waits for most of the sentence, then blurs in the
 * way the one at the top of the hero blurs out.
 *
 * The sentence is in runs so the date and the time can each be marked: as the
 * last letter of either lands, a highlight in a colour of its own sweeps in
 * under it, as the mission's label does on the about page. The date and time
 * are applicationDeadline in data/recruitmentTimeline.js.
 *
 * The apply page sets its own heading the same way: `runs` for a sentence of
 * its own, `button` for its own label and where it goes - or `disabled`, for
 * a button that is there but greyed out, with `note` to say why in a label
 * that follows the cursor over it. The contact and not-found pages do too, with
 * `title` for a heading of their own; contact passes no `button`, as its form
 * is what comes next, and `headClassName` and `titleClassName` to stack and
 * colour it. A `button` with `back` is the plain one, with no fill and its arrow
 * pointing back in front of its label. `titleAside` is set in line after the
 * heading, blurring in with it - a board member's profile links.
 */

const JOIN_RUNS = [
  { text: 'Application deadline is ' },
  { text: applicationDeadline.day, colour: '#4DB6AC' },
  { text: ' at ' },
  { text: applicationDeadline.time, colour: '#AB8FF3' },
  { text: '. Click the button to learn more!' },
];
const JOIN_BUTTON = { label: 'Get Involved', to: '/apply' };
/* A beat after the heading has started to clear, then the sentence. */
const JOIN_BODY_DELAY_MS = 250;
const JOIN_BODY_MS = 1400;
const JOIN_BODY_HOLD = 0.08;

/*
 * Where each run starts in the sentence, and where in the scramble its last
 * letter lands - letter i starts i steps in and holds for JOIN_BODY_HOLD -
 * which is when its highlight sets off.
 */
function spansOf(runs) {
  const length = runs.reduce((total, run) => total + run.text.length, 0);

  return runs.reduce((spans, run) => {
    const start = spans.length ? spans[spans.length - 1].end : 0;
    const end = start + run.text.length;
    const done = ((end - 1) * (1 - JOIN_BODY_HOLD)) / (length - 1) + JOIN_BODY_HOLD;

    return [...spans, { ...run, start, end, done }];
  }, []);
}

export default function JoinScene({
  arrived,
  reducedMotion,
  title = 'Join us!',
  headClassName = '',
  titleClassName = '',
  titleAside = null,
  runs = JOIN_RUNS,
  button = JOIN_BUTTON,
}) {
  const shown = arrived || reducedMotion;
  const runRefs = useRef([]);
  /* Whether the sentence has been typed all the way in - see above. */
  const typedRef = useRef(false);
  const cursorTip = useCursorTip(styles.joinTip);
  const body = useMemo(() => runs.map((run) => run.text).join(''), [runs]);
  const spans = useMemo(() => spansOf(runs), [runs]);

  useEffect(() => {
    const write = (text, progress) => {
      spans.forEach((span, index) => {
        const node = runRefs.current[index];

        if (!node) return;

        node.textContent = text.slice(span.start, span.end);
        if (span.colour) node.classList.toggle(styles.highlightOn, progress >= span.done);
      });
    };

    if (reducedMotion || typedRef.current) {
      write(body, 1);
      return undefined;
    }

    // Empty until it is first reached.
    if (!arrived) {
      write('', 0);
      return undefined;
    }

    let frame = null;
    const start = performance.now() + JOIN_BODY_DELAY_MS;

    const step = (now) => {
      const progress = Math.min(1, Math.max(0, (now - start) / JOIN_BODY_MS));

      write(scramble('', body, progress, JOIN_BODY_HOLD), progress);
      if (progress >= 1) typedRef.current = true;
      frame = progress < 1 ? window.requestAnimationFrame(step) : null;
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [arrived, reducedMotion, body, spans]);

  return (
    <div className={`${styles.aboutHead} ${headClassName}`}>
      {titleAside ? (
        <div className={styles.titleRow}>
          <h2 className={`${styles.aboutTitle} ${shown ? styles.revealed : ''} ${titleClassName}`}>{title}</h2>
          <div className={`${styles.titleAside} ${shown ? styles.revealed : ''}`}>{titleAside}</div>
        </div>
      ) : (
        <h2 className={`${styles.aboutTitle} ${shown ? styles.revealed : ''} ${titleClassName}`}>{title}</h2>
      )}

      <div className={styles.joinBody}>
        <p className={styles.aboutMission}>
          <span className={styles.srOnly}>{body}</span>
          {/* The full sentence, invisible and with its marked runs padded as
              the live ones are, holds the paragraph's shape so the lines do
              not reflow as the letters arrive over it. */}
          <span className={styles.missionSizer} aria-hidden="true">
            {spans.map((span, index) => (
              <span key={index} className={span.colour ? styles.highlight : undefined}>
                {span.text}
              </span>
            ))}
          </span>
          <span className={styles.missionLive} aria-hidden="true">
            {spans.map((span, index) => (
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

        {button && (button.disabled ? (
          // The handlers are on the box, as a disabled button gets no pointer
          // events of its own.
          <div
            className={`${styles.cta} ${styles.joinCta} ${shown ? '' : styles.ctaGone}`}
            onPointerEnter={button.note ? (event) => cursorTip.show(event, button.note, HIGHLIGHT_TINTS[0]) : undefined}
            onPointerMove={button.note ? cursorTip.move : undefined}
            onPointerLeave={button.note ? cursorTip.hide : undefined}
          >
            <button
              type="button"
              disabled
              className={`${homeStyles.getInvolvedButton} ${styles.ctaButton} ${styles.joinButton}`}
            >
              {button.label}
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
          <Link
            to={button.to}
            className={`${styles.cta} ${styles.joinCta} ${shown ? '' : styles.ctaGone}`}
            tabIndex={shown ? undefined : -1}
          >
            <button className={`${homeStyles.getInvolvedButton} ${styles.ctaButton} ${button.back ? styles.ctaBack : styles.joinButton}`}>
              {button.back && <span className={styles.ctaArrowBack} aria-hidden="true">←</span>}
              {button.label}
              {!button.back && <span className={styles.ctaArrow} aria-hidden="true">→</span>}
            </button>
          </Link>
        ))}
      </div>

      {button?.note && cursorTip.tip}
    </div>
  );
}
