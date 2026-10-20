import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from '../css/ImmersiveHero.module.css';
import homeStyles from '../css/HomePage.module.css';
import LogoMark, { DISC_CENTRE_X, DISC_CENTRE_Y, DISC_WIDTH } from './LogoMark';
import useScrollPlayhead from './useScrollPlayhead';
import LogoArc, { arcMiddle, arcPath, STROKE_WIDTH } from './LogoArc';
import ArcTicker from './ArcTicker';
import { clients } from '../data/clientsData';
import speechbubble from '../images/speechbubbles.png';
import triangle from '../images/triangle.png';

/* The phrases the wordmark types, holds, deletes and moves on from, forever. */
const PHRASES = ['Open Project', 'Fall Semester 2026', 'Experience For All.'];
const TYPE_MS = 95;
const DELETE_MS = 45;
const HOLD_MS = 1900;
const BETWEEN_MS = 350;

/*
 * How quickly the lockup slides to keep the phrase centred, as the time
 * constant of an exponential approach: it closes about two thirds of the
 * remaining distance every CENTRE_TAU ms. A little longer than a keystroke, so
 * the mark glides alongside the letters instead of stepping once per letter.
 */
const CENTRE_TAU = 110;

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
  { name: 'bubbles rise', end: 2 },
  { name: 'the arc returns', end: 4.2 },
];

const TIMELINE_END = SCENES[SCENES.length - 1].end;
const ZOOM_END = SCENES[0].end;

/*
 * The bubbles do not stop when scene two's label does - they go on rising
 * behind scene three, which is why their span is named here rather than read
 * off the scene that introduces them.
 */
const BUBBLE_RISE_END = TIMELINE_END;

/* Scene three: the arc comes back from beyond the bottom right corner, over
   half a screen of scrolling, and holds for the rest of the timeline. */
const ARC_RETURN_AT = SCENES[1].end;
const ARC_RETURN_OVER = 0.6;

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
const DISC_DRIFT_VH = 178;

/* Where each overlay blurs itself in - and, scrolling back, out again: the
   disc's as the zoom settles, the Projects block once its bubble is properly in
   frame. The mark only starts drifting once the zoom is under way. */
const DISC_REVEAL_AT = 0.46;
const PROJECTS_REVEAL_AT = 0.86;
const MARK_FLOAT_AT = 0.18;

/* Where the dark panel wipes in behind each block's lines, once the copy has
   been read against bare colour for a while and the circles start getting busy
   behind it. */
const DISC_HIGHLIGHT_AT = 0.7;
const PROJECTS_HIGHLIGHT_AT = 1.7;

/*
 * The heading on the arc, and the point from which the arc stops holding still
 * and starts travelling up with the page.
 *
 * 2.4 is the heading's only edge, in both directions: it is the one place it
 * comes and the one place it goes, scrolling down or back up. Nothing else
 * takes it off screen - which is why the dead band below is waived for this
 * flag alone and why the arc straightening no longer fades it out.
 */
const CLIENTS_AT = 2.4;
const ARC_LIFT_AT = 2.45;

/*
 * The arc no longer leaves: it rises to just under the header and parks there,
 * as the bar of clients the rest of the scene plays beneath.
 *
 * It is parked before the wipes start, so what they run across is something
 * standing still. The rest in px rather than in stages because what it is
 * clearing is the header, which is its own size whatever the window is - 66px
 * of it at the moment, and the rest of this is the little below.
 */
const ARC_LIFT_OVER = 0.35;
const ARC_REST_TOP = 88;

/*
 * Where the bowl straightens out: both ends swing outwards and the bulge drops
 * away until what is left is a level band running off either side of the
 * screen, with the heading sitting in it and the logos riding along it.
 *
 * It starts after the sheet has turned the arc dark and the logos have faded
 * up, so what flattens is the finished band rather than a shape still settling
 * into its colour.
 */
const FLATTEN_AT = 2.6;
const FLATTEN_OVER = 0.2;

/*
 * The heading leaves the band. It starts just under the band's top edge, drops
 * behind it while the band is climbing the other way, and comes out below its
 * bottom edge in the middle of the screen - where it stops, because it has let
 * go of the lift that is taking the band away.
 *
 * It only reads as passing behind the band because of where it sits in the
 * stack: .arcTitle is under .arcHolder, so the stroke covers the word for the
 * part of the journey it is crossing it.
 */
const TITLE_DROP_AT = 2.64;
const TITLE_DROP_OVER = 0.22;

/*
 * The black comes into the band. It opens out from the middle of the band as a
 * circle, under the logos and inside the band's own mask, until the whole of
 * the band is black - and the paper shadow it has been sitting on goes with it,
 * drawing in and fading out, so what is left is a flat black band rather than
 * one still pretending to be a sheet lying on the page.
 *
 * Thrown open and coasting, like the arc's own arrival: a fill that starts
 * where it says it does.
 */
const INK_AT = 2.73;
const INK_OVER = 0.12;

/*
 * Each row of logos turns over: a white box runs the length of it, the row's
 * half of the band going white behind the box and every logo in it black as it
 * passes. The rows go opposite ways and one is a little behind the other, so
 * the band reads as two things turning rather than one.
 *
 * Both are read off the playhead like everything else here, and that is the
 * point of them being so: the band is only straight because the playhead is
 * past the flatten, and a wipe running on a clock of its own could still be
 * painting its straight bars across a band that had been scrolled back into a
 * bowl. Tied to the same number, the two cannot disagree.
 */
const WIPE_SECOND_AT = 2.8;
const WIPE_TOP_AT = 2.86;
const WIPE_OVER = 0.18;

