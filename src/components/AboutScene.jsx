import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from '../css/ImmersiveHero.module.css';
import scramble from './scramble';
import { aboutValues, MISSION, MISSION_PREFIX } from '../data/aboutValues';

/*
 * Scene six's copy: the about page's opening, recomposed for the end of the
 * hero.
 *
 * The heading and the mission sit side by side. The heading blurs in the way
 * scene two's overlays do; the mission then scrambles in from its first letter
 * to its last. Both are set off by `arrived`, which the hero raises once the
 * copy is on screen and lowers again above it - and on their own clock from
 * there, not the scroll's, so a reader who stops scrolling still sees the
 * sentence finish.
 *
 * Under it the four values are only their shapes, set out in a diamond and
 * drifting on the hero's float. What each one stands for is a box of graph paper that follows the
 * cursor over it - or, with no cursor to follow, opens under the shape that
 * was tapped or pressed.
 */

const MISSION_FULL = `${MISSION_PREFIX} ${MISSION}`;
/* A beat after the heading has started to clear, then the sentence. */
const MISSION_DELAY_MS = 250;
const MISSION_MS = 1800;
/*
 * How much of the run each letter spends scrambling. Far less than the
 * heading's third: across a whole sentence a third would be forty letters of
 * noise at the leading edge, where this keeps it to a dozen or so.
 */
const MISSION_HOLD = 0.08;
/*
 * Where in the run the last letter of "Mission statement:" lands, and so
 * where its highlight sets off: the scramble starts letter i at i steps in and
 * holds it for MISSION_HOLD.
 */
const MISSION_PREFIX_DONE =
  ((MISSION_PREFIX.length - 1) * (1 - MISSION_HOLD)) / (MISSION_FULL.length - 1) + MISSION_HOLD;

/*
 * The values' card. It wipes in from the left and its words are typed in
 * behind the wipe with the same scramble as the mission. The title arrives
 * a line at a time, each under a bar of its value's colour that wipes in and
 * straight back out, leaving it in that colour on the paper - see .titleFlash.
 */
const CARD_BODY_DELAY_MS = 220;
const CARD_BODY_MS = 650;
/* The least room the card keeps from the bottom and top of the window. */
const TIP_MARGIN = 12;

/*
 * A line of text that types itself in with the scramble, once, when it
 * mounts - give it a new key to play it again.
 *
 * The full text sits invisibly underneath and holds the box's shape, so
 * nothing around it reflows as the letters arrive; the live letters are laid
 * over it.
 */
