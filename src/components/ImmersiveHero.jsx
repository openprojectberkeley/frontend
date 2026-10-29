import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from '../css/ImmersiveHero.module.css';
import homeStyles from '../css/HomePage.module.css';
import LogoMark, { DISC_CENTRE_X, DISC_CENTRE_Y, DISC_WIDTH } from './LogoMark';
import useScrollPlayhead from './useScrollPlayhead';
import LogoArc, { arcMiddle, arcOutline, arcPath, STROKE_WIDTH } from './LogoArc';
import ArcTicker from './ArcTicker';
import LogoSpill from './LogoSpill';
import MomentStrip from './MomentStrip';
import useTitlePixels from './useTitlePixels';
import JoinScene from './JoinScene';
import StarField, { ABOUT_STARS_REACH, STAR_LAYERS, scatter } from './StarField';
import scramble from './scramble';
import { clients } from '../data/clientsData';
import { whereWeWork, whereWeWorkRound, whereWeWorkScale } from '../data/whereWeWork';
import speechbubble from '../images/speechbubbles.png';
import star from '../images/star.png';
import triangle from '../images/triangle.png';
import pixelMark from '../images/logo-pixel.svg';

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
 * How long the scroll cue takes to carry the page the one screen to playhead
 * 1.00. Long enough that the zoom reads as a move through the scene rather
 * than a cut to the end of it.
 */
const CUE_SCROLL_MS = 1250;

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
  /* The arc is still on its way out when the next scene starts - the two
     overlap by design - so this is where the community takes over the frame
     rather than where the arc has finished leaving it. */
  { name: 'the arc returns', end: 3.2 },
  /* The panel is still settling when the frame starts travelling, which is the
     same overlap as above: scene five opens on scene four finishing. */
  { name: 'the community rises', end: 3.4 },
  /* And the frame is still coasting to a stop as the about sheet comes up:
     scene six opens on scene five finishing, like every scene before it. The
     pan would halt at 7, after the timeline has ended, but the moments have
     gone from the stage by then. */
  { name: 'the moments pass', end: 6.4 },
  /* Ends the moment the call to apply comes to rest in the middle, so the
     very next scroll lets go of it and brings the footer up - there is
     nothing after it to wait for. See JOIN_AT. */
  { name: 'join us comes up', end: 6.8 },
];

const TIMELINE_END = SCENES[SCENES.length - 1].end;
const ZOOM_END = SCENES[0].end;

/*
 * The bubbles do not stop when scene two's label does - they go on rising
 * behind scene three, which is why their span is named here rather than read
 * off the scene that introduces them.
 *
 * A number and not the end of the timeline: they are long gone behind the
 * white by scene four, and tying them to it would have meant a new scene
 * quietly slowing down an old one.
 */
const BUBBLE_RISE_END = 4.2;

/*
 * Where the stars come up.
 *
 * Over the opening of the scene rather than at the first frame of it. The
 * bubbles get a gate instead - a fade a fiftieth of the scene long, which is
 * only there to stop their float lifting a cap of colour over the fold before
 * the scene has started - because a bubble should look like it has risen into
 * shot. The stars have not risen from anywhere by the time they are seen, so
 * they fade in on their own account.
 */
const STARS_AT = ZOOM_END;
const STARS_OVER = 0.45;

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

/*
 * Where the call to action gives up its place. Almost at nil: the first touch
 * of scroll is a statement that you are going somewhere, and the button has
 * said its piece by then. It does not fade across a range - crossing this sets
 * a class and the stylesheet takes it from there - so this is the one moment
 * it goes, not the start of a wipe.
 */
const CTA_HIDE_AT = 0.03;

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
 * Short, because what is waiting on it is the stroke going, and the white is
 * already lying over it. The white runs past the stroke, so there is no dark
 * edge left to hide; the fade only has to be long enough to be gone.
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

/*
 * Scene four. The banner and its heading go up with the arc rather than after
 * it, and what comes up from the bottom to replace them is the club's third
 * value - the one the whole of this scene has been building towards.
 *
 * The two overlap on purpose: the banner is still clearing the top of the
 * screen as the panel clears the bottom of it, so the eye is handed from one
 * to the other instead of waiting in an empty frame.
 *
 * The pile stays where it is. It is on the floor, and the floor is the bottom
 * of the screen: the panel coming up is a wall moving through that space, so
 * it arrives underneath the logos and pushes them up the page in front of it.
 * That is the point of it having a body at all.
 */
const COMMUNITY_AT = 3.18;
const COMMUNITY_OVER = 0.55;
/*
 * Thrown up and settling, rather than eased evenly at both ends. A smoothstep
 * spends its opening going nowhere, which on a panel that is meant to be
 * arriving is just a wait - and the whole point of where it starts is that
 * the first of the move is already on screen.
 */
const COMMUNITY_LEAD_IN = 1.3;
const COMMUNITY_LEAD_OUT = 4.5;
/*
 * The banner goes at the same moment, so it is travelling up with the band
 * and its logos rather than waiting for them to be gone - three things
 * leaving by one door instead of a queue at it.
 */
const BANNER_EXIT_AT = 3.2;
const BANNER_EXIT_OVER = 0.55;

/*
 * And then the bar itself leaves the way it arrived: off to the right, rigid,
 * on the same curve - the entrance run backwards rather than a fade. The word
 * hands its colour back and blurs away as it goes, which is the same blur it
 * arrived out of at 2.4.
 */
