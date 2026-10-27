import { useEffect, useRef, useState } from 'react';
import styles from '../css/ImmersiveHero.module.css';
import { communityMoments } from '../data/communityMoments';

/*
 * The strip of club life that comes past at the end of the hero.
 *
 * It travels on the hero's own `--pan`. Each card is given its three layout
 * numbers once - where it waits, which lane it is in and how near it is - and
 * the crossing itself is then one variable on the stage moving, with the
 * compositor carrying all forty-six off the same value. The sideways drift
 * against the pointer is the same trick: a mousemove writes two numbers on
 * the container and every card reads them out of the declaration it already
 * reads the pan from, so the drift costs two property writes per event
 * rather than forty-six transforms. It is a shift and nothing else - no
 * lean, no blur.
 *
 * Nothing here is React state except the arrival latch: a hover that
 * re-rendered the strip would rebuild forty-six cards to change one word.
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

/* How close to the right edge the label flips to the other side of the
   cursor. Roughly the width of the longest caption plus its padding: past
   this point a label laid out rightwards would run off the screen. */
const TIP_FLIP_MARGIN = 260;

/*
 * The trail the pointer leaves, which pixelates the pictures it crosses.
 *
 *   TRAIL_LIFE        how long a point of it lasts, in ms
 *   TRAIL_MIN_RADIUS  how far a point reaches when the pointer has barely
 *                     moved, in px - about one block, so a nudge leaves a
 *                     square or two rather than a full blot
 *   TRAIL_RADIUS      how far it reaches at full stride, in px; every point
 *                     shrinks towards a third of its own reach as it ages
 *   TRAIL_FULL_SPEED  the pointer speed that earns the full reach, in px/ms
 *   TRAIL_RAMP        how long a stroke has to keep going before it can
 *                     reach that far, in ms, so even a flick starts thin
 *   TRAIL_PAUSE       a gap between mouse events longer than this, in ms,
 *                     ends the stroke and the next one starts thin again
 *   TRAIL_BLOCK       the size of one pixel of it, in px - roughly, since
 *                     each picture rounds it to whatever divides it into
 *                     whole blocks
 *   TRAIL_SPACING     the most distance a fast stroke leaves between two
 *                     points before the gap is filled in, in px
 *   TRAIL_STEPS       how many levels of opacity it fades out through - a
 *                     few, so it goes out in steps like the blocks it is
 *                     made of
 *   TRAIL_OUTLINE     the strongest the white edge round each block gets; it
 *                     rises from nothing and falls back over the block's
 *                     life, peaking halfway
 */
const TRAIL_LIFE = 700;
const TRAIL_MIN_RADIUS = 14;
const TRAIL_RADIUS = 80;
const TRAIL_FULL_SPEED = 1.4;
const TRAIL_RAMP = 450;
const TRAIL_PAUSE = 150;
const TRAIL_BLOCK = 20;
const TRAIL_SPACING = 16;
const TRAIL_STEPS = 4;
const TRAIL_OUTLINE = 0.35;

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);
const smoothstep = (value) => {
  const t = clamp01(value);

  return t * t * (3 - 2 * t);
};

