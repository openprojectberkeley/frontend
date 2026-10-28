import { useEffect } from 'react';
import styles from '../css/ImmersiveHero.module.css';

/*
 * The squares of sky the home page's hero and the about page share: the
 * layers and the scatter that places them, which the hero's scene two reads
 * for its own rising field, and the still field laid under scene six's copy
 * and the about page's opening.
 */

/*
 * The stars behind scene two's bubbles: tiny white squares, each at an angle
 * of its own and turning slowly, riding the same --rise the bubbles do.
 *
 * Three layers at a fraction of the bubbles' speed, which is what puts them
 * behind the flock rather than among it - 96vh against the slowest bubble's
 * 212 is a backdrop, and the far layer moving least is the whole of the
 * parallax. Which way round that goes is the opposite of the bubbles above,
 * and deliberately: theirs is about which one carries the copy, this is about
 * distance.
 *
 * `count` is how many, `size` a side in vmin, `speed` how far one travels over
 * the scene in vh, `opacity` how much of the sheet's white is left in it and
 * `spin` how long one turn takes.
 */
export const STAR_LAYERS = [
  { count: 30, size: 0.42, speed: 96, opacity: 0.24, spin: 88 },
  { count: 24, size: 0.66, speed: 138, opacity: 0.36, spin: 67 },
  { count: 16, size: 0.98, speed: 186, opacity: 0.48, spin: 49 },
];

/*
 * The field is scattered rather than arranged, but it is the same scatter on
 * every load: a linear congruential generator from a seed written down by
 * whoever uses it, not Math.random.
 *
 * For the reason the hero's scramble picks its glyphs by arithmetic - everything
 * on its timeline is a function of the playhead, and a sky that changed on
 * every visit would be the one part of it that could not be scrolled back to
 * or pointed at twice.
 */
export function scatter(seed) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;

    return state / 4294967296;
  };
}

/*
 * Scene six's sky: the same three layers of squares, scattered over the top
 * of the black scene six's copy comes up on - and, with no black wiping in
 * under it, of the about page's opening and thinning out down it.
 *
 * They do not rise - they are page, not stage, and the scroll carries them
 * past at the reader's rate. The black does not: it is eased out, so its top
 * edge runs ahead of the copy, by as much as 61vh of it partway through the
 * wipe. So the field starts ABOUT_STARS_REACH above the copy and is clipped
 * to wherever that edge has got to - see --stars-clip - which keeps the black
 * full of stars to its edge and the paper behind it clear of them.
 *
 * How far down each one sits is a uniform draw raised to
 * ABOUT_STARS_FALLOFF, which crowds them towards the top of the field and
 * leaves only a scattering at the bottom of it.
 *
 * And they scroll at less than the page's rate, a layer at a time, for the
 * parallax scene two's three layers have: ABOUT_STARS_LAG is how much of the
 * scroll each layer gives back, the far, fine layer the most. Each is placed
 * where it would be at no lag when the copy's top is at the top of the
 * window - see --about-scroll.
 */
const ABOUT_STARS_LAG = [0.6, 0.42, 0.24];
const ABOUT_STARS_SEED = 20261028;
export const ABOUT_STARS_REACH = 65;
const ABOUT_STARS_DEPTH = 230;
const ABOUT_STARS_FALLOFF = 2;
/* Half as many again as scene two's, for a field half as deep again. */
const ABOUT_STARS_COUNT = 1.5;

const ABOUT_STARS = STAR_LAYERS.flatMap((layer, index) => {
  const random = scatter(ABOUT_STARS_SEED + index);

  return Array.from({ length: Math.round(layer.count * ABOUT_STARS_COUNT) }, () => {
    const spin = layer.spin * (0.8 + random() * 0.4);

    return {
      left: random() * 100,
      top: Math.pow(random(), ABOUT_STARS_FALLOFF) * ABOUT_STARS_DEPTH,
      size: layer.size * (0.75 + random() * 0.5),
      opacity: layer.opacity * (0.7 + random() * 0.6),
      spin,
      delay: -random() * spin,
      reverse: random() < 0.5,
      fine: index === 0,
      lag: ABOUT_STARS_LAG[index],
    };
  });
});

/*
 * The field itself, starting ABOUT_STARS_REACH above its box. Unless
 * something writes --stars-clip, as the hero's scene six does to follow its
 * black up, it is clipped at the box's own top - the reach is still wanted
 * there, as what the parallax pulls down into view while the box is low in
 * the window.
 *
 * Whoever lays it down writes --about-scroll for the parallax - the hero
 * from its own frame, anywhere else useStarParallax.
 */
export default function StarField() {
  return (
    <div
      className={styles.aboutStars}
      style={{ '--stars-reach': `${ABOUT_STARS_REACH}vh` }}
      aria-hidden="true"
    >
      {ABOUT_STARS.map((star, index) => (
        <span
          key={index}
          className={`${styles.aboutStar} ${star.fine ? styles.starFine : ''}`}
          style={{
            left: `${star.left.toFixed(2)}%`,
            top: `${star.top.toFixed(1)}vh`,
            '--size': `${star.size.toFixed(3)}vmin`,
            '--lag': star.lag,
          }}
        >
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
  );
}

/*
 * --about-scroll for a field with no hero driving it: where the top of `ref`
 * is down the window, written on the frame after each scroll, as
 * useScrollPlayhead does.
 */
export function useStarParallax(ref) {
  useEffect(() => {
    let frameId = null;

    const measure = () => {
      frameId = null;

      const box = ref.current;

      if (box) box.style.setProperty('--about-scroll', `${box.getBoundingClientRect().top.toFixed(1)}px`);
    };

    const schedule = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);

      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [ref]);
}