const BANNER_OUT_AT = 3.4;
const BANNER_OUT_OVER = 0.13;
/*
 * The word goes as the bar does, so the blur is something you see happen on
 * the black rather than something you find has happened once the black has
 * left.
 *
 * And it keeps its cream to the end. Turning it back to the page's black as
 * the bar slid out meant a moment of black text on white paper, announcing
 * itself on the way out; left cream, the bar slides from under it and the
 * word is simply paper on paper - gone before the fade has finished the job.
 */
const TITLE_GONE_AT = 3.4;

/*
 * Scene five: the frame starts travelling.
 *
 * The panel and the pile it has just carried up the page stop being the thing
 * on screen and become the thing being left behind - everything already in
 * shot slides off to the left while scattered moments come past from the
 * right. The scroll stays vertical; what it drives is sideways.
 *
 * It opens while the panel is still settling, which is the same overlap the
 * rest of the timeline is built on: the pan is already under way by the time
 * the thing being panned has finished arriving.
 *
 * Linear, with no easing anywhere on it. Everything else here is a move with
 * a beginning and an end and is eased accordingly; this is the reader's own
 * scrolling turned on its side, and a scroller that accelerates out from
 * under the hand feels broken rather than smooth.
 */
const PAN_AT = 3.4;
const PAN_OVER = 3.6;
/*
 * How far the frame travels over that, in screens.
 *
 * The tuning knob for the whole scene: it is what decides how much of the
 * strip is seen and how fast it goes past, and the moments are placed in the
 * same units - see communityMoments.js - so the two can be read against each
 * other. It is the whole distance, coast included, so the pan comes to rest
 * at playhead 7 with every card exactly where communityMoments.js says.
 */
const PAN_TRAVEL = 4.46;
/*
 * And it coasts to a halt at the end of its span rather than being let go of.
 *
 * Linear up to PAN_SETTLE short of the end, then the speed it had is shed
 * evenly, so it is nil exactly at PAN_AT + PAN_OVER. The coast covers half
 * what the same stretch would have at full speed, so the rate is set to make
 * the whole thing still come to PAN_TRAVEL; and the velocity is continuous
 * where the run hands over, so nothing jumps.
 */
const PAN_SETTLE = 1;

function panScreens(playhead) {
  const rate = PAN_TRAVEL / (PAN_OVER - PAN_SETTLE / 2);
  const runOver = PAN_OVER - PAN_SETTLE;
  const run = clamp01((playhead - PAN_AT) / runOver) * runOver * rate;
  const coast = Math.min(Math.max(playhead - PAN_AT - runOver, 0), PAN_SETTLE);

  return run + rate * (coast - (coast * coast) / (2 * PAN_SETTLE));
}

/*
 * Scene six: the call to apply comes up from the bottom, while the
 * moments are still coasting to their halt.
 *
 * Two things, moving at different rates. The copy is not in the stage: it is
 * the next thing on the page, pulled up by ABOUT_OVERLAP screens so it starts
 * arriving while the stage is still pinned, moved by the scroll itself at the
 * reader's rate, and as tall as it needs to be. The black it reads on is in
 * the stage, behind the moments, and wipes up ahead of the copy - over
 * ABOUT_WIPE_OVER of a screen, eased out, so it leads from the first frame and
 * the copy is never white on paper.
 */
const ABOUT_AT = SCENES[SCENES.length - 2].end;
/*
 * The copy and its black lead the rest of the scene in by this much, in
 * screens, so the heading is already in shot at ABOUT_AT rather than still
 * below the fold. Both together, because the copy is cream with no ground of
 * its own and the wipe has to be ahead of it. The moments' rise and break-up
 * stay on ABOUT_AT.
 */
const ABOUT_COPY_LEAD = 0.12;
const ABOUT_COPY_AT = ABOUT_AT - ABOUT_COPY_LEAD;
const ABOUT_OVERLAP = TIMELINE_END - ABOUT_COPY_AT;
const ABOUT_WIPE_OVER = 0.5;
/*
 * The call to apply rides the stage rather than the page, so it can outrun
 * the scroll: it sets off from JOIN_RISE_FROM of a screen below the middle a
 * beat after the black, comes up at several times the scroll's rate and
 * eases out over JOIN_RISE_OVER to rest in the middle of the screen exactly
 * as the timeline ends - so it is the last thing the stage does before it
 * lets go. The black is quicker still to start with, so the words never come
 * up over paper.
 */
const JOIN_AT = ABOUT_COPY_AT + 0.06;
const JOIN_RISE_OVER = TIMELINE_END - JOIN_AT;
const JOIN_RISE_FROM = 0.75;
/*
 * And the moments rise with it: slower than the copy at first, so they read
 * as farther back as the words come up past them, then gathering pace over
 * MOMENTS_LIFT_RAMP until they are outrunning the scroll - MOMENTS_LIFT_TO
 * times its rate - and clear out of the copy's way rather than being left
 * behind under it. The speed climbs evenly, so there is no step in it.
 * Held at the end of the timeline, where the stage lets go and the scroll
 * takes everything at the one rate anyway.
 */
const MOMENTS_LIFT_FROM = 0.45;
const MOMENTS_LIFT_TO = 1.6;
const MOMENTS_LIFT_RAMP = 0.6;
/*
 * And break up as they go: each card falls apart into blocks from its bottom
 * edge up, the lowest cards first - see MomentStrip. Starts a tenth of a
 * screen before the copy does, while the frame is still coasting, so the cards
 * at the top of the screen have begun to go before the lift carries them out
 * of the top of it; over by the time the lift has taken the lowest of them
 * past the header.
 */
const MOMENTS_DISSOLVE_AT = ABOUT_AT - 0.1;
const MOMENTS_DISSOLVE_OVER = 0.45;
/* And from here the cards raise no captions on hover: the call to apply is
   well up over them, and a label would come up on top of its words. */
