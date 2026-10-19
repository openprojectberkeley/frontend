import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from '../css/ImmersiveHero.module.css';
import homeStyles from '../css/HomePage.module.css';
import LogoMark, { DISC_CENTRE_X, DISC_CENTRE_Y, DISC_WIDTH } from './LogoMark';
import useScrollPlayhead from './useScrollPlayhead';

/* The phrases the wordmark types, holds, deletes and moves on from, forever. */
const PHRASES = ['Open Project', 'Fall Semester 2026', 'Experience For All.'];
const TYPE_MS = 95;
const DELETE_MS = 45;
const HOLD_MS = 1900;
const BETWEEN_MS = 350;

/*
 * The scenes the pinned stage plays through, as playhead positions: scene one
 * runs to 0.51, scene two from there to 2. The playhead is measured in screens
 * of scrolling, so scene two takes about three times the scroll scene one does,
 * which is what makes the bubbles drift up rather than shoot past.
 *
 * Adding a scene is adding a line here and a block in applyPlayhead; the
 * section grows to suit on its own.
 */
const SCENES = [
  { name: 'zoom into the mark', end: 0.51 },
  { name: 'bubbles rise', end: 4.2 },
];

const TIMELINE_END = SCENES[SCENES.length - 1].end;
const ZOOM_END = SCENES[0].end;

// Where the disc comes to rest: a quarter of the way across, and big enough
// that its radius is a third of the stage's height.
const DISC_REST_X = 0.25;
const DISC_REST_Y = 0.5;
const DISC_REST_RADIUS = 1 / 3;
// A third of the height is most of the width on a portrait phone, where the
// disc would swallow the screen and leave the bubbles nowhere to be. The cap is
// against width, so the scene composes the same way whatever the shape of the
// viewport.
const DISC_REST_RADIUS_MAX = 0.45;

/*
 * How far the mark travels up during scene two, in vh. Set just under the
 * front bubbles' speed, so it moves with them rather than against them but
 * lags a little and stays in shot longest.
 */
const DISC_DRIFT_VH = 150;

/* Drawn from the mark and the palette the rest of the site already uses. */
const BUBBLE_COLOURS = {
  violet: ['#8A7BFF', '#5EC8FF'],
  green: ['#9CEF81', '#228F8D'],
  amber: ['#FACA15', '#FF910E'],
  magenta: ['#C24BCF', '#7B4BCF'],
  teal: ['#4DB6AC', '#2F7F8C'],
  sky: ['#83B8E0', '#5EC8FF'],
};

/*
 * The bubbles of scene two.
 *
 * Every bubble starts just below the fold and keeps going up for the whole
 * scene rather than rising to a resting place and parking: these are a flow
 * passing through the frame, and the front one is going to carry headings and
 * copy, which has to drift through the middle of the screen and leave.
 *
 * `speed` is how far it travels over the scene, in vh, and is the whole of the
 * parallax - the front bubble covering 180vh while a background one covers 300
 * over the same scroll is what separates the layers. The front layer is still
 * the slower one on purpose: it is the readable one.
 *
 * `stagger` is how far below the fold it waits, so they do not all arrive at
 * once; small values, because they should be on screen early. `size` is a
 * diameter in vmin, `left` a position in percent, `layer` 2 in front of the
 * mark and 0 behind.
 */
const BUBBLES = [
  // Front: the content carrier. Large, slow, in front of the mark. Its stagger
  // is nil, so it clears the fold at the first moment it can and rides close
  // behind the mark rather than trailing half a screen below it.
  { size: 52, left: 74, stagger: 0, speed: 180, colour: 'teal', layer: 2, opacity: 1 },
  // Back: small and quick, passing behind everything.
  { size: 16, left: 54, stagger: 0, speed: 248, colour: 'green', layer: 0, opacity: 0.68 },
  { size: 11, left: 89, stagger: 6, speed: 292, colour: 'sky', layer: 0, opacity: 0.58 },
  { size: 9, left: 16, stagger: 12, speed: 236, colour: 'violet', layer: 0, opacity: 0.52 },
  { size: 13, left: 64, stagger: 22, speed: 308, colour: 'amber', layer: 0, opacity: 0.46 },
  { size: 7, left: 36, stagger: 30, speed: 268, colour: 'magenta', layer: 0, opacity: 0.44 },
];

