import styles from '../css/ImmersiveHero.module.css';
import { communityMoments } from '../data/communityMoments';

/*
 * The strip of club life that comes past at the end of the hero.
 *
 * It moves on the hero's own `--pan`, and it is worth saying what this file
 * therefore does not do: there is no loop here, no scroll listener, and
 * nothing is written to any of these nodes after they are first rendered. Each
 * card is given its four numbers once - where it waits, which lane it is in,
 * its share of the pan and its size - and from then on the whole scene is one
 * variable on the stage moving, with the compositor carrying every card off
 * the same value. The alternative, transforming eight elements by hand on
 * every frame of a scroll, is eight more things to keep in step with a number
 * they could simply have been told to read.
 *
 * What is in the cards and how they are scattered is communityMoments.js; this
 * is only the shape they take on the page.
 */

/*
 * The colours the blocks stand in with until the photographs arrive.
 *
 * The page's own, cycled, rather than a grey: a strip of grey rectangles reads
 * as a layout that has not loaded, and the point of the placeholder is to be
 * able to judge the timing of a scene that looks like the finished one. They
 * are the quieter half of the palette for the same reason - eight saturated
 * blocks going past would be the only thing anyone saw.
 */
const TINTS = ['#A9D9D1', '#FBEAA0', '#5EC8FF', '#F9C12C'];

export default function MomentStrip() {
  return (
    /* Decoration, like the rest of the hero: the club's own words about its
       community are in the section below, where a reader is handed them. */
    <div className={styles.moments} aria-hidden="true">
      {communityMoments.map((moment, index) => (
        <figure
          key={moment.caption}
          className={styles.moment}
          style={{
            '--stagger': `${moment.stagger}vw`,
            '--lane': `${moment.lane}%`,
            '--speed': moment.speed,
            '--zoom': moment.zoom,
          }}
        >
          {moment.image ? (
            <img className={styles.momentImage} src={moment.image} alt="" />
          ) : (
            <div
              className={styles.momentBlank}
              style={{ backgroundColor: TINTS[index % TINTS.length] }}
            />
          )}
          <figcaption className={styles.momentCaption}>{moment.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
