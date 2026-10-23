import { useEffect, useRef, useState } from 'react';
import styles from '../css/ImmersiveHero.module.css';
import { communityMoments } from '../data/communityMoments';

/*
 * The strip of club life that comes past at the end of the hero.
 *
 * It moves on the hero's own `--pan`, and it is worth saying what this file
 * therefore does not do: there is no loop and no scroll listener. An
 * IntersectionObserver latches each card's first arrival, while the card is
 * given its three layout numbers once - where it waits, which lane it is in
 * and how near it is - and from then on the whole scene is one
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
/* Brighter, still high-contrast versions of the violet, green, amber,
   magenta, teal and sky circles from scenes one and two. Every color keeps at
   least 5.3:1 contrast against the caption's white text. */
const HIGHLIGHT_TINTS = ['#4D5F9A', '#3D7659', '#805B0B', '#71377A', '#27686A', '#38617D'];
const OBSERVATION_THRESHOLDS = Array.from({ length: 101 }, (_, index) => index / 100);
const LATE_STAGGER_AT = 300;
const LAST_MOMENT_STAGGER = Math.max(...communityMoments.map(({ stagger }) => stagger));

export default function MomentStrip() {
  /* The stage's CSS transform moves these cards, so the observer sees their
     first entry without a second scroll listener. The image starts as it
     enters; the caption waits until the card is farther into the frame. */
  const cardRefs = useRef(new Map());
  const [revealedCards, setRevealedCards] = useState(() => new Set());
  const [captionCards, setCaptionCards] = useState(() => new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.08) return;

          const index = Number(entry.target.dataset.momentIndex);
          const moment = communityMoments[index];

          if (!moment) return;

          setRevealedCards((current) => {
            if (current.has(index)) return current;

            const next = new Set(current);
            next.add(index);
            return next;
          });

          /* This is the card's own X formula, not a generic viewport test:
             the stagger is its starting distance in vw and z is also its
             share of the horizontal pan. Read the pan that ImmersiveHero is
             writing to the stage so nearer cards activate at their actual,
             faster position rather than at the position of a z=1 card. */
          const stage = entry.target.parentElement?.parentElement;
          const panPx = Number.parseFloat(
            stage ? window.getComputedStyle(stage).getPropertyValue('--pan') : '0',
          ) || 0;
          const cardX = (moment.stagger / 100) * window.innerWidth + panPx * moment.z;

          /* A life-size or nearer card waits for a quarter-screen entrance.
             Farther cards move more slowly, so their required entrance falls
             off faster than their speed. The last third of the strip has less
             runway before scene five ends, so stagger shortens that wait by up
             to 55%, preventing its mid-z cards from arriving too late. */
          const zEntryDistance = 0.25 * Math.min(1, moment.z ** 2);
          const lateProgress = Math.min(
            1,
            Math.max(0, (moment.stagger - LATE_STAGGER_AT) / (LAST_MOMENT_STAGGER - LATE_STAGGER_AT)),
          );
          const entryDistance = zEntryDistance * (1 - 0.55 * lateProgress);

          if (cardX <= window.innerWidth * (1 - entryDistance)) {
            setCaptionCards((current) => {
              if (current.has(index)) return current;

              const next = new Set(current);
              next.add(index);
              return next;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: OBSERVATION_THRESHOLDS },
    );

    cardRefs.current.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    /* Decoration, like the rest of the hero: the club's own words about its
       community are in the section below, where a reader is handed them. */
    <div className={styles.moments} aria-hidden="true">
      {communityMoments.map((moment, index) => (
        <figure
          key={moment.image}
          ref={(card) => {
            if (card) cardRefs.current.set(index, card);
            else cardRefs.current.delete(index);
          }}
          className={`${styles.moment} ${revealedCards.has(index) ? styles.momentRevealed : ''} ${
            captionCards.has(index) ? styles.momentCaptionRevealed : ''
          }`}
          data-moment-index={index}
          style={{
            '--stagger': `${moment.stagger}vw`,
            '--lane': `${moment.lane}%`,
            '--z': moment.z,
            '--moment-accent': HIGHLIGHT_TINTS[index % HIGHLIGHT_TINTS.length],
            /* Nearer cards paint in front. Source order is arrival order,
               which would leave the first card under everything after it. */
            zIndex: Math.round(moment.z * 100),
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
