import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import styles from "../css/Board.module.css";
import heroStyles from "../css/ImmersiveHero.module.css";
import { STAR_LAYERS, scatter } from './StarField';
import { aboutValues } from '../data/aboutValues';
import { HIGHLIGHT_TINTS } from './MomentStrip';
import { NavHashLink } from 'react-router-hash-link';
import homeStyles from "../css/HomePage.module.css";
import useScrollCue from './useScrollCue';
import linkedinicon from "../images/about/linkedin_blue.png";
import websiteicon from "../images/about/web.png";
import coffeechaticon from "../images/about/coffeechat.png";
// projectLeads arrives grouped by project in the projects page's order - see
// boardMembers.js.
import { board, projectLeads, alumni } from '../data/boardMembers';
import { CURRENT_SEMESTER } from '../data/site';

/*
 * The board's sky: the hero's three layers of squares, scattered over one
 * window's height and fixed behind the page. Each layer is two copies of that
 * tile stacked, slid up by BOARD_STARS_LAG of the scroll and wrapped a tile at
 * a time, so the field never runs out however long the page gets - and, being
 * fixed, moves at only that fraction of the page's rate, the far, fine layer
 * least.
 */
const BOARD_STARS_LAG = [0.06, 0.12, 0.2];
const BOARD_STARS_SEED = 20261029;

const BOARD_STARS = STAR_LAYERS.map((layer, index) => {
  const random = scatter(BOARD_STARS_SEED + index);

  return Array.from({ length: layer.count }, () => {
    const spin = layer.spin * (0.8 + random() * 0.4);

    return {
      left: random() * 100,
      top: random() * 100,
      size: layer.size * (0.75 + random() * 0.5),
      opacity: layer.opacity * (0.7 + random() * 0.6),
      spin,
      delay: -random() * spin,
      reverse: random() < 0.5,
    };
  });
});