export default function MomentStrip() {
  const rootRef = useRef(null);
  const tipRef = useRef(null);
  const tipTextRef = useRef(null);
  const trailRef = useRef(null);
  const cardRefs = useRef(new Map());
  const videoRefs = useRef(new Map());
  const mediaRefs = useRef(new Map());
  const [revealedCards, setRevealedCards] = useState(() => new Set());

  /* The stage's CSS transform moves these cards, so the observer sees their
     first entry without a second scroll listener. A card only has to be
     caught arriving once - the blur comes off and stays off - so it is
     released as soon as it has been seen. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number(entry.target.dataset.momentIndex);

          if (!communityMoments[index]) return;

          setRevealedCards((current) => {
            if (current.has(index)) return current;

            const next = new Set(current);
            next.add(index);
            return next;
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );

    cardRefs.current.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  /*
   * The clips play only while their card is in shot.
   *
   * Separate from the observer above, which lets a card go the moment it has
   * been seen: a video has to be watched the whole way past, because the half
   * of this that matters is the pause. They are `preload="none"`, so the
   * first play is also the first byte fetched - until then the card is its
   * poster - and a clip that has gone by stops decoding instead of running
   * for the rest of the timeline behind everything else.
   *
   * play() rejects rather than throws when the browser declines to start one,
   * which is routine here: it is the call arriving before the metadata, or a
   * clip the browser will not decode at all. The card keeps its poster either
   * way, so there is nothing to do with the rejection but swallow it.
   */
  useEffect(() => {
    const videos = videoRefs.current;

    if (videos.size === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const started = entry.target.play();

            if (started) started.catch(() => {});
          } else {
            entry.target.pause();
          }
        });
      },
      { threshold: 0.01 },
    );

    videos.forEach((video) => observer.observe(video));

    return () => observer.disconnect();
  }, []);

  /*
   * One listener for both things the pointer does here.
   *
   * --mx and --my are the cursor as a fraction of the screen from its middle,
   * -1 to 1, which is all the cards need: the depth is theirs already, so the
   * drift is that number times their own z and the near cards shift further
   * than the far ones without being told about each other. Left at 0 for
   * anyone who has asked for less motion.
   *
   * The label is carried on the same event. It is written as coordinates rather than left/top so that moving it is a
   * transform and not a layout, and it reads clientX/clientY straight because
   * the stage sets no transform of its own - a fixed child of it is therefore
   * fixed to the window, which is also what lets the label out of the stage's
   * overflow: hidden.
   */
  useEffect(() => {
    const root = rootRef.current;
    const tip = tipRef.current;

    if (!root || !tip) return undefined;

    const drift = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMove = (event) => {
      if (drift) {
        root.style.setProperty('--mx', ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        root.style.setProperty('--my', ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      }
      tip.style.setProperty('--tip-x', `${event.clientX}px`);
      tip.style.setProperty('--tip-y', `${event.clientY}px`);
      tip.style.setProperty(
        '--tip-flip',
        event.clientX > window.innerWidth - TIP_FLIP_MARGIN ? '-100%' : '0%',
      );
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /*
   * The pixel trail.
   *
   * There is no pixelate filter in CSS, so it is drawn, onto one canvas over
   * the cards. Every picture gets a grid of its own, laid from its own top
   * left corner: as many blocks across and down as come nearest to
   * TRAIL_BLOCK, stretched a little so they divide the picture exactly. So a
   * block never hangs off a picture's edge and never stops short of it, and
   * a near card's blocks are bigger on the glass than a far card's, the way
   * everything else about it is.
   *
   * Each frame, for each picture the trail touches: the picture is drawn
   * into a scratch canvas one pixel per block, which is the pixelating; each
   * block the trail covers is then stretched back up from its pixel onto the
   * page, clipped to the picture's rounded corners. Far pictures go first,
   * and each nearer one first clears its own box, so a far card's blocks
   * cannot show through a nearer card that is lying over it.
   *
   * The loop runs only while some of the trail is still alive, so a still
   * pointer costs nothing a moment after it stops. The cards it looks at are
   * the ones an IntersectionObserver says are in shot - about eight of the
   * forty-six - and each is measured through its picture's own rect, which
   * already has the pan and the card's scale in it.
   *
   * Off for touch, which has no pointer to leave a trail, and for anyone who
   * has asked for less motion.
   */
  useEffect(() => {
    const canvas = trailRef.current;

    if (!canvas) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const context = canvas.getContext('2d');
    const scratch = document.createElement('canvas');
    const scratchContext = scratch.getContext('2d');
    const cards = cardRefs.current;
    const media = mediaRefs.current;
    const corners = new Map();
    const onScreen = new Set();
    const points = [];
    let last = null;
    let strokeStart = 0;
    let speed = 0;
    let frame = 0;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    };

    /* The picture's corner radius as the stylesheet gives it, read once:
       it does not change, and on the glass it is scaled with the card. */
    const cornerOf = (index, source) => {
      if (!corners.has(index)) {
        corners.set(index, Number.parseFloat(window.getComputedStyle(source).borderRadius) || 0);
      }

      return corners.get(index);
    };

    /* object-fit: cover, done by hand: the middle of the source at the
       picture's own aspect ratio, so the blocks show the crop it shows. */
    const drawCover = (source, sourceWidth, sourceHeight, width, height) => {
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      const cropWidth = width / scale;
      const cropHeight = height / scale;

      scratchContext.drawImage(
        source,
        (sourceWidth - cropWidth) / 2,
        (sourceHeight - cropHeight) / 2,
        cropWidth,
        cropHeight,
        0,
        0,
        width,
        height,
      );
    };

    /* Which of a picture's blocks the trail covers, each as alive as the
       freshest point that reaches it. A point counts for a block if the
       block's centre is within its reach, and always for the block it is in,
       or a point narrower than a block would fall between centres and leave
       nothing. Points that cannot reach the picture are passed over. */
    const coverage = (rect, columns, rows, now) => {
      const blockWidth = rect.width / columns;
      const blockHeight = rect.height / rows;
      const lives = new Float32Array(columns * rows);
      let any = false;

      points.forEach(({ x, y, t, reach: radius }) => {
        const life = 1 - (now - t) / TRAIL_LIFE;
        const reach = radius * (0.35 + 0.65 * life);
        const localX = x - rect.left;
        const localY = y - rect.top;

        if (localX < -reach || localY < -reach) return;
        if (localX > rect.width + reach || localY > rect.height + reach) return;

        const homeColumn = Math.floor(localX / blockWidth);
        const homeRow = Math.floor(localY / blockHeight);
        const top = Math.max(0, Math.floor((localY - reach) / blockHeight));
        const bottom = Math.min(rows - 1, Math.floor((localY + reach) / blockHeight));
        const left = Math.max(0, Math.floor((localX - reach) / blockWidth));
        const right = Math.min(columns - 1, Math.floor((localX + reach) / blockWidth));

        for (let row = top; row <= bottom; row += 1) {
          for (let column = left; column <= right; column += 1) {
            const home = row === homeRow && column === homeColumn;
            const centreX = (column + 0.5) * blockWidth;
            const centreY = (row + 0.5) * blockHeight;

            if (!home && Math.hypot(centreX - localX, centreY - localY) > reach) continue;

            const key = row * columns + column;

            if (lives[key] < life) {
              lives[key] = life;
              any = true;
            }
          }
        }
      });

      return any ? lives : null;
    };

    const tick = (now) => {
      frame = 0;

      while (points.length && now - points[0].t > TRAIL_LIFE) points.shift();

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (points.length === 0) {
        last = null;
        return;
      }

      const origin = canvas.getBoundingClientRect();
      const ratio = canvas.width / origin.width;

      /* Far ones first, so the near ones cover them where they overlap, as
         they do on the page. A card still blurred out of sight has nothing
         to show yet, and a clip that has not decoded a frame would draw as
         nothing anyway. */
      const shots = [];

      onScreen.forEach((index) => {
        const card = cards.get(index);
        const source = media.get(index);

        if (!card || !source || !card.classList.contains(styles.momentRevealed)) return;
        if (source.tagName === 'VIDEO' && source.readyState < 2) return;

        const sourceWidth = source.videoWidth || source.naturalWidth;
        const sourceHeight = source.videoHeight || source.naturalHeight;
        const rect = source.getBoundingClientRect();

        if (!sourceWidth || !sourceHeight || !rect.width || !rect.height) return;

        shots.push({
          index,
          source,
          sourceWidth,
          sourceHeight,
          rect,
          scale: rect.width / (source.offsetWidth || rect.width),
          z: communityMoments[index]?.z ?? 1,
        });
      });

      shots.sort((a, b) => a.z - b.z);

      context.imageSmoothingEnabled = false;
      context.lineWidth = ratio;

      shots.forEach(({ index, source, sourceWidth, sourceHeight, rect, scale }) => {
        const x = (rect.left - origin.left) * ratio;
        const y = (rect.top - origin.top) * ratio;
        const width = rect.width * ratio;
        const height = rect.height * ratio;
        const corner = cornerOf(index, source) * scale * ratio;

        context.save();
        context.beginPath();
        context.roundRect(x, y, width, height, corner);
        context.clip();

        /* Whatever a farther card left here is under this one on the page. */
        context.clearRect(x, y, width, height);

        const columns = Math.max(1, Math.round(rect.width / TRAIL_BLOCK));
        const rows = Math.max(1, Math.round(rect.height / TRAIL_BLOCK));
        const lives = coverage(rect, columns, rows, now);

        if (lives) {
          scratch.width = columns;
          scratch.height = rows;
          drawCover(source, sourceWidth, sourceHeight, columns, rows);

          const blockWidth = width / columns;
          const blockHeight = height / rows;

          lives.forEach((life, key) => {
            if (life <= 0) return;

            const column = key % columns;
            const row = Math.floor(key / columns);
            const left = x + column * blockWidth;
            const top = y + row * blockHeight;

            context.globalAlpha = Math.ceil(life * TRAIL_STEPS) / TRAIL_STEPS;
            context.drawImage(scratch, column, row, 1, 1, left, top, blockWidth, blockHeight);

            /* A thin white edge round the block, rising from nothing and
               falling back over its life. */
            const strength = TRAIL_OUTLINE * Math.sin(Math.PI * life);

            if (strength >= 0.02) {
              context.globalAlpha = 1;
              context.strokeStyle = `rgba(255, 255, 255, ${strength.toFixed(3)})`;
              context.strokeRect(
                left + ratio / 2,
                top + ratio / 2,
                blockWidth - ratio,
                blockHeight - ratio,
              );
            }
          });
        }

        context.restore();
      });

      frame = requestAnimationFrame(tick);
    };

    /*
     * How far a new point reaches comes from the stroke so far, not from the
     * one event: the pointer's speed, smoothed so one jittery report cannot
     * throw out a blot, times how long the stroke has been going. Either one
     * alone gets it wrong - speed alone makes a flick fat from its first
     * pixel, and time alone makes a slow drift as wide as a sweep.
     */
    const reachFor = (now, distance, elapsed) => {
      if (!last || elapsed > TRAIL_PAUSE) {
        strokeStart = now;
        speed = 0;
      } else if (elapsed > 0) {
        const settle = 1 - Math.exp(-elapsed / 80);

        speed += (distance / elapsed - speed) * settle;
      }

      /* The root lifts the low end: an easy drift should widen a little, not
         sit at the minimum until the pointer is nearly at full speed. */
      const stride = smoothstep(Math.sqrt(speed / TRAIL_FULL_SPEED));
      const ramp = smoothstep((now - strokeStart) / TRAIL_RAMP);

      return TRAIL_MIN_RADIUS + (TRAIL_RADIUS - TRAIL_MIN_RADIUS) * stride * ramp;
    };

    /* A fast stroke reports points far apart, and drawn as they come the
       trail would be a row of separate dots. The gap is filled with points
       of the ages and reaches they would have had, so the stroke tapers along
       its length the way a slow one does. */
    const onMove = (event) => {
      if (onScreen.size === 0) return;

      const now = performance.now();
      const x = event.clientX;
      const y = event.clientY;
      const distance = last ? Math.hypot(x - last.x, y - last.y) : 0;
      const elapsed = last ? now - last.t : Infinity;
      const reach = reachFor(now, distance, elapsed);

      if (last && elapsed <= TRAIL_PAUSE) {
        const steps = Math.floor(distance / TRAIL_SPACING);

        for (let step = 1; step < steps; step += 1) {
          const k = step / steps;

          points.push({
            x: last.x + (x - last.x) * k,
            y: last.y + (y - last.y) * k,
            t: last.t + (now - last.t) * k,
            reach: last.reach + (reach - last.reach) * k,
          });
        }
      }

      points.push({ x, y, t: now, reach });
      last = { x, y, t: now, reach };

      if (!frame) frame = requestAnimationFrame(tick);
    };

    /* Coming back in somewhere else should not draw a streak across the
       strip from where the pointer went out. */
    const onLeave = () => {
      last = null;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.momentIndex);

          if (entry.isIntersecting) onScreen.add(index);
          else onScreen.delete(index);
        });
      },
      { threshold: 0 },
    );
    const resizer = new ResizeObserver(resize);

    cards.forEach((card) => observer.observe(card));
    resizer.observe(canvas);
    resize();
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      observer.disconnect();
      resizer.disconnect();
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /*
   * Both passes are CSS animations rather than transitions, because arriving
   * and leaving end on different clips - one finishes full, the other
   * finishes wiped off the right - and a transition can only go back the way
   * it came. An animation re-runs only if it is taken off and put back on
   * with a layout read in between, which is what the getBoundingClientRect
   * is for: without it, moving straight from one card to the next would
   * change the word and leave the label sitting there.
   */
  const showTip = (caption, accent) => {
    const tip = tipRef.current;
    const text = tipTextRef.current;

    if (!tip || !text) return;

    text.textContent = caption;
    tip.style.setProperty('--moment-accent', accent);
    tip.classList.remove(styles.momentTipOn, styles.momentTipOut);
    tip.getBoundingClientRect();
    tip.classList.add(styles.momentTipOn);
  };

  const hideTip = () => {
    const tip = tipRef.current;

    if (!tip || !tip.classList.contains(styles.momentTipOn)) return;

    tip.classList.remove(styles.momentTipOn);
    tip.getBoundingClientRect();
    tip.classList.add(styles.momentTipOut);
  };

  return (
    /* Decoration, like the rest of the hero: the club's own words about its
       community are in the section below, where a reader is handed them. */
    <div className={styles.moments} ref={rootRef} aria-hidden="true">
      {communityMoments.map((moment, index) => {
        const accent = HIGHLIGHT_TINTS[index % HIGHLIGHT_TINTS.length];

        return (
          <figure
            key={moment.video || moment.image || index}
            ref={(card) => {
              if (card) cardRefs.current.set(index, card);
              else cardRefs.current.delete(index);
            }}
            className={`${styles.moment} ${revealedCards.has(index) ? styles.momentRevealed : ''}`}
            data-moment-index={index}
            onMouseEnter={() => showTip(moment.caption, accent)}
            onMouseLeave={hideTip}
            style={{
              '--stagger': `${moment.stagger}vw`,
              '--lane': `${moment.lane}%`,
              '--z': moment.z,
              /* Nearer cards paint in front. Source order is arrival order,
                 which would leave the first card under everything after it. */
              zIndex: Math.round(moment.z * 100),
            }}
          >
            {moment.video ? (
              /* Muted and inline are what make an autoplay allowed at all,
                 and a clip with a soundtrack nobody asked for would be worse
                 than one with none: the audio is stripped from the file. */
              <video
                ref={(video) => {
                  if (video) {
                    videoRefs.current.set(index, video);
                    mediaRefs.current.set(index, video);
                  } else {
                    videoRefs.current.delete(index);
                    mediaRefs.current.delete(index);
                  }
                }}
                className={styles.momentImage}
                src={moment.video}
                poster={moment.poster}
                preload="none"
                muted
                loop
                playsInline
                disablePictureInPicture
              />
            ) : moment.image ? (
              <img
                ref={(image) => {
                  if (image) mediaRefs.current.set(index, image);
                  else mediaRefs.current.delete(index);
                }}
                className={styles.momentImage}
                src={moment.image}
                alt=""
              />
            ) : (
              <div
                className={styles.momentBlank}
                style={{ backgroundColor: TINTS[index % TINTS.length] }}
              />
            )}
          </figure>
        );
      })}

      <canvas ref={trailRef} className={styles.momentTrail} />

      {/* One label for the whole strip, parked at the window's top left until
          a card is under the cursor and the transform carries it there. */}
      <div ref={tipRef} className={styles.momentTip}>
        <span ref={tipTextRef} className={styles.momentTipText} />
      </div>
    </div>
  );
}