/*
 * With the second row turned over there is nothing left for the band to do.
 * The purple, the black that filled it and the white the rows were turned with
 * were all only ever how the logos got onto the page; what is worth looking at
 * now is the logos, so the rest of it goes and leaves them on the paper.
 *
 * Keyed off the wipes rather than written down, so it cannot start before they
 * have finished however they are retimed.
 */
const BAND_FADE_AT = WIPE_TOP_AT + WIPE_OVER;
/*
 * Short, because what is waiting on it is an edge rather than a shape. The
 * band and the white laid over it are clipped by the same mask, so along the
 * mask's own soft edge both are painted at part strength and the dark one
 * shows through the white as a line around the band. Nothing can cover it -
 * the cover is masked by the same edge - so the only thing that takes it away
 * is the band underneath going, and that wants to be over with.
 */
const BAND_FADE_OVER = 0.06;

/*
 * The white of the wipes goes after it, not with it.
 *
 * Together, the two fades cross: the white thins at the same rate as the black
 * behind it, and the band spends the middle of the move as a grey bar. Held
 * until the band under it has gone, the white has nothing left to reveal - and
 * it is the paper's own colour, so by then taking it away is not a change
 * anyone can see.
 */
const WIPE_FADE_AT = BAND_FADE_AT + BAND_FADE_OVER;
const WIPE_FADE_OVER = 0.06;

/*
 * And they are page, and the page is being scrolled: they leave upwards at the
 * rate the reader is going.
 *
 * This one is a mark of its own rather than the end of the chain above, and it
 * is deliberately inside it: the band is already on its way out while the
 * second row is still turning over and while the fades are running, which is
 * what keeps the end of the scene from being a list of things happening one
 * after another.
 *
 * The span is held rather than run to the end of the timeline, so moving the
 * start earlier moves the whole journey earlier instead of stretching it over
 * more scrolling and slowing it down.
 */
const ARC_EXIT_AT = 2.9;
const ARC_EXIT_OVER = 0.95;
/* How far past the top of the band to carry it before it is certainly gone. */
const ARC_EXIT_CLEAR = 48;

/*
 * And becomes the heading for what the band is carrying - on its own stretch of
 * the timeline rather than the drop's, so the word changes as the rows above it
 * turn over rather than on the way down to them. It is still settling for a
 * moment after the heading has landed, which is what keeps the landing and the
 * change from being one event.
 */
const SCRAMBLE_AT = 2.8;
const SCRAMBLE_OVER = 0.2;
const HEADING_FROM = 'Clients';
const HEADING_TO = 'Where We Work';

/*
 * The scramble.
 *
 * Each letter waits its turn, spends SCRAMBLE_HOLD of the run cycling through
 * glyphs, and lands on the one it is going to keep; the starts are spread left
 * to right, so the change runs across the word rather than happening to all of
 * it at once. Letters the old word did not have show nothing until their turn
 * comes, which is what makes the word grow into the longer one.
 *
 * The glyph is picked by arithmetic on the letter's index and how far through
 * its own cycle it is - not at random. Everything else on this timeline is a
 * function of the playhead and can be scrubbed backwards; a random glyph would
 * make this the one thing that cannot, and would churn on every frame of a
 * scroll that was not moving.
 */
const SCRAMBLE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SCRAMBLE_HOLD = 0.34;
const SCRAMBLE_TICKS = 9;

function scrambled(progress) {
  if (progress <= 0) return HEADING_FROM;
  if (progress >= 1) return HEADING_TO;

  const step = (1 - SCRAMBLE_HOLD) / Math.max(1, HEADING_TO.length - 1);
  let out = '';

  for (let index = 0; index < HEADING_TO.length; index += 1) {
    const letter = HEADING_TO[index];
    const local = (progress - index * step) / SCRAMBLE_HOLD;

    if (local >= 1) {
      out += letter;
    } else if (local <= 0) {
      // Still whatever the old word had here, and nothing at all past its end.
      out += HEADING_FROM[index] ?? '';
    } else if (letter === ' ') {
      // Spaces stay spaces: scrambling them only makes the word jitter sideways.
      out += ' ';
    } else {
      const tick = Math.floor(local * SCRAMBLE_TICKS);
      out += SCRAMBLE_GLYPHS[(index * 7 + tick * 11) % SCRAMBLE_GLYPHS.length];
    }
  }

  return out;
}

/*
 * Two rows of client logos inside the stroke, running against each other.
 *
 * A quarter of the stroke either side of the path's own line puts the rows
 * half way out to each edge, which leaves the same clearance outside them as
 * between them.
 *
 * The height stops well short of filling that clearance on purpose: ink hard
 * against the edge of the band reads as a band too small for what is in it. At
 * 28 against a row sitting 31 from the middle, the ink stops 45 out and the
 * stroke runs to 62.5, so 17 units of band stay clear outside the logos even
 * at their biggest.
 *
 * Only the height is set: each logo is as wide as its own proportions make it.
 */
const TICKER_ROW_OFFSET = STROKE_WIDTH / 4;
const TICKER_LOGO_HEIGHT = 28;

/*
 * Split by alternating rather than down the middle, so the two rows each get a
 * spread of the list instead of one taking everything up to the halfway point.
 */
const CLIENTS_OUTER = clients.filter((_, index) => index % 2 === 0);
const CLIENTS_INNER = clients.filter((_, index) => index % 2 === 1);

/*
 * The white sheet rises while the arc is still growing, and the page turns
 * light underneath it - at the top of the stage, as it reaches the header.
 *
 * The heading on the arc used to flip with it. It does not any more: it is
 * painted in the page's own black at every point in the scene, so what shows
 * of it is only ever the part lying over the arc.
 */
const SHEET_AT = ARC_RETURN_AT;
const SHEET_OVER = 0.75;
const HEADER_LIGHT_AT = 2.6;