function ScrambleText({ text, delay, duration, hold, className }) {
  const liveRef = useRef(null);

  useEffect(() => {
    let frame = null;
    const start = performance.now() + delay;

    const step = (now) => {
      const progress = Math.min(1, Math.max(0, (now - start) / duration));

      if (liveRef.current) liveRef.current.textContent = scramble('', text, progress, hold);

      frame = progress < 1 ? window.requestAnimationFrame(step) : null;
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [text, delay, duration, hold]);

  return (
    <span className={`${styles.scrambleBox} ${className ?? ''}`}>
      <span className={styles.scrambleSizer} aria-hidden="true">
        {text}
      </span>
      <span className={styles.scrambleLive} aria-hidden="true">
        <span ref={liveRef} />
      </span>
    </span>
  );
}

/*
 * A title whose lines each get their own colour bar, one after the other, so
 * a title that wraps is not highlighted as one block with the space beside
 * its short line.
 *
 * It is set once as plain words to see where the card wraps them, then
 * before anything is painted the words are regrouped into a block per line.
 * The card is remounted on every opening, so it is measured again each time.
 */
function FlashTitle({ text }) {
  const measureRef = useRef(null);
  const [lines, setLines] = useState(null);

  useLayoutEffect(() => {
    const words = measureRef.current?.children;

    if (!words) return;

    const grouped = [];
    let top = null;

    for (const word of words) {
      if (word.offsetTop !== top) {
        grouped.push([]);
        top = word.offsetTop;
      }
      grouped[grouped.length - 1].push(word.textContent.trim());
    }

    setLines(grouped.map((line) => line.join(' ')));
  }, [text]);

  if (!lines) {
    return (
      <span ref={measureRef} className={styles.titleMeasure}>
        {text.split(' ').map((word, index) => (
          <span key={index}>{index ? ` ${word}` : word}</span>
        ))}
      </span>
    );
  }

  return lines.map((line, index) => (
    <span key={index} className={styles.titleLine}>
      <span className={styles.titleFlash} style={{ '--line': index }}>
        <span className={styles.titleFlashBase}>{line}</span>
      </span>
    </span>
  ));
}

export default function AboutScene({ arrived, reducedMotion }) {
  const prefixRef = useRef(null);
  const restRef = useRef(null);

  // --- the mission ---------------------------------------------------------
  useEffect(() => {
    const write = (text) => {
      if (prefixRef.current) prefixRef.current.textContent = text.slice(0, MISSION_PREFIX.length);
      if (restRef.current) restRef.current.textContent = text.slice(MISSION_PREFIX.length);
    };

    const highlight = (on) => prefixRef.current?.classList.toggle(styles.highlightOn, on);

    if (reducedMotion) {
      write(MISSION_FULL);
      highlight(true);
      return undefined;
    }

    // Above the copy it is empty, so coming back down plays it again.
    if (!arrived) {
      write('');
      highlight(false);
      return undefined;
    }

    let frame = null;
    const start = performance.now() + MISSION_DELAY_MS;

    const step = (now) => {
      const progress = Math.min(1, Math.max(0, (now - start) / MISSION_MS));

      write(scramble('', MISSION_FULL, progress, MISSION_HOLD));
      // Once the label is all there, the highlight sweeps in under it.
      if (progress >= MISSION_PREFIX_DONE) highlight(true);
      frame = progress < 1 ? window.requestAnimationFrame(step) : null;
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [arrived, reducedMotion]);

  // --- the values' box -----------------------------------------------------
  const diamondRef = useRef(null);
  const tipRef = useRef(null);
  /* Which pointer pressed last, so a mouse click is left to the hover. */
  const pressedWithRef = useRef(null);
  const [active, setActive] = useState(null);
  /* Pinned under a shape rather than following the cursor. */
  const [pinned, setPinned] = useState(false);
  /*
   * Counts every opening, so the card's wipe, typing and highlight play again
   * each time it opens or moves to another shape.
   */
  const [opening, setOpening] = useState(0);
  /* The value last shown, which the card keeps while it fades out. */
  const shownRef = useRef(null);

  const open = useCallback((index, pin) => {
    setActive(index);
    setPinned(pin);
    setOpening((count) => count + 1);
  }, []);

  /*
   * Written straight to the box, as the moments' label is: a cursor moves on
   * every frame, and a render per move would be the whole tree for two
   * numbers. Down and to the right of the hotspot, and turned to the left of
   * it past the middle of the window, where the box would run off the edge.
   */
  /*
   * Where the box's top edge was put, before any lift: the y it was given
   * plus the gap it is set below that point by in the stylesheet.
   */
  const tipTopRef = useRef(0);

  /*
   * Lifts the box by however much of it would fall past the bottom of the
   * window, so all of it can be read - though never past the top.
   */
  const fitTip = useCallback(() => {
    const tip = tipRef.current;

    if (!tip) return;

    const over = tipTopRef.current + tip.offsetHeight + TIP_MARGIN - window.innerHeight;
    const lift = Math.min(Math.max(0, over), Math.max(0, tipTopRef.current - TIP_MARGIN));

    tip.style.setProperty('--tip-lift', `${lift}px`);
  }, []);

  const follow = useCallback((event) => {
    const tip = tipRef.current;

    if (!tip) return;

    tip.style.setProperty('--tip-x', `${event.clientX}px`);
    tip.style.setProperty('--tip-y', `${event.clientY}px`);
    // .valueTip sets the box 1rem below the cursor.
    tipTopRef.current =
      event.clientY + parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    fitTip();
    tip.style.setProperty(
      '--tip-flip',
      event.clientX > window.innerWidth * 0.55 ? 'calc(-100% - 1.7rem)' : '0%',
    );
  }, [fitTip]);

  /* Under the middle of the shape, kept inside the window. */
  const pinUnder = useCallback((shape) => {
    const tip = tipRef.current;

    if (!tip) return;

    const rect = shape.getBoundingClientRect();
    const half = Math.min(352, window.innerWidth * 0.86) / 2 + 12;
    const x = Math.min(window.innerWidth - half, Math.max(half, rect.left + rect.width / 2));

    tip.style.setProperty('--tip-x', `${x}px`);
    tip.style.setProperty('--tip-y', `${rect.top + rect.height * 0.7}px`);
    tip.style.setProperty('--tip-flip', '0%');
    tipTopRef.current = rect.top + rect.height * 0.7;
    fitTip();
  }, [fitTip]);

  /* The card is only its new size once it has rendered, so fit it again then. */
  useLayoutEffect(() => {
    if (active !== null) fitTip();
  }, [active, opening, fitTip]);

  const close = useCallback(() => {
    setActive(null);
    setPinned(false);
  }, []);

  /* A pinned box is fixed to the window, so it goes when the page moves or a
     press lands anywhere but the diamond. */
  useEffect(() => {
    if (!pinned) return undefined;

    const onDown = (event) => {
      if (!diamondRef.current?.contains(event.target)) close();
    };

    document.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', close, { passive: true });

    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', close);
    };
  }, [pinned, close]);

  const value = active === null ? null : aboutValues[active];

  if (value) shownRef.current = value;

  const shown = shownRef.current;

  return (
    <>
      <div className={styles.aboutHead}>
        <h2 className={`${styles.aboutTitle} ${arrived || reducedMotion ? styles.revealed : ''}`}>
          About Us
        </h2>

        <p className={styles.aboutMission}>
          <span className={styles.srOnly}>{MISSION_FULL}</span>
          {/* The full sentence, invisible, holds the paragraph's shape so the
              lines do not reflow as the letters arrive over it. */}
          <span className={styles.missionSizer} aria-hidden="true">
            {MISSION_FULL}
          </span>
          <span className={styles.missionLive} aria-hidden="true">
            <span
              ref={prefixRef}
              className={`${styles.missionPrefix} ${styles.highlight}`}
              style={{ '--hl': '#F9C12C' }}
            />
            <span ref={restRef} />
          </span>
        </p>
      </div>

      <div ref={diamondRef} className={styles.valuesDiamond}>
        {aboutValues.map((item, index) => (
          <button
            key={item.key}
            type="button"
            className={`${styles.valueShape} ${styles[`valueShape_${item.key}`]}`}
            aria-label={`${item.title}: ${item.body}`}
            onPointerDown={(event) => {
              pressedWithRef.current = event.pointerType;
            }}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'mouse') return;
              follow(event);
              open(index, false);
            }}
            onPointerMove={(event) => {
              if (event.pointerType === 'mouse' && !pinned) follow(event);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === 'mouse' && !pinned) setActive(null);
            }}
            onClick={(event) => {
              const pressedWith = pressedWithRef.current;

              pressedWithRef.current = null;

              // A mouse already has the box from hovering.
              if (pressedWith === 'mouse') return;

              if (active === index && pinned) {
                close();
              } else {
                pinUnder(event.currentTarget);
                open(index, true);
              }
            }}
            onBlur={() => {
              if (pinned && active === index) close();
            }}
          >
            <img src={item.image} alt="" draggable="false" />
          </button>
        ))}
      </div>

      <div
        ref={tipRef}
        className={`${styles.valueTip} ${value ? styles.valueTipOpen : ''} ${
          pinned ? styles.valueTipPinned : ''
        }`}
        aria-hidden="true"
      >
        {shown && (
          <span key={opening} className={styles.valueCard} style={{ '--hl': shown.colour }}>
            <span className={styles.grid} />
            <span className={styles.valueTipText}>
              <span className={styles.valueTipTitle}>
                <FlashTitle text={shown.title} />
              </span>
              <ScrambleText
                text={shown.body}
                delay={CARD_BODY_DELAY_MS}
                duration={CARD_BODY_MS}
                hold={0.08}
                className={styles.valueTipBody}
              />
            </span>
          </span>
        )}
      </div>
    </>
  );
}