function BoardStars() {
  const layerRefs = useRef([]);

  useEffect(() => {
    let frameId = null;

    const measure = () => {
      frameId = null;

      layerRefs.current.forEach((layer, index) => {
        if (!layer) return;

        const tile = layer.offsetHeight / 2;
        const shift = tile ? (window.scrollY * BOARD_STARS_LAG[index]) % tile : 0;

        layer.style.transform = `translate3d(0, ${(-shift).toFixed(1)}px, 0)`;
      });
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
  }, []);

  return (
    <div className={styles.stars} aria-hidden="true">
      {BOARD_STARS.map((stars, layerIndex) => (
        <div
          key={layerIndex}
          ref={(node) => { layerRefs.current[layerIndex] = node; }}
          className={styles.starLayer}
        >
          {[0, 1].map((copy) => stars.map((star, index) => (
            <span
              key={`${copy}-${index}`}
              className={`${styles.star} ${layerIndex === 0 ? heroStyles.starFine : ''}`}
              style={{
                left: `${star.left.toFixed(2)}%`,
                top: `${(star.top / 2 + copy * 50).toFixed(2)}%`,
                '--size': `${star.size.toFixed(3)}vmin`,
              }}
            >
              <i
                className={heroStyles.starSpin}
                style={{
                  opacity: star.opacity.toFixed(3),
                  animationDuration: `${star.spin.toFixed(1)}s`,
                  animationDelay: `${star.delay.toFixed(1)}s`,
                  animationDirection: star.reverse ? 'reverse' : 'normal',
                }}
              />
            </span>
          )))}
        </div>
      ))}
    </div>
  );
}

/* As many columns as the old grid had at each width - see .columns. */
const columnCountFor = (width) => {
  if (width <= 600) return 1;
  if (width <= 900) return 2;
  if (width <= 1200) return 3;
  return 4;
};

function useColumnCount() {
  const [count, setCount] = useState(() => columnCountFor(window.innerWidth));

  useEffect(() => {
    const onResize = () => setCount(columnCountFor(window.innerWidth));

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return count;
}

/*
 * The 2nd and 4th columns (every odd index) scroll faster than the others -
 * FAST_SPEED times the page, while their grid is coming up the window - and
 * a column that travels further than its neighbours over the same scroll has
 * to be longer than them by that much, or it would run out early. So they are
 * dealt more cards.
 *
 * With n people over c columns, f of them fast, slow columns of a cards and
 * fast columns of a + k: the grid scrolls a cards' height while it comes up
 * the window, a fast column travels k cards further in that time, so
 * FAST_SPEED = 1 + k / a. With n = c·a + f·k, that is
 *
 *     k = (FAST_SPEED - 1) · n / (c + (FAST_SPEED - 1) · f)
 *
 * in cards, whatever their height. That is only a starting point - k has to
 * be whole, and what is left over after dealing has to go somewhere - so a
 * few ks either side are tried, with the leftovers given to the slow columns
 * first and to the fast ones first, and the layout kept is the one that:
 *
 *   1. is balanced - every slow column the same length, and no fast column
 *      shorter than them, so nothing is left with a gap beside it;
 *   2. then runs closest to FAST_SPEED, under FAST_SPEED_MAX. A short grid
 *      (the alumni) can only make the fast columns longer a whole card at a
 *      time, over very few rows, which would run them far faster than the
 *      rest of the page - so past the cap it gets no extra cards at all, and
 *      its fast columns keep only their half-card stagger.
 *
 * Filled row by row in reading order, so the first row is still the first
 * people listed.
 */
const FAST_SPEED = 1.2;
const FAST_SPEED_MAX = 1.35;

const isFast = (column, count) => count > 1 && column % 2 === 1;

const columnSizes = (n, count, k, slowFirst) => {
  const indices = Array.from({ length: count }, (_, column) => column);
  const fast = indices.filter((column) => isFast(column, count));
  const slow = indices.filter((column) => !isFast(column, count));
  const base = Math.floor((n - fast.length * k) / count);

  if (base < 1) return null;

  const sizes = indices.map((column) => base + (isFast(column, count) ? k : 0));
  let remainder = n - sizes.reduce((sum, size) => sum + size, 0);

  for (const column of slowFirst ? [...slow, ...fast] : [...fast, ...slow]) {
    if (remainder === 0) break;
    sizes[column] += 1;
    remainder -= 1;
  }

  const slowSizes = slow.map((column) => sizes[column]);
  const fastSizes = fast.map((column) => sizes[column]);
  const longestSlow = Math.max(...slowSizes);
  const shortestFast = Math.min(...fastSizes);
  // How many cards out of true it is: slow columns of different lengths, or
  // a fast column shorter than the slow ones.
  const imbalance =
    longestSlow - Math.min(...slowSizes) + Math.max(0, longestSlow - shortestFast);
  // What it actually comes to: the shortest fast column rises by what it has
  // over the shortest slow one, over the longest slow one's height - see
  // useColumnDrift.
  const speed = 1 + Math.max(0, shortestFast - Math.min(...slowSizes)) / longestSlow;

  return { sizes, speed, imbalance };
};

const dealColumns = (people, count) => {
  const n = people.length;
  const f = Array.from({ length: count }, (_, column) => column).filter((column) => isFast(column, count)).length;
  const ideal = f ? ((FAST_SPEED - 1) * n) / (count + (FAST_SPEED - 1) * f) : 0;
  const ks = Array.from({ length: Math.ceil(ideal) + 2 }, (_, k) => k);

  const best = ks
    .flatMap((k) => [columnSizes(n, count, k, true), columnSizes(n, count, k, false)])
    .filter((option) => option && option.speed <= FAST_SPEED_MAX)
    .sort((a, b) =>
      a.imbalance - b.imbalance || Math.abs(a.speed - FAST_SPEED) - Math.abs(b.speed - FAST_SPEED))[0];

  const sizes = best ? best.sizes : Array.from({ length: count }, (_, column) => (column < n ? 1 : 0));
  const columns = sizes.map(() => []);
  let next = 0;

  for (let row = 0; next < n; row += 1) {
    for (let column = 0; column < count && next < n; column += 1) {
      if (row < sizes[column]) columns[column].push(people[next++]);
    }
  }

  return columns;
};

/*
 * The fast columns' drift. Every column keeps the same gap between cards, and
 * a fast column starts half a card lower than its neighbours. Then, over the
 * grid's own height of scrolling from when its top reaches RISE_FROM of the
 * way down the window, it rises by however much longer than the shortest slow
 * column it is - measured, so it is right whatever the photos come to - and
 * holds there. Where the slow columns are all one length that is simply its
 * extra length; where one is a card short (the alumni), the fast columns
 * still have that card to rise by, and finish between the two. So it runs at FAST_SPEED (or near it; see dealColumns), starts
 * and ends with the same half-card stagger, and its last card never runs out
 * before the others'.
 *
 * Starting from halfway rather than from the bottom of the window keeps the
 * column from having climbed past the grid's top, over the section heading,
 * while that heading is still on screen.
 */
const RISE_FROM = 0.5;

function useColumnDrift(gridRef, enabled, layoutKey) {
  useLayoutEffect(() => {
    const grid = gridRef.current;

    if (!grid) return undefined;

    const columns = [...grid.children];
    const fast = columns.filter((column) => column.dataset.fast);
    const slow = columns.filter((column) => !column.dataset.fast);

    const reset = () => {
      fast.forEach((column) => {
        column.style.transform = '';
        column.style.marginBottom = '';
      });
      grid.style.paddingBottom = '';
    };

    if (!enabled || !fast.length) {
      reset();
      return undefined;
    }

    let frameId = null;

    const measure = () => {
      frameId = null;

      const rect = grid.getBoundingClientRect();
      const viewport = window.innerHeight;
      const tallestSlow = Math.max(0, ...slow.map((column) => column.offsetHeight));
      const shortestSlow = Math.min(tallestSlow, ...slow.map((column) => column.offsetHeight));
      const start = viewport * RISE_FROM;
      const progress = tallestSlow ? Math.min(1, Math.max(0, (start - rect.top) / tallestSlow)) : 0;
      const margin = parseFloat(window.getComputedStyle(grid).marginBottom) || 0;
      let overhang = 0;

      fast.forEach((column) => {
        const card = column.firstElementChild;
        const gap = parseFloat(window.getComputedStyle(column).rowGap) || 0;
        const half = card ? (card.offsetHeight + gap) / 2 : 0;
        const extra = Math.max(0, column.offsetHeight - shortestSlow);
        const offset = half - extra * progress;

        column.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        // The rise moves it but leaves its full length in the layout, which
        // would leave that much empty space under the grid; take it back out.
        const pull = `${(-extra).toFixed(1)}px`;

        if (column.style.marginBottom !== pull) column.style.marginBottom = pull;
        // How far below the slow columns it hangs when its bottom first comes
        // up into the window - after that it rises faster than the page, so
        // the hang only shrinks. Solved for the grid top t at which the
        // column's bottom (t + its height + half - extra·progress) meets the
        // window's bottom, less what the grid's own margin already leaves.
        const H = tallestSlow;
        const t = H
          ? (viewport - column.offsetHeight - half + (extra * start) / H) / (1 + extra / H)
          : 0;
        const seen = H ? Math.min(1, Math.max(0, (start - t) / H)) : 1;
        const rest = half + column.offsetHeight - extra - tallestSlow;

        overhang = Math.max(overhang, rest, rest + extra * (1 - seen) - margin);
      });

      // Room under the grid for a fast column hanging past the others.
      const room = `${Math.ceil(overhang)}px`;

      if (grid.style.paddingBottom !== room) grid.style.paddingBottom = room;
    };

    const schedule = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    // Photos loading change the columns' heights.
    const observer = new ResizeObserver(schedule);
    columns.forEach((column) => observer.observe(column));

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();

      if (frameId !== null) window.cancelAnimationFrame(frameId);
      reset();
    };
  }, [gridRef, enabled, layoutKey]);
}

/*
 * Raises .inView on each card the first time it comes into the window, which
 * plays its photo's blur in and its labels' highlight once and leaves them.
 */
function useRevealOnce(gridRef) {
  useEffect(() => {
    const grid = gridRef.current;

    if (!grid) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.inView);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    grid.querySelectorAll(`.${styles.person}`).forEach((card) => {
      if (!card.classList.contains(styles.inView)) observer.observe(card);
    });

    return () => observer.disconnect();
  });
}

/* Each card's highlight is one of the about page's value colours, in turn. */
const HIGHLIGHTS = aboutValues.map((value) => value.colour);

/*
 * The label that follows the cursor over a card with the person's major and
 * year: the home page's community caption, white pass then colour - see
 * MomentStrip, whose classes and tints it borrows. Written straight to the
 * element, as there: a render per pointer move would be the whole board.
 */
const TIP_FLIP_MARGIN = 260;

function useCursorTip() {
  const tipRef = useRef(null);
  const textRef = useRef(null);

  const move = (event) => {
    const tip = tipRef.current;

    if (!tip) return;

    tip.style.setProperty('--tip-x', `${event.clientX}px`);
    tip.style.setProperty('--tip-y', `${event.clientY}px`);
    tip.style.setProperty(
      '--tip-flip',
      event.clientX > window.innerWidth - TIP_FLIP_MARGIN ? 'calc(-100% - 1.7rem)' : '0%',
    );
  };

  // Taken off and put back with a layout read between, so the animation
  // re-runs moving straight from one card to the next.
  const show = (event, person, accent) => {
    const tip = tipRef.current;
    const text = [person.major, person.year].filter(Boolean).join(' · ');

    if (event.pointerType !== 'mouse' || !tip || !text) return;

    textRef.current.textContent = text;
    tip.style.setProperty('--moment-accent', accent);
    move(event);
    tip.classList.remove(heroStyles.momentTipOn, heroStyles.momentTipOut);
    tip.getBoundingClientRect();
    tip.classList.add(heroStyles.momentTipOn);
  };

  const hide = () => {
    const tip = tipRef.current;

    if (!tip || !tip.classList.contains(heroStyles.momentTipOn)) return;

    tip.classList.remove(heroStyles.momentTipOn);
    tip.getBoundingClientRect();
    tip.classList.add(heroStyles.momentTipOut);
  };

  const tip = (
    <div ref={tipRef} className={`${heroStyles.momentTip} ${styles.cursorTip}`} aria-hidden="true">
      <span ref={textRef} className={heroStyles.momentTipText} />
    </div>
  );

  return { tip, show, move, hide };
}

/*
 * The card's own hover: .hoverIn plays the wipe down to the second photo,
 * .hoverOut plays the same wipe again back to the first. Two classes with
 * animations of their own names, so swapping one for the other restarts it.
 */
const hoverCard = (event, on) => {
  if (event.pointerType !== 'mouse') return;

  const card = event.currentTarget;

  card.classList.toggle(styles.hoverIn, on);
  card.classList.toggle(styles.hoverOut, !on);
};

/*
 * The page going light for the project managers and back - the whole window,
 * not just their section. A fixed sheet of the home page's ruled paper, tied
 * to the scroll the way the home page's scene three wipes its paper up (see
 * ABOUT_WIPE_OVER in ImmersiveHero): over WIPE_OVER of a screen of scrolling,
 * eased out, the edge crosses the whole window while the page moves a fraction
 * of that.
 *
 * In: once the project managers' top is WIPE_IN_AT of the way down the window,
 * the paper's top edge comes up from below the window to past its top. Out:
 * once their bottom is WIPE_OUT_AT of the way down, the dark comes up the same
 * way behind the paper's bottom edge. Scrolled back, each runs backwards. Both
 * edges carry the home page's 4vh bow.
 *
 * Every heading, name and role on the page turns to ink while it is on the
 * paper and back to white off it (.onPaper), each line on its own, so nothing
 * is ever white on white or ink on black mid-wipe. The ruling scrolls at GRID_LAG less than the page, for the
 * home page's parallax, through the same --grid-shift.
 *
 * It also turns the header light while the paper is behind it, with the root
 * class and the --header-scrim and --header-wash the home page's hero writes
 * (see ImmersiveHero), ramped across the header's height at either edge. All
 * of it is taken off on unmount, so no other route inherits it.
 */
const WIPE_IN_AT = 0.7;
const WIPE_OUT_AT = 0.7;
const WIPE_OVER = 0.3;
const GRID_LAG = 0.4;

const easeOut = (t) => 1 - (1 - t) * (1 - t);
const clamp01 = (t) => Math.min(1, Math.max(0, t));

function useLightSheet(pageRef, sectionRef, sheetRef, moving) {
  useEffect(() => {
    const root = document.documentElement;
    let frameId = null;

    const measure = () => {
      frameId = null;

      const page = pageRef.current;
      const section = sectionRef.current;
      const sheet = sheetRef.current;

      if (!page || !section || !sheet) return;

      const viewport = window.innerHeight;
      const bow = viewport * 0.04;
      const rect = section.getBoundingClientRect();
      const wipeIn = easeOut(clamp01((viewport * WIPE_IN_AT - rect.top) / (viewport * WIPE_OVER)));
      const wipeOut = easeOut(clamp01((viewport * WIPE_OUT_AT - rect.bottom) / (viewport * WIPE_OVER)));

      // Each edge from below the window to above it.
      const below = viewport + bow;
      const sheetTop = below - (below + bow) * wipeIn;
      const sheetBottom = below - (below + bow) * wipeOut;

      sheet.style.top = `${sheetTop.toFixed(1)}px`;
      sheet.style.height = `${Math.max(0, sheetBottom - sheetTop).toFixed(1)}px`;
      sheet.style.visibility = sheetBottom - sheetTop > 0 ? 'visible' : 'hidden';
      sheet.style.setProperty(
        '--grid-shift',
        `0px ${(-sheetTop - window.scrollY * (moving ? 1 - GRID_LAG : 0)).toFixed(1)}px`,
      );

      page.querySelectorAll(`h1, h2, .${styles.name}, p.${styles.title}`).forEach((element) => {
        const box = element.getBoundingClientRect();
        const middle = box.top + box.height / 2;

        element.classList.toggle(styles.onPaper, middle > sheetTop && middle < sheetBottom);
      });

      const header = document.getElementById('header');
      const headerLine = header ? header.getBoundingClientRect().bottom : 80;
      // 0 with the paper clear of the header, 1 with it right behind it.
      const under = Math.min(
        clamp01((headerLine - sheetTop) / headerLine),
        clamp01(sheetBottom / headerLine),
      );

      root.style.setProperty('--header-scrim', (1 - under).toFixed(3));
      root.style.setProperty('--header-wash', under.toFixed(3));
      root.classList.toggle('op-light', under >= 0.5);
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
      root.classList.remove('op-light');
      root.style.removeProperty('--header-scrim');
      root.style.removeProperty('--header-wash');
    };
  }, [pageRef, sectionRef, sheetRef, moving]);
}

function ParallaxColumns({ people, renderPerson }) {
  const gridRef = useRef(null);
  const count = useColumnCount();
  const reducedMotion = useReducedMotion();
  const columns = reducedMotion ? [] : dealColumns(people, count);

  useColumnDrift(gridRef, count > 1 && !reducedMotion, `${count}:${people.length}`);
  useRevealOnce(gridRef);

  // Under reduced motion, no columns of different speeds: a plain grid, in order.
  if (reducedMotion) {
    return (
      <div ref={gridRef} className={styles.plainGrid} style={{ '--columns': count }}>
        {people.map((person, index) => renderPerson(person, index))}
      </div>
    );
  }

  return (
    <div ref={gridRef} className={styles.columns} style={{ '--columns': count }}>
      {columns.map((column, index) => (
        <div
          key={index}
          className={styles.column}
          data-fast={isFast(index, count) ? 'true' : undefined}
        >
          {column.map((person) => renderPerson(person, people.indexOf(person)))}
        </div>
      ))}
    </div>
  );
}

export default function Board() {
  const location = useLocation();
  const nextSectionRef = useRef(null);
  const pageRef = useRef(null);
  const lightRef = useRef(null);
  const sheetRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const cursorTip = useCursorTip();
  const [flashTargetId, setFlashTargetId] = useState('');
  const showScrollCue = useScrollCue();

  useLightSheet(pageRef, lightRef, sheetRef, !reducedMotion);

  useEffect(() => {
    const hashId = location.hash.replace('#', '');

    if (!hashId) {
      setFlashTargetId('');
      return undefined;
    }

    const flashTimer = window.setTimeout(() => {
      setFlashTargetId(hashId);
      window.setTimeout(() => setFlashTargetId(''), 5000);
    }, 50);

    return () => window.clearTimeout(flashTimer);
  }, [location.hash, location.pathname]);

  const toAnchorId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const renderPerson = (idPrefix = '', { caption = true } = {}) => (person, index) => (
      <div
        className={`${styles.person} ${idPrefix ? styles.anchorTarget : ''} ${flashTargetId === `${idPrefix}${toAnchorId(person.name)}` ? styles.flashTarget : ''}`}
        key={person.name}
        id={idPrefix ? `${idPrefix}${toAnchorId(person.name)}` : undefined}
        style={{ '--hl': HIGHLIGHTS[index % HIGHLIGHTS.length] }}
        onPointerEnter={(event) => {
          hoverCard(event, true);
          if (caption) cursorTip.show(event, person, HIGHLIGHT_TINTS[index % HIGHLIGHT_TINTS.length]);
        }}
        onPointerMove={caption ? cursorTip.move : undefined}
        onPointerLeave={(event) => {
          hoverCard(event, false);
          cursorTip.hide();
        }}
      >
        <div className={styles.imageWrapper}>
          <img
            className={styles.gridImage}
            src={person.image}
            alt={person.name}
          />
          {/* What the hover wipe uncovers: the person's hoverImage in
              boardMembers.js, or the first photo again if they have none. */}
          <img className={styles.altImage} src={person.hoverImage || person.image} alt="" aria-hidden="true" />

          <span className={styles.wipe} aria-hidden="true" />
        </div>
        <div className={styles.name}>
          <h3><span className={styles.flash}>{person.name}</span></h3>
          {person.link && (
            <a
              href={person.link}
              target="_blank"
              rel="noopener noreferrer"
            >
            <img
              src={
                person.link.includes("linkedin")
                  ? linkedinicon
                  : websiteicon
              }
              className={`${styles.icon}`}
              alt={`${person.name}'s profile link`}
            />
            </a>
          )}
          {person.coffee_chat && (
            <a
              href={person.coffee_chat}
              target="_blank"
              rel="noopener noreferrer"
            >
            <img
              src={
                person.coffee_chat.includes("calendly")
                  ? coffeechaticon
                  : websiteicon
              }
              className={`${styles.icon}`}
              alt={`${person.name}'s profile link`}
            />
            </a>
          )}
        </div>
            {person.title ? (
              <p className={styles.title}>
                <span className={`${styles.flash} ${styles.flashLater}`}>{person.title}</span>
              </p>
            ) : (person.project && (
              <p className={styles.title}>
                <span className={`${styles.flash} ${styles.flashLater}`}>
                {person.project.split(',').map((project) => project.trim()).map((project, index, projects) => (
                  <React.Fragment key={project}>
                    <NavHashLink
                      to={`/projects/#project-${toAnchorId(project)}`}
                      className={`${styles.title} ${styles.projectLink}`}
                      scroll={el => {
                        if (!el) return;
                        const rect = el.getBoundingClientRect();
                        const elTop = window.pageYOffset + rect.top;
                        const target = Math.max(0, elTop - (window.innerHeight / 2 - rect.height / 2));
                        window.scrollTo({ top: target, behavior: 'smooth' });
                      }}
                    >
                      {project}
                    </NavHashLink>
                    {index < projects.length - 1 ? ', ' : ''}
                  </React.Fragment>
                ))}
                </span>
              </p>
            ))}
      </div>
  );

  return (
    <div ref={pageRef}>
    <BoardStars />
    {/* The paper the page turns to for the project managers - see
        useLightSheet. Fixed, under everything but the stars. */}
    <div ref={sheetRef} className={styles.sheet} aria-hidden="true">
      <span className={heroStyles.grid} />
    </div>
    <section className={`${styles.contentSection} limitWidth`}>
      <button
        type="button"
        className={homeStyles.scrollCue}
        aria-label="Scroll down"
        onClick={() => nextSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        style={{ opacity: showScrollCue ? 1 : 0, pointerEvents: showScrollCue ? 'auto' : 'none' }}
      >
        <span className={homeStyles.scrollCueMain}>⌄</span>
        <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho1}`} aria-hidden="true">⌄</span>
        <span className={`${homeStyles.scrollCueEcho} ${homeStyles.scrollCueEcho2}`} aria-hidden="true">⌄</span>
      </button>

      <div className={styles.boardPics} id="team" ref={nextSectionRef}>
        <h1 className={heroStyles.drift1}>{CURRENT_SEMESTER} Board</h1>
        <h2>Executive Team</h2>
        <ParallaxColumns people={board} renderPerson={renderPerson()} />
      </div>
    </section>

    {/* The project managers, which the page turns light for. */}
    <section ref={lightRef} className={styles.lightSection}>
      <div className={`${styles.lightInner} limitWidth`}>
        <div className={styles.boardPics}>
          <h2>Project Managers</h2>
          <ParallaxColumns people={projectLeads} renderPerson={renderPerson('pm-')} />
        </div>
      </div>
    </section>

    {/* And back to the dark for the alumni. */}
    <section className={`${styles.darkTail} limitWidth`}>
      <div className={styles.boardPics}>
        <h2>OP Alumni</h2>
        <ParallaxColumns people={alumni} renderPerson={renderPerson('', { caption: false })} />
      </div>
    </section>

    {cursorTip.tip}
    </div>
  );
}