/*
 * The header's black scrim holds at full strength until the sheet is nearly up
 * and then goes, clearing exactly as the header's own text turns over. It is
 * keyed to the playhead rather than to --sheet, because --sheet has been
 * climbing since the top of the scene and would have faded the scrim out from
 * the start.
 */
const SCRIM_FADE_AT = 2.5;
const SCRIM_FADE_OVER = HEADER_LIGHT_AT - SCRIM_FADE_AT;

/*
 * The pale backdrop that replaces it comes up on a longer, later ramp of its
 * own rather than arriving with the class that turns the text over, which put
 * the whole thing on screen in one step.
 */
const HEADER_WASH_AT = 2.55;
const HEADER_WASH_OVER = 0.32;

/*
 * Crossing a threshold, with a dead band on the way back. Without it a playhead
 * sitting exactly on the line would flip the flag every frame the scroll
 * jitters, and each flip is a React render.
 */
const crossed = (isOn, value, at, band = 0.04) => (isOn ? value >= at - band : value >= at);

/*
 * Drawn from the mark and the palette the rest of the site already uses.
 *
 * `ink` is the colour copy laid over that circle gets highlighted in: the
 * circle's own two stops averaged and taken down to about a third brightness,
 * so the marker reads as a shadow of the thing behind it rather than as a
 * fourth colour. Every one clears 12:1 against white.
 *
 * `violet` is the logo disc's own gradient, which is why the copy on the disc
 * takes its ink from here too.
 */
const BUBBLE_COLOURS = {
  violet: { from: '#8A7BFF', to: '#5EC8FF', ink: '#23314D' },
  green: { from: '#9CEF81', to: '#228F8D', ink: '#1D3929' },
  amber: { from: '#FACA15', to: '#FF910E', ink: '#4C3405' },
  magenta: { from: '#C24BCF', to: '#7B4BCF', ink: '#30173E' },
  teal: { from: '#4DB6AC', to: '#2F7F8C', ink: '#132E2F' },
  sky: { from: '#83B8E0', to: '#5EC8FF', ink: '#223743' },
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
 * parallax - the front bubble covering 212vh while a background one covers 300
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
  { size: 52, left: 74, stagger: 0, speed: 212, colour: 'teal', layer: 2, opacity: 1, content: 'projects' },
  // Back: small and quick, passing behind everything.
  { size: 16, left: 54, stagger: 0, speed: 248, colour: 'green', layer: 0, opacity: 0.68 },
  { size: 11, left: 89, stagger: 6, speed: 292, colour: 'sky', layer: 0, opacity: 0.58 },
  { size: 9, left: 16, stagger: 12, speed: 236, colour: 'violet', layer: 0, opacity: 0.52 },
  { size: 13, left: 64, stagger: 22, speed: 308, colour: 'amber', layer: 0, opacity: 0.46 },
  { size: 7, left: 36, stagger: 30, speed: 268, colour: 'magenta', layer: 0, opacity: 0.44 },
];

const clamp01 = (value) => Math.min(1, Math.max(0, value));

/*
 * The copy that rides on the two big circles. It is laid out as ordinary text,
 * aligned to one side and allowed to hang off the circle it sits on - the
 * circle is the backdrop, not a mask, so nothing here is clipped to it.
 */
function ProjectsCopy() {
  return (
    <>
      {/* Outside the copy's drift wrapper, so it keeps a motion of its own.
          Lagging the copy besides: see .bubbleImage. */}
      <span className={styles.bubbleImage} aria-hidden="true">
        <img className={styles.floatSlow} src={triangle} alt="" />
      </span>
      <div className={styles.copyGroup}>
      <h2 className={`${styles.overlayTitle} ${styles.drift3}`}>
        <span className={styles.ink}>Projects</span>
      </h2>
      <p className={`${styles.overlayBody} ${styles.drift4}`}>
        <span className={styles.ink}>
          Our club offers a dynamic array of projects, ranging from web/mobile development to data
          science. The projects undertaken each semester are <strong>student-led</strong>, with
          members empowered to propose ideas, evaluate options, and select the projects they want to
          work on. This allows for a highly personalized and fulfilling experience for all members.
        </span>
      </p>
      <p className={`${styles.overlayBody} ${styles.drift5}`}>
        <span className={styles.ink}>
          Additionally, we offer <strong>client projects</strong>, giving members the opportunity to
          work on impactful projects for organizations and gain valuable experience.
        </span>
      </p>
      </div>
    </>
  );
}

function WhatIsCopy() {
  return (
    <>
      {/* Outside the copy's drift wrapper, as above. */}
      <span className={styles.discImage} aria-hidden="true">
        <img className={styles.floatSlower} src={speechbubble} alt="" />
      </span>
      <div className={styles.copyGroup}>
      <h2 className={`${styles.overlayTitle} ${styles.drift1}`}>
        <span className={styles.ink}>What is Open Project?</span>
      </h2>
      <p className={`${styles.overlayBody} ${styles.drift2}`}>
        <span className={styles.ink}>
          We are a group of students striving to redefine tech club culture at Berkeley. Open
          Project is dedicated to creating a medium for passionate students to meet and work on
          projects that make a positive difference in the world — without the unnecessary selective
          application process.
        </span>
      </p>
      </div>
    </>
  );
}

// Accelerating away from rest: what a thing leaving under its own power does.
const easeIn = (t) => t * t;

// Eased at both ends. The tail is the "ease out of the zoom": the disc slows
// into its resting size instead of stopping dead when the scene runs out.
const smoothstep = (t) => t * t * (3 - 2 * t);

// All of the speed at the start and none at the end: a thing thrown into shot
// that coasts to a stop.
const easeOut = (t) => 1 - (1 - t) ** 3;

/*
 * Smoothstep's curve, held flatter at both ends: it leaves and arrives with no
 * acceleration either, not just no speed. For a move that begins and ends with
 * the thing sitting still in shot, where a smoothstep still reads as a nudge at
 * the moment it sets off.
 */
