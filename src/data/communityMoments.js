/*
 * The moments that come past from the right at the end of the hero.
 *
 * Scene five is the community panel and the pile of logos being carried off to
 * the left while these come the other way: a strip of club life, scattered up
 * and down the screen and travelling at slightly different rates, so what goes
 * past reads as a place with depth rather than a row of tiles on a conveyor.
 *
 * Each entry is where one card starts, how fast it travels, how big it is and
 * what it says. The order of the array is the order they arrive, which is the
 * order of the staggers below rather than anything the code works out.
 *
 * The units are the ones the scene itself is tuned in:
 *
 *   stagger  where the card waits before the pan starts, in vw from the left
 *            edge of the screen. Anything over 100 is off the right of it and
 *            out of shot; 112 is just past the edge, 400 is four screens away.
 *   speed    its share of the pan. 1 is locked to the community panel, above 1
 *            overtakes it - the near distance - and below 1 is left behind by
 *            it. Worth keeping within a quarter either side of 1: this is
 *            depth, not a race, and a card at 2 has crossed the screen and
 *            gone before the one behind it has arrived.
 *   lane     its top edge, in % of the stage's height. Allow for the card's
 *            own height, which is about a third of the stage at zoom 1, so a
 *            lane past 60 hangs off the bottom.
 *   zoom     its size, as a multiplier on that. The far ones are smaller.
 *
 * The pan is PAN_TRAVEL screens long - see ImmersiveHero - so a card finishes
 * at `stagger - 100 * PAN_TRAVEL * speed` vw. That is worth working out for
 * the last few: anything landing between 0 and 70 is still on screen when the
 * scroll runs out, and those cards are what the hero ends on. The ones here
 * leave three of them spread across the frame.
 *
 * The photographs are not in yet. A card with no image draws a flat block of
 * the page's own colour with the caption under it - the same shape and the
 * same weight on screen as the picture that will replace it - so the scene can
 * be timed now and papered later. Adding a real one is importing it at the top
 * of this file and naming it in the entry; nothing in MomentStrip changes.
 */

export const communityMoments = [
  { image: null, caption: 'Boba at midnight, week three', stagger: 110, lane: 10, speed: 1.14, zoom: 1.02 },
  { image: null, caption: 'Kickoff, 306 Soda', stagger: 144, lane: 50, speed: 0.92, zoom: 0.88 },
  { image: null, caption: 'The first standup', stagger: 176, lane: 24, speed: 1.08, zoom: 0.96 },
  { image: null, caption: 'Dinner after the client review', stagger: 210, lane: 56, speed: 0.96, zoom: 0.84 },
  { image: null, caption: 'Hack weekend, 3am', stagger: 242, lane: 8, speed: 1.16, zoom: 1.06 },
  { image: null, caption: 'Office hours that became a party', stagger: 276, lane: 44, speed: 0.9, zoom: 0.92 },
  { image: null, caption: 'Retreat, up at Tilden', stagger: 308, lane: 18, speed: 1.04, zoom: 1.08 },
  { image: null, caption: 'The whiteboard, week nine', stagger: 340, lane: 54, speed: 0.94, zoom: 0.86 },
  { image: null, caption: 'Demo night', stagger: 369, lane: 26, speed: 0.96, zoom: 1 },
  { image: null, caption: 'Formal', stagger: 408, lane: 6, speed: 0.94, zoom: 1.1 },
  { image: null, caption: 'Last standup of the semester', stagger: 455, lane: 46, speed: 1.12, zoom: 0.9 },
  { image: null, caption: 'And the one after that', stagger: 486, lane: 18, speed: 1.1, zoom: 1.04 },
];
