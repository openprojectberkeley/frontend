/*
 * The moments that come past from the right at the end of the hero.
 *
 * Scene five is the community panel and the pile of logos being carried off to
 * the left while these come the other way: a strip of club life, scattered up
 * and down the screen and travelling at slightly different rates, so what goes
 * past reads as a place with depth rather than a row of tiles on a conveyor.
 *
 * Each entry is where one card starts, how near it is and what it says. The
 * order of the array is the order they arrive, which is the order of the
 * staggers below rather than anything the code works out.
 *
 * The units are the ones the scene itself is tuned in:
 *
 *   stagger  where the card waits before the pan starts, in vw from the left
 *            edge of the screen. Anything over 100 is off the right of it and
 *            out of shot; 112 is just past the edge, 400 is four screens away.
 *   lane     its top edge, in % of the stage's height. Allow for the card's
 *            own height, which is about a third of the stage at z 1, so a
 *            lane past 60 hangs off the bottom unless z is pulled down.
 *   z        how near it is. The same number is its size and its share of the
 *            pan: 1 is life size and locked to the community panel, above 1
 *            is the near distance - larger, and overtaking the panel - and
 *            below 1 is farther off, smaller, and left behind by it. A higher
 *            z also paints in front, whatever order the cards arrive in. Worth
 *            keeping within a quarter either side of 1: this is depth, not a
 *            race, and a card at 2 has crossed the screen and gone before the
 *            one behind it has arrived.
 *
 * The pan is PAN_TRAVEL screens long - see ImmersiveHero - so a card finishes
 * at `stagger - 100 * PAN_TRAVEL * z` vw. The last card, at 0.84, finishes
 * near 90vw.
 *
 * The stagger, the lane and z are all uneven on purpose. Neighbors overlap by
 * a corner instead of sitting in a grid, the lanes wander rather than
 * alternating two rows, and z runs from about 0.68 to 1.16. A nearer card is
 * both larger and faster, which is the whole of the depth: there is no second
 * number to keep in step with the first.
 */

import banquet_5_5_26_1 from '../images/community/thumb/banquet_5-5-26_1.png';
import banquet_5_5_26_2 from '../images/community/thumb/banquet_5-5-26_2.png';
import banquet_5_5_26_3 from '../images/community/thumb/banquet_5-5-26_3.png';
import banquet_5_5_26_4 from '../images/community/thumb/banquet_5-5-26_4.png';
import banquet_5_5_26 from '../images/community/thumb/banquet_5-5-26.png';
import bday_4_11_26 from '../images/community/thumb/bday_4-11-26.png';
import big_little_3_2_26_1 from '../images/community/thumb/big_little_3-2-26_1.png';
import big_little_3_2_26 from '../images/community/thumb/big_little_3-2-26.png';
import big_little_3_4_26 from '../images/community/thumb/big_little_3-4-26.png';
import big_little_10_17_26 from '../images/community/thumb/big_little_10-17-26.png';
import chessblitz_arcade_12_11_25 from '../images/community/thumb/chessblitz_arcade_12-11-25.png';
import chessblitz_sf_5_4_25 from '../images/community/thumb/chessblitz_sf_5-4-25.png';
import chessblitz_taco_bell_11_9_25 from '../images/community/thumb/chessblitz_taco_bell_11-9-25.png';
import exec_social_5_4_26 from '../images/community/thumb/exec_social_5-4-26.png';
import movie_night_4_10_26_1 from '../images/community/thumb/movie_night_4-10-26_1.png';
import movie_night_4_10_26 from '../images/community/thumb/movie_night_4-10-26.png';
import retreat_2_20_26 from '../images/community/thumb/retreat_2-20-26.png';
import retreat_2_21_26 from '../images/community/thumb/retreat_2-21-26.png';
import retreat_9_26_26_1 from '../images/community/thumb/retreat_9-26-26_1.png';
import retreat_9_26_26_2 from '../images/community/thumb/retreat_9-26-26_2.png';
import retreat_9_26_26_3 from '../images/community/thumb/retreat_9-26-26_3.png';
import retreat_9_26_26_4 from '../images/community/thumb/retreat_9-26-26_4.png';
import retreat_9_26_26 from '../images/community/thumb/retreat_9-26-26.png';
import retreat_9_27_25_1 from '../images/community/thumb/retreat_9-27-25_1.png';
import retreat_9_27_25_2 from '../images/community/thumb/retreat_9-27-25_2.png';
import retreat_9_27_25 from '../images/community/thumb/retreat_9-27-25.png';
import retreat_9_27_26 from '../images/community/thumb/retreat_9-27-26.png';
import rockettes_sf_5_2_26 from '../images/community/thumb/rockettes_sf_5-2-26.png';
import squid_game_4_17_26_1 from '../images/community/thumb/squid_game_4-17-26_1.png';
import squid_game_4_17_26 from '../images/community/thumb/squid_game_4-17-26.png';