const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10);

/*
 * Starts from a standstill and settles into a constant rate, which is not what
 * an ease-in-out does - that would slow down again at the end, and something
 * leaving with the page should keep leaving with it.
 *
 * It is the integral of a velocity that ramps up over the first fifth and then
 * holds, normalised to arrive at 1.
 */
const SCROLL_RAMP = 0.2;
const easeIntoScroll = (t) =>
  (t <= SCROLL_RAMP ? (t * t) / (2 * SCROLL_RAMP) : t - SCROLL_RAMP / 2) / (1 - SCROLL_RAMP / 2);

/*
 * A short ease in and a long one out: away almost at once, and the rest of
 * itself spent arriving.
 *
 * The even ends of a smoothstep read as hesitation on something that is meant
 * to be travelling - a wipe should be gone before you have looked at where it
 * started, and the part worth watching is it coming to rest. This takes about
 * three quarters of the distance in the first half of the time.
 *
 * The two powers are the lengths of those eases - the first how it leaves, the
 * second how it arrives - and the distance between them is the whole of the
 * asymmetry. Both ends still start and finish at a standstill, which is what
 * keeps it from reading as a cut.
 */
const LEAD_IN = 1.6;
const LEAD_OUT = 3;
const easeLead = (t) => {
  const away = t ** LEAD_IN;

  return away / (away + (1 - t) ** LEAD_OUT);
};

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
  const arcPathRef = useRef(null);
  const arcDarkPathRef = useRef(null);
  const arcMaskPathRef = useRef(null);
  /* How far the arc has straightened, for the ticker to size its logos by.
     A ref, because it changes every frame and the ticker reads it in its own
     loop rather than being re-rendered with it. */
  const arcFlatRef = useRef(0);
  /* The black filling the band. */
  const arcInkRef = useRef(null);
  const arcHolderRef = useRef(null);
  /* How far each row's white has travelled: rects inside clip paths, whose
     leading edge is all a wipe is. */
  const topWipeRef = useRef(null);
  const secondWipeRef = useRef(null);

  /*
   * Names for the two rows, so each can be drawn a second time in black over
   * its own white. useId, because two of this component on one page would
   * otherwise both answer to the same href.
   */
  const uid = useId().replace(/:/g, '');
  const topRowId = `clients-top-${uid}`;
  const secondRowId = `clients-second-${uid}`;
  /* The heading the band carries off. */
  const arcTitleRef = useRef(null);
  const readoutValueRef = useRef(null);
  const readoutSceneRef = useRef(null);
  /* Two hidden copies of the word: the club's name, which is the box the lockup
     is laid out around, and the phrase as typed so far. The difference between
     their widths is what the lockup has to move by to stay centred. */
  const sizerRef = useRef(null);
  const liveSizerRef = useRef(null);

  /*
   * The scroll position the last frame reported, and the sideways offset that
   * keeps the typed phrase centred on the stage.
   *
   * Both are read by render(), which the scroll and the centring loop call
   * alike: either can change while the other is still, and whichever ran last
   * leaves the lockup agreeing with both.
   */
  const playheadRef = useRef(0);
  const centreRef = useRef({ value: 0, target: 0, frame: null, last: 0, first: true });

  /*
   * Each overlay crosses into view at the point in the timeline where it
   * belongs and crosses back out on the way up, as a transition of its own
   * rather than an opacity scrubbed off the playhead - so it always takes the
   * same time to arrive however fast the page is being scrolled.
   *
   * The ref is what applyPlayhead tests, so the thresholds are checked every
   * frame while the state is only set when one is actually crossed.
   */
  const initialFlags = {
    disc: false,
    projects: false,
    markFloat: false,
    discHighlight: false,
    projectsHighlight: false,
    clients: false,
    headerLight: false,
  };
  const revealedRef = useRef(initialFlags);
  const [revealed, setRevealed] = useState(initialFlags);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  /*
   * Set the moment the page is scrolled at all, cleared when it is back at the
   * top. While it is set the lockup stops following the phrase's width: the
   * mark holds still and the letters run off to the right from it, which is
   * what leaves the zoom turning about a disc that is not moving.
   *
   * Kept as state as well as a ref because the ref is what the scroll frame
   * tests and the state is what re-aims the offset when it flips.
   */
  const [anchored, setAnchored] = useState(false);
  const anchoredRef = useRef(false);

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

  /*
   * Writes the whole stage from the two inputs it keeps in refs: the playhead
   * and the centring offset. Called from the scroll, and from the centring loop
   * while the page is still - the phrase can grow a letter without the page
   * having moved, and the lockup's transform carries both.
   */
  const render = useCallback(() => {
    const playhead = playheadRef.current;
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
    /*
     * The disc's paper shadow arrives with the zoom. At the mark's resting size
     * the offset duplicate is a couple of pixels of dark fringe that just makes
     * the logo look badly printed; it only reads as a second sheet once the
     * disc is big, so that is when it is there.
     */
    stage.style.setProperty('--disc-shadow-opacity', smoothstep(clamp01(t / 0.85)).toFixed(3));

    /*
     * The first touch of scroll anchors the lockup. Hysteresis, so a scroll
     * resting on the threshold - or the rubber band at the top of the page -
     * cannot flip it back and forth and set the mark swinging every frame.
     */
    const shouldAnchor = playhead > (anchoredRef.current ? 0.002 : 0.012);

    if (shouldAnchor !== anchoredRef.current) {
      anchoredRef.current = shouldAnchor;
      setAnchored(shouldAnchor);
    }

    const flags = revealedRef.current;
    const next = {
      disc: crossed(flags.disc, playhead, DISC_REVEAL_AT),
      projects: crossed(flags.projects, playhead, PROJECTS_REVEAL_AT),
      markFloat: crossed(flags.markFloat, playhead, MARK_FLOAT_AT),
      discHighlight: crossed(flags.discHighlight, playhead, DISC_HIGHLIGHT_AT),
      projectsHighlight: crossed(flags.projectsHighlight, playhead, PROJECTS_HIGHLIGHT_AT),
      /* Deliberately bandless: the heading's edge is 2.4 on the way up as
         well as on the way down, so the two cannot be a dead band apart. */
      clients: crossed(flags.clients, playhead, CLIENTS_AT, 0),
      headerLight: crossed(flags.headerLight, playhead, HEADER_LIGHT_AT),
    };

    if (Object.keys(next).some((key) => next[key] !== flags[key])) {
      revealedRef.current = next;
      setRevealed(next);
    }
    stage.style.setProperty('--zoom-origin-x', `${pivotX.toFixed(2)}px`);
    stage.style.setProperty('--zoom-origin-y', `${pivotY.toFixed(2)}px`);
    /*
     * Horizontally the lockup is between two places: where it is now, pushed
     * sideways so the phrase on screen reads centred, and where scene one wants
     * the disc, a quarter of the way across. They are blended with the same
     * eased value the zoom uses, so the lockup leaves from the position it is
     * actually in rather than cutting to the one the layout alone would give it.
     *
     * Two things take the offset to nil over the opening of the scene - this
     * blend, and the name being typed back - and either would do it on its own,
     * which is what makes the handover impossible to catch out.
     */
    const settleX = stageWidth * DISC_REST_X - discX;
    stage.style.setProperty(
      '--zoom-dx',
      `${(centreRef.current.value * (1 - eased) + settleX * eased).toFixed(2)}px`,
    );

    // The bar and the arc are gone by four fifths of the way in, so the scene
    // settles on one shape rather than three.
    const fly = easeIn(clamp01(t / 0.8));
    stage.style.setProperty('--fly', fly.toFixed(4));
    // They travel under their own steam and only fade at the very end, as
    // insurance against a shape still being on screen when the scene ends.
    stage.style.setProperty('--part-opacity', (1 - clamp01((fly - 0.85) / 0.15)).toFixed(4));

    // The word and the scroll cue step aside early, while the zoom is still
    // gentle enough that nothing is visibly stretched on the way out.
    stage.style.setProperty('--word-opacity', (1 - clamp01(t / 0.6)).toFixed(4));

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
    const rise = clamp01((playhead - ZOOM_END) / (BUBBLE_RISE_END - ZOOM_END));
    stage.style.setProperty('--rise', rise.toFixed(4));

    // --- scene 3: the arc comes back ----------------------------------------
    /*
     * Eased here rather than in the stylesheet, because both the travel and the
     * spin are written off this one value and they have to decelerate together
     * - the arc has to look like one object coasting to a stop, not a position
     * and a rotation that happen to finish at the same moment.
     *
     * Front-loading the movement is also what gets it into shot early: most of
     * the distance is covered in the first third of the scene.
     */
    const arcRaw = clamp01((playhead - ARC_RETURN_AT) / ARC_RETURN_OVER);
    const arc = easeOut(arcRaw);
    stage.style.setProperty('--arc', arc.toFixed(4));
    /*
     * The growth runs on its own, gentler curve. On the eased value it would be
     * near full size almost at once, since that curve spends most of itself in
     * the first third; on a smoothstep the arc stays small while it travels and
     * opens out at the end, which is what makes it read as approaching rather
     * than as being dropped in place.
     */
    const grow = smoothstep(arcRaw);

    stage.style.setProperty('--arc-grow', grow.toFixed(4));

    /*
     * The arc rises to its place under the header and stops.
     *
     * Worked out rather than set: where the band's top edge would sit with no
     * rise at all, less where it is wanted, is how far it has to go - which
     * depends on how big the arc has been drawn and how tall the stage is, and
     * is therefore not a number that can be written down. The heading takes the
     * same travel, so the two keep their spacing until the drop takes it off.
     *
     * Eased to a stop at both ends: it is arriving somewhere now, not setting
     * off up the page.
     */
    const arcScale = 0.25 + grow * 0.75;
    const holderWidth = arcHolderRef.current?.offsetWidth ?? 0;
    // The arc's box is 453.6 of its own units across, however wide it is drawn.
    const unit = (holderWidth * arcScale) / 453.6;
    const bandTop =
      stageHeight / 2 - 0.1572 * holderWidth * arcScale - (STROKE_WIDTH / 2) * unit;
    /*
     * Two journeys on one value, one after the other: up to the resting place
     * under the header, and then - once there is nothing left of the band but
     * the logos - on up and out of the top of the screen.
     *
     * The second is measured from where the band is parked rather than from
     * where it started, so the two add rather than one undoing the other, and
     * it carries the band's whole depth plus a little, which is what makes it
     * gone rather than nearly gone.
     */
    // Not `rise`: scene two has one of those, and it is the bubbles'.
    const arcPark =
      smootherstep(clamp01((playhead - ARC_LIFT_AT) / ARC_LIFT_OVER)) *
      Math.max(0, bandTop - ARC_REST_TOP);
    const arcExit =
      easeIntoScroll(clamp01((playhead - ARC_EXIT_AT) / ARC_EXIT_OVER)) *
      (ARC_REST_TOP + STROKE_WIDTH * unit + ARC_EXIT_CLEAR);

    stage.style.setProperty('--arc-rise', `${(-(arcPark + arcExit)).toFixed(2)}px`);

    /*
     * The arc unbends. Written straight onto both paths rather than through a
     * custom property, because what changes is the geometry itself and not a
     * transform of it - which is also what carries the ticker, since it reads
     * its route off this same path every frame.
     */
    const flat = smoothstep(clamp01((playhead - FLATTEN_AT) / FLATTEN_OVER));
    const shape = arcPath(flat);

    arcFlatRef.current = flat;

    /* The heading is not inside the SVG, so it cannot follow the geometry on
       its own and has to be told how far the bowl has opened out. */
    stage.style.setProperty('--flat', flat.toFixed(4));

    /*
     * The heading drops out from under the band. One value carries the whole of
     * it: the sideways offset that had it centred on the arc's circle rather
     * than on the screen, the height it was riding at inside the band, and the
     * lift it was taking from the arc are all multiplied out by it, so at 1 the
     * heading is simply in the middle of the stage and staying there while the
     * band goes on up without it.
     *
     * Eased hard at both ends. It leaves the band gently and arrives gently,
     * which is what makes the landing read as a stop rather than as a value
     * running out of range.
     */
    stage.style.setProperty(
      '--title-drop',
      smootherstep(clamp01((playhead - TITLE_DROP_AT) / TITLE_DROP_OVER)).toFixed(4),
    );

    /*
     * And the word it lands as. Written straight to the node, like everything
     * else on this timeline: it changes on most frames of the scramble, and a
     * string through React state would put a reconciliation between the scroll
     * and the paint.
     */
    const title = arcTitleRef.current;
    /*
     * Straight off the scroll, with no easing on it: the letters turn at a
     * steady rate across the whole of their stretch rather than bunching in the
     * middle of it.
     */
    const word = scrambled(clamp01((playhead - SCRAMBLE_AT) / SCRAMBLE_OVER));

    /*
     * Against the node rather than against a remembered string: React owns this
     * element too, and if it ever wrote its own "Clients" back over the word, a
     * remembered one would agree with itself and leave it there.
     */
    if (title && title.textContent !== word) {
      title.textContent = word;
    }

    /*
     * Against the paths themselves rather than against a remembered string.
     * React owns these elements: rebuild the tree around them - which is all it
     * takes to get new nodes carrying the d they were written with - and a
     * remembered shape agrees with itself while the arc on screen is still the
     * semicircle it was born as. Reading the attribute cannot be wrong, and it
     * still saves the write, which is the point: rewriting d invalidates the
     * path's cached length, and the ticker asks for that on every frame.
     */
    [arcPathRef, arcDarkPathRef, arcMaskPathRef].forEach((ref) => {
      if (ref.current && ref.current.getAttribute('d') !== shape) {
        ref.current.setAttribute('d', shape);
      }
    });

    /*
     * The black filling the band, and the paper shadow going with it.
     *
     * Both the centre and the radius are the arc's, read off the same flat
     * value the shape itself is drawn from: the middle of the band rides up as
     * the bulge drops away, and the reach is to the far end of the stroke, so
     * at 1 the circle covers the band exactly and at no point is it covering
     * anything else. The mask around it in LogoArc is what keeps it off the
     * page; this is only what decides how much of the band it has reached.
     */
    const ink = easeOut(clamp01((playhead - INK_AT) / INK_OVER));
    const middle = arcMiddle(flat);

    stage.style.setProperty('--ink', ink.toFixed(4));

    if (arcInkRef.current) {
      arcInkRef.current.setAttribute('cx', middle.x.toFixed(2));
      arcInkRef.current.setAttribute('cy', middle.y.toFixed(2));
      arcInkRef.current.setAttribute('r', (ink * middle.reach).toFixed(2));
    }

    /*
     * The white running along each row.
     *
     * The rect lives in the band's own frame, where x runs along the band and
     * nil is the middle of it, so a wipe is a leading edge travelling from one
     * end of the reach to the other. `from` is which end it sets off from: that
     * frame's x points to the left of the screen, so 1 is a box coming in from
     * the left and -1 one coming in from the right.
     */
    const wipe = (rect, progress, from) => {
      if (!rect) {
        return;
      }

      const span = 2 * middle.reach * easeLead(progress);

      rect.setAttribute('x', (from > 0 ? middle.reach - span : -middle.reach).toFixed(2));
      rect.setAttribute('width', span.toFixed(2));
    };

    wipe(secondWipeRef.current, clamp01((playhead - WIPE_SECOND_AT) / WIPE_OVER), 1);
    wipe(topWipeRef.current, clamp01((playhead - WIPE_TOP_AT) / WIPE_OVER), -1);

    /*
     * And then everything that was holding the logos goes. One value for the
     * band, the ink and the rows' white originals, which are grouped together
     * in the SVG for exactly this, and for the white of the wipes - which is
     * not in that group, because the black logos drawn over it must not fade
     * with it.
     */
    stage.style.setProperty(
      '--band-fade',
      smoothstep(clamp01((playhead - BAND_FADE_AT) / BAND_FADE_OVER)).toFixed(4),
    );
    stage.style.setProperty(
      '--wipe-fade',
      smoothstep(clamp01((playhead - WIPE_FADE_AT) / WIPE_FADE_OVER)).toFixed(4),
    );

    /*
     * The sheet that turns the page light. Everything that has to change with
     * it - how far it has risen, how dark the arc has gone, how far the client
     * logos have faded up - reads this one number, so they cannot drift apart.
     */
    stage.style.setProperty(
      '--sheet',
      smoothstep(clamp01((playhead - SHEET_AT) / SHEET_OVER)).toFixed(4),
    );

    /* The header is outside this section, so what it needs goes on the root. */
    const root = document.documentElement;
    root.style.setProperty(
      '--header-scrim',
      (1 - clamp01((playhead - SCRIM_FADE_AT) / SCRIM_FADE_OVER)).toFixed(4),
    );
    root.style.setProperty(
      '--header-wash',
      smoothstep(clamp01((playhead - HEADER_WASH_AT) / HEADER_WASH_OVER)).toFixed(4),
    );

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

    /*
     * The copy on the disc travels with it but is not part of it: it takes the
     * drift and none of the zoom, because a block of body text scaled five
     * times over would be unreadable long before it was legible.
     */
    stage.style.setProperty('--disc-drift', `${driftY.toFixed(2)}px`);


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

  const applyPlayhead = useCallback(
    (playhead) => {
      playheadRef.current = playhead;
      render();
    },
    [render],
  );

  /*
   * Eases the centring offset towards whatever the latest measurement asked
   * for, a frame at a time, and stops the loop the moment it arrives. Time
   * based rather than a fixed share per frame, so the slide takes the same
   * length of time on a 120Hz screen as on a 60Hz one.
   */
  const settleCentre = useCallback(() => {
    const centre = centreRef.current;
    const now = performance.now();
    // A tab coming back from the background hands over an enormous gap; capped,
    // so that frame is a step rather than a jump to the target.
    const elapsed = Math.min(64, now - centre.last);

    centre.last = now;
    centre.value += (centre.target - centre.value) * (1 - Math.exp(-elapsed / CENTRE_TAU));

    // Under a third of a pixel is not a move anyone can see; snapping is what
    // lets the loop end instead of chasing the last fraction forever.
    if (Math.abs(centre.target - centre.value) < 0.3) {
      centre.value = centre.target;
    }

    render();
    centre.frame = centre.value === centre.target ? null : window.requestAnimationFrame(settleCentre);
  }, [render]);

  /*
   * Where the lockup should sit. Two answers, and which one applies is the
   * whole of the handover into scene one.
   *
   * At the top of the page: half the difference between the phrase on screen
   * and the club's name, the other way, which puts the group - mark, gap and
   * letters - on the middle of the stage however long the phrase is. Clamped,
   * so a long phrase stops pushing once the mark reaches the stage's left
   * edge: past that the phrase is wider than the screen anyway, and a centred
   * group would only mean a mark half off it.
   *
   * Once the page has been scrolled: whatever offset the lockup already has,
   * held. The typing carries on through the zoom and the mark ignores it - the
   * letters run off to the right from a mark that is not moving, which is the
   * word going left aligned, and the disc the zoom turns about holds still.
   *
   * Held rather than taken back to nil, because the scene is already taking it
   * to nil: --zoom-dx fades the offset out against the zoom's own easing, so by
   * the time the disc is in its resting place nothing of it is left. Nothing
   * moves at the moment of the switch, which is what makes it impossible to
   * see - there is only the zoom, which has started anyway.
   *
   * `snap` takes the offset there outright instead of sliding to it. Sliding is
   * for the letters arriving, and only for them: the first measurement, a
   * resize and the title face landing are all moments where there is no
   * movement to follow, and a lockup gliding into place on load would read as a
   * stray animation. The listeners below pass their event object, which is
   * truthy, and so snap by the same rule.
   */
  const measureCentre = useCallback((snap) => {
    const centre = centreRef.current;

    if (anchoredRef.current) {
      // Stops the glide wherever it has got to, and nothing measures the words
      // again until the page is back at the top. Before the measuring, so a
      // keystroke during the zoom costs no layout either.
      centre.target = centre.value;

      return;
    }

    const sizer = sizerRef.current;
    const liveSizer = liveSizerRef.current;
    const stage = stageRef.current;
    const lockup = lockupRef.current;

    if (!sizer || !liveSizer || !stage || !lockup) {
      return;
    }

    const shift = -(liveSizer.offsetWidth - sizer.offsetWidth) / 2;
    const target = Math.max(shift, -offsetWithin(lockup, stage).x);

    if (snap || centre.first) {
      centre.first = false;
      centre.target = target;
      centre.value = target;

      if (centre.frame !== null) {
        window.cancelAnimationFrame(centre.frame);
        centre.frame = null;
      }

      render();

      return;
    }

    if (Math.abs(target - centre.target) < 0.01) {
      return;
    }

    centre.target = target;

    if (centre.frame === null) {
      centre.last = performance.now();
      centre.frame = window.requestAnimationFrame(settleCentre);
    }
  }, [render, settleCentre]);

  // After the render that showed the new letter, so the hidden copy being
  // measured is the one on screen.
  useLayoutEffect(measureCentre, [measureCentre, phrase, charCount]);

  /*
   * Scrolling started, or the page came back to the top. Either way the answer
   * above has changed without a letter having been typed: the first freezes the
   * offset where it stands, the second sets it gliding back to centred on
   * whatever the phrase has become in the meantime.
   */
  useEffect(() => {
    measureCentre();
  }, [anchored, measureCentre]);

  useEffect(() => {
    // The one object the ref ever holds, so the cleanup cancelling a frame
    // through it is cancelling this loop's frame whenever it runs.
    const centre = centreRef.current;

    // The title face is likely to land after first paint, and every width here
    // changes with it.
    document.fonts?.ready.then(measureCentre);
    window.addEventListener('resize', measureCentre);

    return () => {
      window.removeEventListener('resize', measureCentre);

      if (centre.frame !== null) {
        window.cancelAnimationFrame(centre.frame);
        centre.frame = null;
      }
    };
  }, [measureCentre]);

  useScrollPlayhead(sectionRef, applyPlayhead, !prefersReducedMotion);

  // Solid under a typist's hands, blinking whenever they have stopped.
  /*
   * The header is a sibling of this whole section, so the only way to tell it
   * the page has turned light is a class on the root. Taken off again on the
   * way back up and on unmount, or another route would inherit a light header.
   */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('op-light', revealed.headerLight);

    return () => root.classList.remove('op-light');
  }, [revealed.headerLight]);

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
        {/* The light world, rising. Everything dark is behind it; everything
            that survives into the light is in front. */}
        {!prefersReducedMotion && <div className={styles.sheet} aria-hidden="true" />}

        {!prefersReducedMotion &&
          BUBBLES.map((bubble, index) => (
            <span
              key={index}
              className={styles.bubble}
              // Only the empty ones are decoration. The bubble carrying copy
              // has to stay in the accessibility tree, or the copy goes with
              // it.
              aria-hidden={bubble.content ? undefined : 'true'}
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
                zIndex: bubble.layer,
              }}
            >
              <span
                className={`${styles.bubbleCircle} ${bubble.layer === 2 ? styles.bubbleFront : ''}`}
                aria-hidden="true"
                style={{
                  opacity: bubble.opacity,
                  '--bubble-gradient': `linear-gradient(180deg, ${BUBBLE_COLOURS[bubble.colour].from} 0%, ${BUBBLE_COLOURS[bubble.colour].to} 100%)`,
                }}
              />
              {bubble.content === 'projects' && (
                <div
                  className={`${styles.overlayCopy} ${styles.overlayRight} ${
                    revealed.projects ? styles.revealed : ''
                  } ${revealed.projectsHighlight ? styles.highlighted : ''}`}
                  style={{ '--ink-colour': BUBBLE_COLOURS[bubble.colour].ink }}
                >
                  <ProjectsCopy />
                </div>
              )}
            </span>
          ))}

        {/*
          Scene three. The holder carries the journey in from the right and the
          shadow; the arc inside it carries the spin. Two elements because the
          shadow has to fall straight down the screen whatever angle the arc is
          at, and a filter on a rotating element rotates with it - on the holder
          it sees the arc already turned and drops its silhouette downward.
        */}
        {!prefersReducedMotion && (
          <span ref={arcHolderRef} className={styles.arcHolder} aria-hidden="true">
            <LogoArc
              className={styles.arcSpin}
              pathRef={arcPathRef}
              darkPathRef={arcDarkPathRef}
              maskPathRef={arcMaskPathRef}
              inkRef={arcInkRef}
              darkClassName={styles.arcDark}
              inkClassName={styles.arcInk}
              fadeClassName={styles.bandFade}
              wipeClassName={styles.rowWipe}
              wipeLogoClassName={styles.rowWipeLogos}
              wipes={[
                { id: secondRowId, rectRef: secondWipeRef, half: -1 },
                { id: topRowId, rectRef: topWipeRef, half: 1 },
              ]}
            >
              <ArcTicker
                id={topRowId}
                className={styles.tickerFade}
                pathRef={arcPathRef}
                items={CLIENTS_OUTER}
                running={revealed.clients}
                rowOffset={-TICKER_ROW_OFFSET}
                direction={1}
                height={TICKER_LOGO_HEIGHT}
                growRef={arcFlatRef}
                overhang={STROKE_WIDTH / 2}
              />
              <ArcTicker
                id={secondRowId}
                className={styles.tickerFade}
                pathRef={arcPathRef}
                items={CLIENTS_INNER}
                running={revealed.clients}
                rowOffset={TICKER_ROW_OFFSET}
                direction={-1}
                height={TICKER_LOGO_HEIGHT}
                growRef={arcFlatRef}
                overhang={STROKE_WIDTH / 2}
              />
            </LogoArc>
          </span>
        )}

        {/* Outside the arc's holder, which is being scaled: a heading inside it
            would be scaled with it. Under it in the stack, though, so the band
            covers the word as it drops past. */}
        {!prefersReducedMotion && (
          <h2
            ref={arcTitleRef}
            className={`${styles.overlayTitle} ${styles.arcTitle} ${
              revealed.clients ? styles.revealed : ''
            }`}
          >
            {HEADING_FROM}
          </h2>
        )}

        {/* The disc's copy is not inside the lockup: it has to take the drift
            without taking the zoom. */}
        {!prefersReducedMotion && (
          <div
            className={`${styles.discCopy} ${styles.overlayLeft} ${
              revealed.disc ? styles.revealed : ''
            } ${revealed.discHighlight ? styles.highlighted : ''}`}
            style={{ '--ink-colour': BUBBLE_COLOURS.violet.ink }}
          >
            <WhatIsCopy />
          </div>
        )}

        <h1 ref={lockupRef} className={styles.lockup}>
          <span ref={markBoxRef} className={styles.markBox}>
            <LogoMark
              className={`${styles.mark} ${revealed.markFloat ? styles.markFloating : ''}`}
              discClassName={styles.markDisc}
              shadowClassName={styles.markShadow}
              barClassName={styles.markBar}
              arcClassName={styles.markArc}
            />
          </span>

          {/* The club's name, read once. The phrases cycling beside it are
              decoration and are hidden from the accessibility tree. */}
          <span className={styles.srOnly}>Open Project</span>

          <span className={styles.wordmark} aria-hidden="true">
            {/*
              The box is the club's name and nothing else, so the layout never
              moves as the words change and the pivot the zoom turns about stays
              put. Centring the phrase is left to a transform on the lockup,
              measured off the hidden copy below - the one thing that must not
              depend on the phrase is the geometry scene one is measured from.

              Both boxes come from rendered text rather than a character count,
              which a proportional face would make a lie.
            */}
            <span ref={sizerRef} className={styles.wordmarkSizer}>
              {PHRASES[0]}
              <span className={styles.caret} />
            </span>

            {/*
              The same letters again, out of flow and hidden, purely to be
              measured: the lockup is moved sideways by half of however much
              wider this is than the box above, which is what keeps the phrase
              centred on the stage while the box - and so the zoom's pivot -
              stays where the club's name put it.
            */}
            <span ref={liveSizerRef} className={styles.wordmarkLive} aria-hidden="true">
              {phrase.slice(0, charCount)}
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
