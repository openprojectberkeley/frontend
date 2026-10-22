/*
 * The employers our members have gone on to, for the logos that spill out of
 * the "Where We Work" banner at the end of the hero.
 *
 * Same shape as clientsData.js on purpose: default-import each file at the top
 * and list the bindings below, so an entry is a plain image src and the order
 * of the array is the order they fall in. Nothing reads names or alt text off
 * this - the logos are decoration and the section is labelled by its heading -
 * so there is no object wrapper to fill in.
 *
 * Images go in src/images/wherewework/. An empty list is a working state and
 * not a broken one: LogoSpill renders nothing and starts no loop, and the rest
 * of the scene plays exactly as it does without it.
 *
 * SVG and PNG both work, and an SVG needs no width or height of its own - the
 * spill reads each file's ratio and sizes it, so a viewBox is enough. Every
 * logo is given the same area rather than the same height, so a long wordmark
 * and a round mark carry the same weight in the pile whatever they measure.
 *
 * They fall in their own colours, so a logo drawn white for a dark background
 * will be invisible here: these land on paper.
 *
 * One thing to know about SVGs. Create React App puts every SVG imported from
 * JavaScript through SVGR, which turns it into JSX on the way past, and JSX
 * cannot express a namespaced attribute. The common ones - xml:space,
 * xmlns:xlink - SVGR knows how to rename; a vendor's own, which Illustrator
 * and Affinity both add (xmlns:serif, sodipodi:, inkscape:), it does not, and
 * the whole build fails with "Namespace tags are not supported". It is not a
 * problem with the logo: delete those attributes from the file, or re-export
 * it from Figma, and it imports like any other.
 *
 * The order below is the order they fall in, interleaved rather than
 * alphabetical so the pile is not the alphabet landing in a heap.
 */

import amazon from "../images/wherewework/amazon.svg";
import apple from "../images/wherewework/apple.svg";
import asana from "../images/wherewework/asana.svg";
import atlassian from "../images/wherewework/atlassian.svg";
import bankofamerica from "../images/wherewework/bankofamerica.svg";
import doordash from "../images/wherewework/doordash.svg";
import google from "../images/wherewework/google.png";
import ibm from "../images/wherewework/ibm.svg";
import intel from "../images/wherewework/intel.svg";
import lg from "../images/wherewework/lg.svg";
import lockheedmartin from "../images/wherewework/lockheedmartin.svg";
import mckinsey from "../images/wherewework/mckinsey.svg";
import mercor from "../images/wherewework/mercor.png";
import nasa from "../images/wherewework/nasa.svg";
import paypal from "../images/wherewework/paypal.svg";
import pinterest from "../images/wherewework/pinterest.svg";
import pixar from "../images/wherewework/pixar.svg";
import qualcomm from "../images/wherewework/qualcomm.svg";
import salesforce from "../images/wherewework/salesforce.svg";
import square from "../images/wherewework/square.svg";
import tinder from "../images/wherewework/tinder.svg";
import volvo from "../images/wherewework/volvo.svg";
import waymo from "../images/wherewework/waymo.png";
import workday from "../images/wherewework/workday.svg";
import ycombinator from "../images/wherewework/ycombinator.svg";

/*
 * A logo that comes out wrong at the shared size, nudged.
 *
 * The sizing works on the area of each logo's ink, which is the right rule and
 * is not the whole answer: a mark that is mostly white space inside its own
 * outline reads smaller than its area says, and a long heavy wordmark reads
 * larger. This is the hand correction on top, as a multiplier on the size the
 * rule arrives at - keyed by the import rather than by name, since what the
 * bundler hands back is a hashed URL.
 *
 * Anything not listed is left at 1.
 */
export const whereWeWorkScale = new Map([
  [volvo, 0.82],
  [google, 1.15],
  [apple, 1.15],
  [nasa, 1.15],
  [lg, 1.15],
  [ycombinator, 1.15],
  [paypal, 1.12],
  [ibm, 1.12],
]);

/*
 * Logos that collide as a circle rather than as a card.
 *
 * The spill works this out for itself where it can - a mark that leaves all
 * four corners of its own box empty is taken to be round - but the test is a
 * guess and some marks sit just the wrong side of it. Anything named here is
 * round whatever the guess said, which is the place to put a logo that is
 * resting on a corner it does not have.
 */
export const whereWeWorkRound = new Set([google, apple, nasa]);

export const whereWeWork = [
  amazon,
  nasa,
  apple,
  paypal,
  asana,
  pinterest,
  atlassian,
  pixar,
  bankofamerica,
  qualcomm,
  doordash,
  salesforce,
  google,
  square,
  ibm,
  tinder,
  intel,
  volvo,
  lg,
  waymo,
  lockheedmartin,
  workday,
  mckinsey,
  ycombinator,
  mercor,
];