const MOMENT_CAPTIONS_OFF_AT = 6.6;

function momentsLift(playhead) {
  const t = Math.max(0, Math.min(playhead, TIMELINE_END) - ABOUT_AT);
  const ramp = Math.min(t, MOMENTS_LIFT_RAMP);

  return (
    MOMENTS_LIFT_FROM * ramp +
    ((MOMENTS_LIFT_TO - MOMENTS_LIFT_FROM) * ramp * ramp) / (2 * MOMENTS_LIFT_RAMP) +
    MOMENTS_LIFT_TO * (t - ramp)
  );
}
/*
 * The header goes back to its dark self as the black reaches it. With the
 * wipe's ease-out, its edge is a little under a tenth of a screen from the top
 * - the header's depth - at seven tenths of the way through.
 */
const HEADER_DARK_AT = ABOUT_COPY_AT + ABOUT_WIPE_OVER * 0.7;
/*
 * Where the call to apply counts as arrived: a tenth of a screen into its
 * rise, when its heading is a little way up from the bottom edge, so the
 * words are coming in as they start up the screen rather than rising blank
 * for a stretch first. The blur-in takes long enough that most of it is
 * still watched once they are well in. Its animations run on their own clock
 * from here; see JoinScene.
 */
const ABOUT_ARRIVED_AT = JOIN_AT + 0.1;
const HEADER_DARK_OVER = 0.05;

/*
 * The last beat. A black banner arrives behind the heading, the heading rises
 * out of the middle of the screen to sit near the top of it, and the logos of
 * where our members have gone start tipping out of the bar.
 *
 * The banner is quick and the rise is long: the bar wants to be there before
 * the reader has decided it is a bar, and the heading wants to look like it is
 * being carried rather than snatched.
 */
const BANNER_AT = 2.95;
const BANNER_OVER = 0.115;
/*
 * The word turns cream a moment after the bar sets off: not when the bar
 * reaches it, but when it has passed it.
 *
 * The heading is one colour across its whole width and the bar arrives from
 * one side, so for as long as the edge is somewhere inside the word, half of
 * it is on black and half on paper and one of those halves is invisible
 * whichever colour it is. The word therefore changes hands once the bar is
 * wholly under it, which with the easing above is a little under half way
 * through the arrival - what reads is the bar wiping the word away and handing
 * it straight back in cream.
 */
const BANNER_INK_AT = 2.995;
const TITLE_RAISE_AT = 2.95;
const TITLE_RAISE_OVER = 0.25;
/*
 * And then it starts emptying.
 *
 * Its own mark rather than the bar's arrival, which is what it used to ride.
 * A bar that is pouring logos before it has finished arriving is a bar that
 * was full of them all along; let it get there, be read as a bar, and tip.
 */
const SPILL_AT = 3.0;
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

/* The heading's change, on the scramble in scramble.js. */
const scrambled = (progress) => scramble(HEADING_FROM, HEADING_TO, progress);

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

/*
 * And the grid printed on that sheet, which is the backdrop every scene from
 * here plays over.
 *
 * Nothing of it is written down. It arrives with the paper, because it is on
 * the paper - the stylesheet takes its opacity from --sheet - and it never
 * leaves, because the paper never does: the white is the page from scene three
 * to the end of the timeline, and a background that saw itself out halfway
 * would only be a light going off.
 */
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
  violet: { from: '#6E1FC2', to: '#68E2C3', ink: '#242B41' },
  green: { from: '#F9D85D', to: '#6EE978', ink: '#2D381B' },
  amber: { from: '#EB50A1', to: '#FF910E', ink: '#52261D' },
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
/*
 * How far into the rise the bubbles are back to their own opacities, as a
 * fraction of scene two. The slowest of them covers 212vh over the scene, so
 * this is a little over 4vh of travel - past anything floatOrbit can nudge.
 */
const GATE_RISE = 0.02;

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

/* Scene two's scatter - see scatter in StarField. */
const STAR_SEED = 20260517;

const STARS = STAR_LAYERS.flatMap((layer, index) => {
  const random = scatter(STAR_SEED + index);

  return Array.from({ length: layer.count }, () => {
    const spin = layer.spin * (0.8 + random() * 0.4);

    return {
      left: random() * 100,
      /*
       * How far below the fold it waits, so they keep arriving through the
       * opening of the scene instead of entering as one flock.
       *
       * Spread this wide and no wider: the sheet starts up at playhead 2,
       * barely over a third of the way through the rise, and a square still
       * below the fold by then would never be seen at all.
       */
      pad: random() * 78,
      size: layer.size * (0.75 + random() * 0.5),
      speed: layer.speed * (0.88 + random() * 0.24),
      opacity: layer.opacity * (0.7 + random() * 0.6),
      spin,
      /*
       * One number for both the angle it sits at and where it is in its turn:
       * a square dropped part way into an eighty second rotation is a square at
       * an angle, and no two of them agree on either.
       */
      delay: -random() * spin,
      /* Half of them turning the other way, so the field has no drift of its
         own to notice. */
      reverse: random() < 0.5,
      /* The finest layer is also the most crowded, and is the one a phone does
         without. See .starFine. */
      fine: index === 0,
    };
  });
});

const clamp01 = (value) => Math.min(1, Math.max(0, value));

/*
 * A length on the glass, not on the page: whole device pixels, so a rule the
 * size of one of them is actually drawn as one of them.
 *
 * CSS pixels and device pixels only agree at 1x. A 1.25 scale - Windows at
 * 125 percent, a browser zoomed to 80 - makes 32px a 40-pixel stride with a
 * half-pixel left over, and that remainder is what ate a line every few cells.
 */