const clamp01 = (value) => Math.min(1, Math.max(0, value));

// Accelerating away from rest: what a thing leaving under its own power does.
const easeIn = (t) => t * t;

// Eased at both ends. The tail is the "ease out of the zoom": the disc slows
// into its resting size instead of stopping dead when the scene runs out.
const smoothstep = (t) => t * t * (3 - 2 * t);

/*
 * Where `element` sits inside `ancestor`, in layout coordinates.
 *
 * offsetLeft is measured from offsetParent, and offsetParent is not simply the
 * nearest positioned ancestor: a transformed ancestor becomes one too. The
 * lockup here carries the zoom transform, so the mark's offsetParent is the
 * lockup rather than the stage, and reading offsetLeft alone would silently
 * measure from the wrong box. Walking the chain is what makes this independent
 * of which ancestors happen to be positioned or transformed.
 *
 * These are layout values, so unlike getBoundingClientRect they are not
 * affected by the transform this component writes, which is the other half of
 * why the measurement is done this way.
 */
function offsetWithin(element, ancestor) {
  let x = 0;
  let y = 0;
  let node = element;

  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent;
  }

  return { x, y };
}

export default function ImmersiveHero({ nextSectionRef }) {
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const lockupRef = useRef(null);
  const markBoxRef = useRef(null);
  const cueRef = useRef(null);
  const readoutValueRef = useRef(null);
  const readoutSceneRef = useRef(null);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const phrase = PHRASES[phraseIndex];

  /*
   * The type / hold / delete / move-on cycle, one step per timeout, each step
   * scheduled by the render that showed the last one. Chained timeouts rather
   * than an interval because every step has its own duration, and because the
   * cleanup is then a single clearTimeout with nothing left running.
   */
  useEffect(() => {
    if (prefersReducedMotion) {
      // One phrase, typed out and left alone.
      setCharCount(PHRASES[0].length);
      return undefined;
    }

    const typing = !deleting && charCount < phrase.length;
    const finished = !deleting && charCount === phrase.length;
    const erasing = deleting && charCount > 0;

    let delay = BETWEEN_MS;
    if (typing) delay = TYPE_MS;
    else if (finished) delay = HOLD_MS;
    else if (erasing) delay = DELETE_MS;

    const timer = window.setTimeout(() => {
      if (typing) {
        setCharCount((count) => count + 1);
      } else if (finished) {
        setDeleting(true);
      } else if (erasing) {
        setCharCount((count) => count - 1);
      } else {
        setDeleting(false);
        setPhraseIndex((index) => (index + 1) % PHRASES.length);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion, phrase, charCount, deleting]);

  const applyPlayhead = useCallback((playhead) => {
    const stage = stageRef.current;
    const lockup = lockupRef.current;
    const markBox = markBoxRef.current;

    if (!stage || !lockup || !markBox) {
      return;
    }

    // --- scene 1: zoom into the disc, the other two shapes leave -------------
    const t = clamp01(playhead / ZOOM_END);

    /*
     * markBox is an HTML wrapper around the <svg> because offsetWidth and
     * offsetLeft live on HTMLElement, and an SVGElement has neither.
     */
    const markWidth = markBox.offsetWidth;
    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;

    // The disc's centre, as a pivot inside the lockup and as a point on the
    // stage: it is both what the zoom turns about and what has to land on the
    // resting mark.
    const inLockup = offsetWithin(markBox, lockup);
    const onStage = offsetWithin(markBox, stage);
    const pivotX = inLockup.x + DISC_CENTRE_X * markWidth;
    const pivotY = inLockup.y + DISC_CENTRE_Y * markBox.offsetHeight;
    const discX = onStage.x + DISC_CENTRE_X * markWidth;
    const discY = onStage.y + DISC_CENTRE_Y * markBox.offsetHeight;

    // Grow until the disc's radius is a third of the stage's height, no
    // further: the scene ends on a disc the next one can play around, not on a
    // wall of colour.
    const restRadius = Math.min(DISC_REST_RADIUS * stageHeight, DISC_REST_RADIUS_MAX * stageWidth);
    const startRadius = Math.max(1, (DISC_WIDTH * markWidth) / 2);
    const eased = smoothstep(t);
    // Geometric growth, not linear: a dolly reads as a steady approach when the
    // scale multiplies at a constant rate rather than adding at one.
    const zoom = Math.pow(Math.max(restRadius / startRadius, 1), eased);

    stage.style.setProperty('--zoom', zoom.toFixed(4));
    stage.style.setProperty('--zoom-origin-x', `${pivotX.toFixed(2)}px`);
    stage.style.setProperty('--zoom-origin-y', `${pivotY.toFixed(2)}px`);
    stage.style.setProperty('--zoom-dx', `${((stageWidth * DISC_REST_X - discX) * eased).toFixed(2)}px`);

    // The bar and the arc are gone by four fifths of the way in, so the scene
    // settles on one shape rather than three.
    const fly = easeIn(clamp01(t / 0.8));
    stage.style.setProperty('--fly', fly.toFixed(4));
    // They travel under their own steam and only fade at the very end, as
    // insurance against a shape still being on screen when the scene ends.
    stage.style.setProperty('--part-opacity', (1 - clamp01((fly - 0.85) / 0.15)).toFixed(4));

    // The word and the scroll cue step aside early, while the zoom is still
    // gentle enough that nothing is visibly stretched on the way out.
    stage.style.setProperty('--word-opacity', (1 - clamp01(t / 0.35)).toFixed(4));

    /*
     * The cue's own rules come from HomePage.module.css, which the other pages
     * share and which the bundler injects after this component's stylesheet, so
     * a class here would lose to them. Inline wins regardless of order.
     */
    if (cueRef.current) {
      const cueOpacity = 1 - clamp01(t / 0.2);
      cueRef.current.style.opacity = cueOpacity.toFixed(3);
      cueRef.current.style.pointerEvents = cueOpacity < 0.05 ? 'none' : 'auto';
    }

    // --- scene 2: the bubbles rise ------------------------------------------
    // Linear, so the bubbles keep a constant pace against the scroll and read
    // as parallax rather than as an animation that happens to be scrubbed.
    const rise = clamp01((playhead - ZOOM_END) / (SCENES[1].end - ZOOM_END));
    stage.style.setProperty('--rise', rise.toFixed(4));

    /*
     * The mark joins the flow instead of sitting still while everything else
     * moves past it. Eased rather than linear so it is stationary at the moment
     * the scene begins and gathers pace into it; the bubbles stay linear, which
     * is what keeps them reading as parallax while the mark reads as handing
     * the scene over.
     *
     * Added to the centring offset rather than replacing it: scene one's
     * placement is where scene two starts from.
     */
    const driftY = -smoothstep(rise) * DISC_DRIFT_VH * (stageHeight / 100);
    stage.style.setProperty(
      '--zoom-dy',
      `${((stageHeight * DISC_REST_Y - discY) * eased + driftY).toFixed(2)}px`,
    );

    // --- the readout ---------------------------------------------------------
    if (readoutValueRef.current) {
      readoutValueRef.current.textContent = playhead.toFixed(3);
    }

    if (readoutSceneRef.current) {
      const index = SCENES.findIndex((scene) => playhead < scene.end);
      readoutSceneRef.current.textContent =
        index === -1
          ? `scene ${SCENES.length}/${SCENES.length} · end of timeline`
          : `scene ${index + 1}/${SCENES.length} · ${SCENES[index].name}`;
    }
  }, []);

  useScrollPlayhead(sectionRef, applyPlayhead, !prefersReducedMotion);

  // Solid under a typist's hands, blinking whenever they have stopped.
  const caretResting = charCount === 0 || charCount === phrase.length;

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      // Reduced motion gets a plain one-screen hero: pinning a stage that never
      // moves would only be screens of scrolling that do nothing.
      style={{ height: prefersReducedMotion ? '100vh' : `${(TIMELINE_END + 1) * 100}vh` }}
    >
      <div ref={stageRef} className={styles.stage}>
        {!prefersReducedMotion &&
          BUBBLES.map((bubble, index) => (
            <span
              key={index}
              className={styles.bubble}
              aria-hidden="true"
              style={{
                // Far enough below the fold to hide the bubble completely at
                // rest - its own radius - plus its stagger. Mixed units on
                // purpose: the radius is in the bubble's own vmin, the wait in
                // screens of scroll.
                '--pad': `calc(${bubble.size / 2}vmin + ${bubble.stagger}vh)`,
                '--speed': `${bubble.speed}vh`,
                width: `${bubble.size}vmin`,
                height: `${bubble.size}vmin`,
                left: `${bubble.left}%`,
                opacity: bubble.opacity,
                zIndex: bubble.layer,
                backgroundImage: `linear-gradient(180deg, ${BUBBLE_COLOURS[bubble.colour][0]} 0%, ${BUBBLE_COLOURS[bubble.colour][1]} 100%)`,
              }}
            />
          ))}

        <h1 ref={lockupRef} className={styles.lockup}>
          <span ref={markBoxRef} className={styles.markBox}>
            <LogoMark
              className={styles.mark}
              discClassName={styles.markDisc}
              barClassName={styles.markBar}
              arcClassName={styles.markArc}
            />
          </span>

          {/* The club's name, read once. The phrases cycling beside it are
              decoration and are hidden from the accessibility tree. */}
          <span className={styles.srOnly}>Open Project</span>

          <span className={styles.wordmark} aria-hidden="true">
            {/*
              The box is the club's name and nothing else, so the lockup is
              centred on "Open Project" and the longer phrases simply run past
              it to the right. Sizing to the widest phrase instead would leave
              the name itself sitting off to the left of centre for most of the
              cycle. The box still comes from rendered text rather than a
              character count, which a proportional face would make a lie, and
              it is fixed, so the mark never shifts as the words change and the
              pivot the zoom turns about stays put.
            */}
            <span className={styles.wordmarkSizer}>
              {PHRASES[0]}
              <span className={styles.caret} />
            </span>

            <span className={styles.wordmarkTyped}>
              {phrase.slice(0, charCount)}
              <span className={`${styles.caret} ${caretResting ? styles.caretResting : ''}`} />
            </span>
          </span>
        </h1>

        <button
          ref={cueRef}
          type="button"
          className={homeStyles.scrollCue}
          aria-label="Scroll down"
          // The shared rule fades the cue over 0.3s, which would lag a value
          // the playhead rewrites every frame.
          style={{ transition: 'none' }}
          onClick={() => nextSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          <span className={homeStyles.scrollCueMain}>⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho1}`} aria-hidden="true">⌄</span>
          <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho2}`} aria-hidden="true">⌄</span>
        </button>

        {/*
          Scaffolding, not furniture: a readout to point at while the rest of
          the timeline is being built. Delete this block and its styles when the
          sequence is finished.
        */}
        <div className={styles.readout} aria-hidden="true">
          <span ref={readoutValueRef} className={styles.readoutValue}>0.000</span>
          <span ref={readoutSceneRef} className={styles.readoutScene}>
            {`scene 1/${SCENES.length} · ${SCENES[0].name}`}
          </span>
        </div>
      </div>
    </section>
  );
}
