/*
 * White or near-black, whichever reads better on a filled row, all along the
 * white sheen over its accent that the words sit on - see .cardWipe: from the
 * bare accent to the sheen as strong as it gets beside the words.
 */
const DARK_INK = '#14151E';
const SHEEN_AT_WORDS = 0.31;
const toChannels = (hex) => [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
const luminance = (channels) => {
  const [r, g, b] = channels.map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (x, y) => {
  const [lighter, darker] = [luminance(x), luminance(y)].sort((p, q) => q - p);

  return (lighter + 0.05) / (darker + 0.05);
};

export default function accentInk(accent) {
  const bare = toChannels(accent);
  const sheened = bare.map((channel) => channel + (1 - channel) * SHEEN_AT_WORDS);
  const worstOn = (ink) => Math.min(contrast(toChannels(ink), bare), contrast(toChannels(ink), sheened));

  return worstOn('#FFFFFF') >= worstOn(DARK_INK) ? '#FFFFFF' : DARK_INK;
}
