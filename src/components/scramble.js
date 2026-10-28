/*
 * The scramble.
 *
 * Turns `from` into `to` as `progress` runs from 0 to 1. Each letter waits its
 * turn, spends SCRAMBLE_HOLD of the run cycling through glyphs, and lands on
 * the one it is going to keep; the starts are spread left to right, so the
 * change runs across the word rather than happening to all of it at once.
 * Letters the old word did not have show nothing until their turn comes, which
 * is what makes a word grow into a longer one - and, from an empty string,
 * what makes a sentence type itself in with the scramble at its leading edge.
 *
 * The glyph is picked by arithmetic on the letter's index and how far through
 * its own cycle it is - not at random. On the hero's timeline everything is a
 * function of the playhead and can be scrubbed backwards; a random glyph would
 * make this the one thing that cannot, and would churn on every frame of a
 * scroll that was not moving.
 */
const SCRAMBLE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SCRAMBLE_HOLD = 0.34;
const SCRAMBLE_TICKS = 9;

export default function scramble(from, to, progress, hold = SCRAMBLE_HOLD) {
  if (progress <= 0) return from;
  if (progress >= 1) return to;

  const step = (1 - hold) / Math.max(1, to.length - 1);
  let out = '';

  for (let index = 0; index < to.length; index += 1) {
    const letter = to[index];
    const local = (progress - index * step) / hold;

    if (local >= 1) {
      out += letter;
    } else if (local <= 0) {
      // Still whatever the old word had here, and nothing at all past its end.
      out += from[index] ?? '';
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