export const communityMoments = [
  { image: banquet_5_5_26_1, caption: 'Boba at midnight, week three', stagger: 112, lane: 15, z: 1.12 },
  { image: banquet_5_5_26_2, caption: 'Kickoff, 306 Soda', stagger: 102, lane: 60, z: 0.7 },
  { image: banquet_5_5_26_3, caption: 'The first standup', stagger: 120, lane: 16, z: 0.86 },
  { image: banquet_5_5_26_4, caption: 'Dinner after the client review', stagger: 155, lane: 30, z: 1.04 },
  { image: banquet_5_5_26, caption: 'Hack weekend, 3am', stagger: 145, lane: 46, z: 0.76 },
  { image: bday_4_11_26, caption: 'Office hours that became a party', stagger: 201, lane: 22, z: 1.08 },
  { image: big_little_3_2_26_1, caption: 'Retreat, up at Tilden', stagger: 150, lane: 62, z: 0.68 },
  { image: big_little_3_2_26, caption: 'The whiteboard, week nine', stagger: 204, lane: 9, z: 0.94 },
  { image: big_little_3_4_26, caption: 'Demo night', stagger: 190, lane: 50, z: 0.8 },
  { image: big_little_10_17_26, caption: 'Formal', stagger: 266, lane: 16, z: 1.14 },
  { image: chessblitz_arcade_12_11_25, caption: 'Last standup of the semester', stagger: 200, lane: 8, z: 0.72 },
  { image: chessblitz_sf_5_4_25, caption: 'And the one after that', stagger: 255, lane: 55, z: 1 },
  { image: chessblitz_taco_bell_11_9_25, caption: 'Last standup of the semester', stagger: 240, lane: 42, z: 0.84 },
  { image: exec_social_5_4_26, caption: 'And the one after that', stagger: 310, lane: 12, z: 1.1 },
  { image: movie_night_4_10_26_1, caption: 'Last standup of the semester', stagger: 220, lane: 58, z: 0.68 },
  { image: movie_night_4_10_26, caption: 'And the one after that', stagger: 288, lane: 20, z: 0.9 },
  { image: retreat_2_20_26, caption: 'Last standup of the semester', stagger: 350, lane: 42, z: 1.06 },
  { image: retreat_2_21_26, caption: 'And the one after that', stagger: 265, lane: 5, z: 0.74 },
  { image: retreat_9_26_26_1, caption: 'Last standup of the semester', stagger: 360, lane: 8, z: 0.98 },
  { image: retreat_9_26_26_2, caption: 'And the one after that', stagger: 300, lane: 65, z: 0.82 },
  { image: retreat_9_26_26_3, caption: 'Last standup of the semester', stagger: 430, lane: 46, z: 1.16 },
  { image: retreat_9_26_26_4, caption: 'And the one after that', stagger: 290, lane: 20, z: 0.7 },
  { image: retreat_9_26_26, caption: 'Last standup of the semester', stagger: 353, lane: 50, z: 0.86 },
  { image: retreat_9_27_25_1, caption: 'And the one after that', stagger: 432, lane: 14, z: 1.02 },
  { image: retreat_9_27_25_2, caption: 'Last standup of the semester', stagger: 340, lane: 70, z: 0.78 },
  { image: retreat_9_27_25, caption: 'And the one after that', stagger: 417, lane: 28, z: 0.92 },
  { image: retreat_9_27_26, caption: 'Last standup of the semester', stagger: 512, lane: 10, z: 1.1 },
  { image: rockettes_sf_5_2_26, caption: 'Last standup of the semester', stagger: 320, lane: 62, z: 0.68 },
  { image: squid_game_4_17_26_1, caption: 'And the one after that', stagger: 475, lane: 35, z: 0.96 },
  { image: squid_game_4_17_26, caption: 'Last standup of the semester', stagger: 440, lane: 52, z: 0.84 },
];
//Verity Verity Verity Verity Verity Verity Verify my verity or is it just verity, does peter bring clarity? Im unsure, the world is a dark and unusual place but then i discovered verity and it all became a little bit brighter