const snapToDevice = (px, dpr) => Math.round(px * dpr) / dpr;

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
  const easeLead = (t, lead = LEAD_IN, out = LEAD_OUT) => {
    const away = t ** lead;

    return away / (away + (1 - t) ** out);
  };

  /* The banner's own pair: away a little more readily than the wipes and a good
     deal longer coming to rest. */
  const BANNER_LEAD_IN = 1.4;
  const BANNER_LEAD_OUT = 4.2;

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

  export default function ImmersiveHero() {
    const prefersReducedMotion = useReducedMotion();

    const sectionRef = useRef(null);
    const stageRef = useRef(null);
    const aboutRef = useRef(null);
    const aboutWipeRef = useRef(null);
    const lockupRef = useRef(null);
    const markBoxRef = useRef(null);
    /* The title's pixel face, and the real one's typed phrase it is laid
       over - see useTitlePixels. */
    const typedRef = useRef(null);
    const pixelLayerRef = useRef(null);
    const pixelMarkRef = useRef(null);
    const pixelTextRef = useRef(null);
    const pixelStaticRef = useRef(null);
    const cueRef = useRef(null);
    /* The frame id of the cue's scroll tween, so a second click replaces the
       first rather than fighting it. */
    const cueScrollRef = useRef(null);
    const arcPathRef = useRef(null);
    const arcMaskPathRef = useRef(null);
    const arcClipPathRef = useRef(null);
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
    /* The second paint of the rows. Kept out of the tree until a wipe starts,
       so the arc can scale without redrawing a second copy of every logo. */
    const wipesRef = useRef(null);

    /*
     * Where each row draws itself a second time, in black over its own white:
     * groups inside LogoArc's wipe clips, handed to the rows' tickers. State
     * rather than refs because the tickers render into them, and cannot until
     * they exist.
     */
    const [topWipeSlot, setTopWipeSlot] = useState(null);
    const [secondWipeSlot, setSecondWipeSlot] = useState(null);
    /* The heading the band carries off. */
    const arcTitleRef = useRef(null);
    /*
     * The three pieces of the community panel, which are also the three things
     * the fallen logos are pushed along by as it comes up.
     *
     * Separately rather than as one box, because the panel is mostly air: the
     * heading is a short word above a much wider paragraph, and a single box
     * around the pair sweeps the logos out of the gap beside the heading that
     * they ought to be able to sit in. The star is a shape rather than a box
     * for the same reason, only more so.
     */
    const communityStarRef = useRef(null);
    const communityTitleRef = useRef(null);
    const communityBodyRef = useRef(null);
    const communityBodies = useRef([
      { ref: communityStarRef, outline: star },
      communityTitleRef,
      communityBodyRef,
    ]);
    const momentStripRef = useRef(null);
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
      headerDark: false,
    aboutArrived: false,
      ctaHidden: false,
      bannerInk: false,
      spill: false,
      titleGone: false,
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
      /* Up here with the other reads: after the writes below it would make the
         browser recalculate the whole stage's style mid-frame to answer it. */
      const holderWidth = arcHolderRef.current?.offsetWidth ?? 0;
      /* Where the copy and the stage are on the screen, for its stars' clip.
         Neither moves with anything written below, only with the scroll. */
      const aboutRect = aboutRef.current?.getBoundingClientRect();
      const stageTop = stage.getBoundingClientRect().top;

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
        /* Scene six's black at the top of the screen, which hands the header
           back its dark self. */
        headerDark: crossed(flags.headerDark, playhead, HEADER_DARK_AT, 0.02),
        aboutArrived: crossed(flags.aboutArrived, playhead, ABOUT_ARRIVED_AT, 0.02),
        /* A narrow band, because the threshold itself is close enough to nil
           that the default one would sit below zero and never let go. */
        ctaHidden: crossed(flags.ctaHidden, playhead, CTA_HIDE_AT, 0.02),
        bannerInk: crossed(flags.bannerInk, playhead, BANNER_INK_AT, 0.02),
        /* Back into the blur it came out of, just before the bar leaves. */
        titleGone: crossed(flags.titleGone, playhead, TITLE_GONE_AT, 0.02),
        /* What lets the spill go. Everything past this point is the spill's own
           clock, which is why it is a flag and not a value. */
        spill: crossed(flags.spill, playhead, SPILL_AT, 0.02),
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

      /*
       * One gate over the whole flock, not a fade per bubble.
       *
       * At rest every bubble is parked exactly flush with the bottom of the
       * stage - its own radius below the edge - and floatOrbit then lifts it by a
       * few percent of its diameter, which is enough to show a cap of colour
       * above the fold before the scene has started. Holding them all at zero
       * until the rise begins covers that, whatever the float happens to be doing
       * at the moment the page loads.
       *
       * GATE_RISE is small enough that the slowest bubble is only a sliver clear
       * of the fold by the time the gate is fully open, so this reads as them
       * entering, not as a flock fading up.
       */
      stage.style.setProperty('--bubble-gate', clamp01(rise / GATE_RISE).toFixed(4));

      /*
       * And the stars behind them, fading up over the opening of the scene.
       *
       * Only the arrival is here. Nothing takes them away again: the stylesheet
       * multiplies this by what is left of --sheet, so the white rising over them
       * is the one thing that ends them, and they cannot outlive it however the
       * scene before is retimed.
       */
      stage.style.setProperty(
        '--stars',
        smoothstep(clamp01((playhead - STARS_AT) / STARS_OVER)).toFixed(4),
      );

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
       * The banner behind the heading, and the heading's climb out of the middle
       * of the screen.
       *
       * The bar is drawn by the heading's own ::before, so it needs nothing here
       * but how far it has opened - and the stage's width, because it has to
       * stop exactly at the edge of the screen for its pointed end to be on it.
       * 100vw would be the scrollbar too wide, and the stage would clip the
       * point off.
       */
      stage.style.setProperty('--stage-w', `${stageWidth.toFixed(1)}px`);
      /* Thrown in and settling, rather than eased evenly at both ends: the bar
         should be most of the way across before it is being watched arrive. */
      stage.style.setProperty(
        '--banner',
        easeLead(
          clamp01((playhead - BANNER_AT) / BANNER_OVER),
          BANNER_LEAD_IN,
          BANNER_LEAD_OUT,
        ).toFixed(4),
      );
      stage.style.setProperty(
        '--title-raise',
        smootherstep(clamp01((playhead - TITLE_RAISE_AT) / TITLE_RAISE_OVER)).toFixed(4),
      );

      /*
       * Scene four: the banner goes up and out, and the community panel comes up
       * behind it. Both eased to a stop, because both are arriving somewhere -
       * one at the top of the screen and one at the middle of it.
       */
      stage.style.setProperty(
        '--banner-exit',
        smootherstep(clamp01((playhead - BANNER_EXIT_AT) / BANNER_EXIT_OVER)).toFixed(4),
      );
      stage.style.setProperty(
        '--community',
        easeLead(
          clamp01((playhead - COMMUNITY_AT) / COMMUNITY_OVER),
          COMMUNITY_LEAD_IN,
          COMMUNITY_LEAD_OUT,
        ).toFixed(4),
      );
      /*
       * Scene five: how far the frame has travelled, in pixels of the stage.
       *
       * One number for the whole scene. The panel, the pile and every moment
       * card are moved by this and nothing else, which is what keeps them a
       * single picture being panned across rather than a set of things that
       * happen to be sliding at similar rates.
       */
      const panPx = -panScreens(playhead) * stageWidth;

      stage.style.setProperty('--pan', `${panPx.toFixed(1)}px`);

      /* Scene six: the black behind the moments, and the moments lifting. */
      const aboutWipe = clamp01((playhead - ABOUT_COPY_AT) / ABOUT_WIPE_OVER);
      const aboutWipeEased = 1 - (1 - aboutWipe) * (1 - aboutWipe);

      stage.style.setProperty('--about-wipe', aboutWipeEased.toFixed(4));

      const joinRise = clamp01((playhead - JOIN_AT) / JOIN_RISE_OVER);

      stage.style.setProperty(
        '--join-rise',
        `${((1 - joinRise) ** 3 * JOIN_RISE_FROM * stageHeight).toFixed(1)}px`,
      );

      /*
       * The copy's stars, cut off at the black's top edge. Worked out from the
       * wipe's own rule rather than measured off it - .aboutWipe starts 5vh
       * above the stage and travels its own height - against where the field
       * starts, ABOUT_STARS_REACH above the copy.
       */
      /* How far the copy's top is down the window, which the stars' parallax
         gives back a share of - see ABOUT_STARS_LAG. */
      if (aboutRect) {
        aboutRef.current.style.setProperty('--about-scroll', `${aboutRect.top.toFixed(1)}px`);
      }

      if (aboutWipeRef.current && aboutRect) {
        const vh = window.innerHeight / 100;
        const wipeTop =
          stageTop - 5 * vh + (1 - aboutWipeEased) * (stageHeight + 5 * vh);
        const fieldTop = aboutRect.top - ABOUT_STARS_REACH * vh;

        aboutRef.current.style.setProperty(
          '--stars-clip',
          `${Math.max(0, wipeTop - fieldTop).toFixed(1)}px`,
        );
      }
      stage.style.setProperty(
        '--moments-lift',
        `${(-momentsLift(playhead) * stageHeight).toFixed(1)}px`,
      );
      momentStripRef.current?.setDissolve(
        clamp01((playhead - MOMENTS_DISSOLVE_AT) / MOMENTS_DISSOLVE_OVER),
      );
      momentStripRef.current?.setCaptionsOff(playhead >= MOMENT_CAPTIONS_OFF_AT);

      /*
       * The grid on the paper. Written here in whole device pixels so the
       * stylesheet can tile it without rounding a period: see .grid.
       *
       * The small box is the measure. It is snapped first, then forced to a
       * multiple of four device pixels so the cell - four of it - lands on the
       * same grid and the two rulings share their lines rather than drawing a
       * double-weight rule where they meet.
       *
       * The rule itself is at least two device pixels, and grows with the window
       * so a 4K view is not looking at a 1px hairline from across the room.
       *
       * Linear, and for the bubbles' reason - a backdrop that eased would be a
       * backdrop keeping time with something, and this one is only keeping time
       * with the scroll.
       */
      {
        const dpr = window.devicePixelRatio || 1;
        const vmin = Math.min(stageWidth, stageHeight) / 100;
        const subDevice = Math.round(
          Math.min(42, Math.max(26, 3.2 * vmin)) * dpr,
        );
        const sub = Math.max(4, Math.round(subDevice / 4) * 4) / dpr;
        const hair = Math.max(2, Math.round(Math.max(1, 0.12 * vmin) * dpr)) / dpr;
        const shiftX = snapToDevice(panPx * 0.12, dpr);
        const shiftY = snapToDevice(Math.max(0, playhead - SHEET_AT) * -0.1 * stageHeight, dpr);

        stage.style.setProperty('--grid-sub', `${sub.toFixed(3)}px`);
        stage.style.setProperty('--grid-hair', `${hair.toFixed(3)}px`);
        stage.style.setProperty('--grid-shift', `${shiftX.toFixed(3)}px ${shiftY.toFixed(3)}px`);
      }
      /* The bar's exit, on the curve it arrived on so the two read as one move
         made twice. */
      stage.style.setProperty(
        '--banner-out',
        easeLead(
          clamp01((playhead - BANNER_OUT_AT) / BANNER_OUT_OVER),
          BANNER_LEAD_IN,
          BANNER_LEAD_OUT,
        ).toFixed(4),
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
      [arcPathRef, arcMaskPathRef].forEach((ref) => {
        if (ref.current && ref.current.getAttribute('d') !== shape) {
          ref.current.setAttribute('d', shape);
        }
      });

      /* The outline the logos are clipped to, which is the same band. */
      const outline = arcOutline(flat);

      if (arcClipPathRef.current && arcClipPathRef.current.getAttribute('d') !== outline) {
        arcClipPathRef.current.setAttribute('d', outline);
      }

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
       *
       * The whole of that second paint stays unrendered until a wipe has actually
       * started. Up to then it is a copy of both rows, redrawn on every frame of
       * the arc's scale for a clip that is still closed.
       */
      const secondProgress = clamp01((playhead - WIPE_SECOND_AT) / WIPE_OVER);
      const topProgress = clamp01((playhead - WIPE_TOP_AT) / WIPE_OVER);
      const wipe = (rect, progress, from) => {
        if (!rect) {
          return;
        }

        const span = 2 * middle.reach * easeLead(progress);
        const x = (from > 0 ? middle.reach - span : -middle.reach).toFixed(2);
        const width = span.toFixed(2);

        if (rect.getAttribute('x') !== x) {
          rect.setAttribute('x', x);
        }

        if (rect.getAttribute('width') !== width) {
          rect.setAttribute('width', width);
        }
      };

      const wiping = secondProgress > 0 || topProgress > 0;

      /*
       * The band sits on the paper until the wipes, then becomes the paper.
       *
       * .arcHolder is 7 and the grid is 6, so the stroke covers the ruling for
       * the whole of the arrival. The moment a wipe has any width, the holder
       * drops to 6: same layer as the grid, earlier in the stage, which is what
       * puts the ruling over the white. Keyed off the wipe rather than written
       * down, so retiming the rows cannot leave the grid on the wrong side of
       * them.
       */
      if (arcHolderRef.current) {
        const next = wiping ? '6' : '7';

        if (arcHolderRef.current.style.zIndex !== next) {
          arcHolderRef.current.style.zIndex = next;
        }
      }

      /*
       * The bar stays over the pile. The spill shares the grid's layer and
       * follows it in the stage, which puts the logos on the ruling, and the
       * heading is that same layer and later, so they still come out from
       * behind the bar.
       *
       * Not until the drop has finished. Before that the heading is under the
       * band, and lifting it would put the word in front of the stroke it is
       * crossing.
       */
      if (arcTitleRef.current) {
        const next = playhead >= TITLE_DROP_AT + TITLE_DROP_OVER ? '6' : '5';

        if (arcTitleRef.current.style.zIndex !== next) {
          arcTitleRef.current.style.zIndex = next;
        }
      }

      if (wiping) {
        wipe(secondWipeRef.current, secondProgress, 1);
        wipe(topWipeRef.current, topProgress, -1);
      }

      if (wipesRef.current) {
        const next = wiping ? '' : 'none';

        if (wipesRef.current.style.display !== next) {
          wipesRef.current.style.display = next;
        }
      }

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
       * it - how far it has risen, how far the client
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
        (
          smoothstep(clamp01((playhead - HEADER_WASH_AT) / HEADER_WASH_OVER)) *
          (1 - smoothstep(clamp01((playhead - HEADER_DARK_AT) / HEADER_DARK_OVER)))
        ).toFixed(4),
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

    useTitlePixels({
      playheadRef,
      lockupRef,
      markBoxRef,
      typedRef,
      overlayRef: pixelLayerRef,
      pixelMarkRef,
      pixelTextRef,
      staticRef: pixelStaticRef,
    });

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

    /* Before the first paint, so the second copy of the rows is not drawn while
       the arc is still scaling in. The scroll loop shows it once a wipe starts. */
    useLayoutEffect(() => {
      if (wipesRef.current) {
        wipesRef.current.style.display = 'none';
      }
    }, []);

    useScrollPlayhead(sectionRef, applyPlayhead, !prefersReducedMotion);

    // Solid under a typist's hands, blinking whenever they have stopped.
    /*
     * The header is a sibling of this whole section, so the only way to tell it
     * the page has turned light is a class on the root. Taken off again on the
     * way back up and on unmount, or another route would inherit a light header.
     */
    useEffect(() => {
      const root = document.documentElement;
      root.classList.toggle('op-light', revealed.headerLight && !revealed.headerDark);

      return () => root.classList.remove('op-light');
    }, [revealed.headerLight, revealed.headerDark]);

    const caretResting = charCount === 0 || charCount === phrase.length;

    /*
     * The cue takes you to playhead 1.00 - the end of the zoom, with the disc at
     * rest and the first bubbles on their way up - rather than past the whole
     * pinned timeline. The playhead is screens travelled inside the section, so
     * one screen past where the section's top meets the viewport's is it.
     *
     * Under reduced motion the section is one screen tall and this lands on the
     * next section, which is what the cue used to do and still should.
     */
    const scrollToPlayheadOne = useCallback(() => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const from = window.scrollY;
      const to = from + section.getBoundingClientRect().top + window.innerHeight;

      if (prefersReducedMotion) {
        window.scrollTo(0, to);
        return;
      }

      /*
       * Driven here rather than by `behavior: 'smooth'`, whose duration is the
       * browser's to choose and which covers a whole screen too briskly to read
       * as anything but a jump. A screen of travel over CUE_SCROLL_MS, eased in
       * and out, gives the scenes time to play as they pass.
       */
      if (cueScrollRef.current !== null) {
        window.cancelAnimationFrame(cueScrollRef.current);
      }

      const start = performance.now();

      const step = (now) => {
        const t = clamp01((now - start) / CUE_SCROLL_MS);
        window.scrollTo(0, from + (to - from) * smoothstep(t));
        cueScrollRef.current = t < 1 ? window.requestAnimationFrame(step) : null;
      };

      cueScrollRef.current = window.requestAnimationFrame(step);
    }, [prefersReducedMotion]);

    /* A tween still running when the route changes would scroll the next page. */
    useEffect(
      () => () => {
        if (cueScrollRef.current !== null) {
          window.cancelAnimationFrame(cueScrollRef.current);
        }
      },
      [],
    );

    return (
      <>
      <section
        ref={sectionRef}
        className={styles.section}
        // Reduced motion gets a plain one-screen hero: pinning a stage that never
        // moves would only be screens of scrolling that do nothing.
        style={{ height: prefersReducedMotion ? '100vh' : `${(TIMELINE_END + 1) * 100}vh` }}
      >
        <div ref={stageRef} className={styles.stage}>
          {/*
            The furthest thing back: the swirl the rest of the site uses, drifting
            up behind the bubbles over the whole of their scene. First in the
            stage so it paints before them - it shares their z-index, and at the
            back of the pack document order is what decides.
          */}
          {!prefersReducedMotion && <span className={styles.swirl} aria-hidden="true" />}

          {/*
            The stars, between the swirl and the bubbles. All three sit at the
            back of the pack on z-index 0, where document order is what decides,
            so this is a backdrop to the flock and a sky over the swirl.
          */}
          {!prefersReducedMotion && (
            <div className={styles.starField} aria-hidden="true">
              {STARS.map((star, index) => (
                <span
                  key={index}
                  className={`${styles.star} ${star.fine ? styles.starFine : ''}`}
                  style={{
                    left: `${star.left.toFixed(2)}%`,
                    '--pad': `${star.pad.toFixed(1)}vh`,
                    '--speed': `${star.speed.toFixed(1)}vh`,
                    '--size': `${star.size.toFixed(3)}vmin`,
                  }}
                >
                  {/* The travel is the span's; the turn is this one's. One
                      transform each, so neither has to be written in terms of
                      the other. */}
                  <i
                    className={styles.starSpin}
                    style={{
                      opacity: star.opacity.toFixed(3),
                      animationDuration: `${star.spin.toFixed(1)}s`,
                      animationDelay: `${star.delay.toFixed(1)}s`,
                      animationDirection: star.reverse ? 'reverse' : 'normal',
                    }}
                  />
                </span>
              ))}
            </div>
          )}

          {/* The cursor's trail over the backdrop in scene one: static, in the
              trail's blocks - see useTitlePixels. Over the stars and under
              everything else, by document order at z-index 0. */}
          {!prefersReducedMotion && (
            <canvas ref={pixelStaticRef} className={styles.titleStatic} aria-hidden="true" />
          )}

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
                maskPathRef={arcMaskPathRef}
                clipPathRef={arcClipPathRef}
                inkRef={arcInkRef}
                inkClassName={styles.arcInk}
                fadeClassName={styles.bandFade}
                wipeClassName={styles.rowWipe}
                wipesRef={wipesRef}
                wipes={[
                  { slotRef: setSecondWipeSlot, rectRef: secondWipeRef, half: -1 },
                  { slotRef: setTopWipeSlot, rectRef: topWipeRef, half: 1 },
                ]}
              >
                <ArcTicker
                  twinContainer={topWipeSlot}
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
                  twinContainer={secondWipeSlot}
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

          {/*
            The grid the light scenes play over: a second copy of the paper,
            carrying no colour.

            After the arc in the stage. The holder is one layer above this until
            a wipe starts, then drops to this same layer, which is what puts the
            ruling over the white the rows are turned with and not over the band
            before that.
          */}
          {!prefersReducedMotion && (
            <span className={styles.gridSheet} aria-hidden="true">
              <span className={styles.grid} />
            </span>
          )}

          {/*
            Before the heading in the stage, so the heading and the black bar it
            carries paint over the top: the logos come out from behind the bar
            rather than over it.
          */}
          {!prefersReducedMotion && (
            <LogoSpill
              className={styles.spill}
              logoClassName={styles.spillLogo}
              debugClassName={styles.spillDebug}
              items={whereWeWork}
              scales={whereWeWorkScale}
              roundSet={whereWeWorkRound}
              obstacleRefs={communityBodies.current}
              running={revealed.spill}
              stageRef={stageRef}
              originRef={arcTitleRef}
            />
          )}

          {/*
            Scene four, waiting below the fold.

            Its words are the club's own: this is the Community section that used
            to sit further down the page, arriving at the end of the hero instead
            of being scrolled past after it.

            The star, the heading and the paragraph are handed to the spill as
            obstacles, so the panel does not slide up through the pile of logos
            on the floor - it gets underneath them and carries them up the page.
            Three of them and not one: what pushes is the words and the star
            themselves, and the logos keep the room between them.
          */}
          {!prefersReducedMotion && (
            <div className={styles.community} aria-hidden="true">
              <img ref={communityStarRef} className={styles.communityStar} src={star} alt="" />
              <div className={styles.communityText}>
                <h2 ref={communityTitleRef} className={styles.communityTitle}>
                  Community
                </h2>
                <p ref={communityBodyRef} className={styles.communityBody}>
                  Project teams will be with a{' '}
                  <span className={styles.communityHighlight}>group of students (10-15)</span> to
                  encourage a tight-knit community where team members can really get to know each
                  other. Socials beyond general team meetings will vary by team such as
                  after-meeting dinners or late-night boba runs. In addition, there will be
                  multiple club-wide socials throughout the semester so you have the chance to
                  meet everyone in the club!
                </p>
              </div>
            </div>
          )}

          {/*
            Scene five, waiting off the right of the screen.

            The panel above and the pile on the floor both carry the stage's
            --pan and are taken off to the left by it; these come the other way
            on the same number, each at its own share of it. Nothing about the
            strip is timed here - where every card waits, how fast it travels and
            how big it is are communityMoments.js, and the one thing this scene
            needs from the playhead is --pan itself.
          */}
          {/*
            Scene six's black. Before the strip at the same z-index, so the
            moments stay on top of it as it wipes up behind them.
          */}
          {!prefersReducedMotion && <span ref={aboutWipeRef} className={styles.aboutWipe} aria-hidden="true" />}

          {!prefersReducedMotion && <MomentStrip ref={momentStripRef} />}

          {/*
            Scene six's words, over the moments and the stars: see JOIN_AT.
            Under reduced motion there is no rise, and they sit in the page
            below instead.
          */}
          {!prefersReducedMotion && (
            <div className={styles.joinStage}>
              <div className={`${styles.joinRise} limitWidth`}>
                <JoinScene arrived={revealed.aboutArrived} reducedMotion={false} />
              </div>
            </div>
          )}

          {/* Outside the arc's holder, which is being scaled: a heading inside it
              would be scaled with it. Under it in the stack, though, so the band
              covers the word as it drops past. */}
          {!prefersReducedMotion && (
            <h2
              ref={arcTitleRef}
              className={`${styles.overlayTitle} ${styles.arcTitle} ${
                revealed.clients && !revealed.titleGone ? styles.revealed : ''
              } ${revealed.bannerInk ? styles.onBanner : ''}`}
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

          {/* The title and the one thing to do about it, as a column: keeping the
              button out of the lockup is what stops the zoom from taking it with
              the disc. */}
          <div className={styles.titleGroup}>
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

                <span ref={typedRef} className={styles.wordmarkTyped}>
                  {phrase.slice(0, charCount)}
                  <span className={`${styles.caret} ${caretResting ? styles.caretResting : ''}`} />
                  {/* The rest of the phrase, there but unpainted, so the box -
                      and the gradient across it - is the finished phrase's. */}
                  <span className={styles.wordmarkRest}>{phrase.slice(charCount)}</span>
                </span>
              </span>

              {/* The same lockup in pixels, shown only through the pointer's
                  trail; useTitlePixels places it and masks it. Always here
                  rather than added on a hover, so the mark's float keeps time
                  with the real one's. */}
              <span ref={pixelLayerRef} className={styles.lockupPixel} aria-hidden="true">
                <span ref={pixelMarkRef} className={styles.markPixelBox}>
                  <img
                    src={pixelMark}
                    alt=""
                    className={`${styles.mark} ${styles.markPixel} ${revealed.markFloat ? styles.markFloating : ''}`}
                  />
                </span>
                {/* A letter to a span, each set over its Montserrat twin by
                    useTitlePixels, since the two faces' widths differ. */}
                <span ref={pixelTextRef} className={styles.wordmarkPixel}>
                  {[...phrase.slice(0, charCount)].map((letter, index) => (
                    <span key={index} className={styles.pixelGlyph}>
                      {letter}
                    </span>
                  ))}
                  <span
                    className={`${styles.caret} ${styles.pixelCaret} ${caretResting ? styles.caretResting : ''}`}
                  />
                </span>
              </span>
            </h1>

            {/* The foot of the page's button, reskinned for a black stage: the
                shape, size and the wipe's timing are HomePage's and are not
                copied here, while .ctaButton hollows it out and takes the wipe
                the whole way across. .cta only places it and lifts it clear of
                the overlay copy. */}
            <Link
              to="/apply"
              className={`${styles.cta} ${revealed.ctaHidden ? styles.ctaGone : ''}`}
            >
              <button className={`${homeStyles.getInvolvedButton} ${styles.ctaButton}`}>
                Get Involved
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </button>
            </Link>
          </div>

          <button
            ref={cueRef}
            type="button"
            className={homeStyles.scrollCue}
            aria-label="Scroll down"
            // The shared rule fades the cue over 0.3s, which would lag a value
            // the playhead rewrites every frame.
            style={{ transition: 'none' }}
            onClick={scrollToPlayheadOne}
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

      {/*
        Scene six's stars, after the section rather than in its stage: see
        ABOUT_COPY_AT. The words are in the stage, but for reduced motion.
      */}
      <div
        ref={aboutRef}
        className={styles.about}
        // At least as tall as it is pulled up by, so the page runs on to where
        // the stage lets go rather than ending under it.
        style={
          prefersReducedMotion
            ? undefined
            : { marginTop: `${-ABOUT_OVERLAP * 100}vh`, minHeight: `${ABOUT_OVERLAP * 100}vh` }
        }
      >
        <StarField />

        {prefersReducedMotion && (
          <div className={`${styles.aboutInner} limitWidth`}>
            <JoinScene arrived reducedMotion />
          </div>
        )}
      </div>
    </>
  );
}
