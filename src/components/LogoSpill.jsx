import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

import { measureOutline } from './alphaOutline';
import { maskAt, setMask } from './PixelSwap';

/*
 * Client logos all turning into the logos of where our members work at once, and
 * all falling together to pile up at the bottom of the screen. There are more of
 * these than there are clients on screen, so the rest come up out of nothing in
 * among them.
 *
 * The falling is matter-js's: a rigid body per logo in a world with a floor
 * and two walls, stepped once a frame, with this file doing nothing but
 * deciding how big each body is, when it is let go, and where to put the
 * image that rides on it.
 *
 * It is a library rather than something written here because the hard part of
 * a pile is not the falling, it is the resting - a heap of two dozen bodies
 * leaning on each other has to lose its energy and go to sleep, and an
 * approximate solver spends that energy instead of shedding it. Written by
 * hand this behaved like a crate of springs; matter-js has a real moment of
 * inertia, sequential impulses and sleeping, and settles.
 *
 * This is also the one thing in the hero that is not a function of the
 * playhead. Everything else there can be scrubbed in both directions because
 * it is read off the scroll position. This runs on a clock, so once the scroll
 * has let it go it plays at its own speed and scrolling back up does not
 * rewind it. The floor is taken away instead, the pile drops off the bottom
 * of the stage, and only after it has faded is the world thrown away - so
 * arriving at the mark again is the spill starting over.
 */

const { Bodies, Body, Composite, Engine, Mouse, MouseConstraint, Query, Render, Sleeping } =
  Matter;

/*
 * How long the clients take to turn into the logos, and the size of the blocks
 * they break up in. Physics starts when this ends, so what falls is finished.
 */
const CHANGE_MS = 350;
const CHANGE_BLOCK = 8;
/*
 * What keeps thirty-odd masks moving at once affordable.
 *
 * Each new mask is a repaint of its element, so the change is cut into a few
 * visible steps, and only the step changing writes anything. Spread over phases,
 * so a third of the logos step on any one frame rather than all of them on the
 * same one. And a handful of patterns are shared, so most of them are already
 * built by the time they are asked for.
 */
const CHANGE_STEPS = 8;
const CHANGE_PHASES = 3;
const MASK_SEEDS = 6;
/* The pictures are drawn once at the size they appear, at no more than this many
   pixels to the CSS pixel, so that nothing re-rasterises an SVG mid-change. */
const BITMAP_MAX_DENSITY = 2;
/* For the ones with no client to come from: how many goes to find a clear spot,
   and how far above and below the middle of the screen it may be, as a share of
   the screen's height. */
const THIN_AIR_TRIES = 12;
const THIN_AIR_SPREAD = 0.16;
/*
 * Scrolling back up takes the floor away and lets the pile fall off the
 * bottom of the stage. Once every logo has cleared that edge, the linger is
 * how long it keeps being drawn before the fade, and the fade is how long
 * that takes. The limit is the same fade starting anyway, for a logo that
 * never makes it off the stage.
 */
const EXIT_LINGER = 380;
const EXIT_FADE = 420;
const EXIT_LIMIT = 2200;
/* How far above the bottom of the stage the pile stands. */
const FLOOR_INSET = 24;
/* Sideways and turning, either way, as it is let go. */
const DRIFT = 40;
const SPIN = 1.2;
/*
 * What a logo is made of.
 *
 * Barely bouncy and quite grippy, which is a piece of printed card: it lands
 * where it lands rather than skating off, and a logo coming down on a corner
 * has enough friction to tip onto its face instead of sliding out from under
 * itself. The chamfer rounds the corners by a couple of pixels, which is what
 * stops two boxes catching on each other's edges and jittering.
 */
const MATERIAL = {
  restitution: 0.12,
  friction: 0.6,
  frictionStatic: 0.9,
  frictionAir: 0.012,
  chamfer: { radius: 3 },
  density: 0.0012,
  /* Generous, so a pile that has stopped moving stops being worked out
     rather than trembling under its own weight for ever. */
  sleepThreshold: 28,
};

/* Earth-ish. matter-js scales gravity by 0.001 against pixels and
   milliseconds, so this is about 1800px per second per second. */
const GRAVITY = 1.8;

/*
 * The engine is stepped at a fixed rate whatever the frame was.
 *
 * Matter is not written to be handed a variable delta - a long frame makes it
 * jump and a varying one makes it springy - so a slow frame is caught up with
 * in whole steps of this length, and a very slow one is given up on rather
 * than caught up with at all.
 */
const STEP_MS = 1000 / 120;
const MAX_STEPS = 5;

/*
 * How far around a moving obstacle to go looking for logos to wake.
 *
 * Enough to catch something resting just on top of it as well as something it
 * is already inside, since the point is to pick a body up before it is run
 * into rather than after.
 */
const WAKE_MARGIN = 28;
/*
 * How far past a body that has just woken to go looking for the ones leaning
 * on it.
 *
 * Small, because this is meant to find things actually in contact and not to
 * wake the whole heap every time anything twitches.
 */
const NEIGHBOUR_MARGIN = 6;
/*
 * Looking under a sleeping body to see whether anything is still holding it
 * up, and how often to bother.
 *
 * The belt to the neighbour-waking braces. Passing the wake along the pile
 * works when the support leaves gently, and fails when it leaves quickly -
 * the thing that was underneath is a hundred pixels away by the next frame
 * and no margin small enough to mean "touching" will find it. Asking each
 * sleeping body directly whether it still has a floor under it does not care
 * how fast the floor left, and at a few times a second it costs nothing.
 */
const SUPPORT_PROBE = 12;
const SUPPORT_EVERY = 8;
/*
 * How long after an obstacle last moved to keep asking who has lost their
 * footing.
 *
 * Nothing can stop being supported in a world where nothing is moving, so
 * when the page is still there is nothing to look for - and looking anyway is
 * what turns a resting pile into a shivering one, since every body the check
 * is wrong about is woken, drops a pixel, sleeps, and is woken again.
 */
const SETTLE_WATCH = 90;

/*
 * The fastest a logo may be sent, in matter's own units of pixels per step.
 *
 * The panel coming up is a wall travelling at whatever speed the page is being
 * scrolled at, and a hard flick makes that very fast indeed - fast enough to
 * fire the pile into the corners of the screen. A ceiling leaves an ordinary
 * fall alone, which tops out around half of this, and only bites when
 * something has been hit harder than anything on a page ought to be.
 */
const MAX_SPEED = 26;
const MAX_TURN = 0.7;

/*
 * One logo's worth of ink, and the heights that bound it.
 *
 * Sized by area rather than by height, which is the only way a set of logos
 * ends up looking like one set. Normalised on height, a wordmark seven times
 * wider than it is tall carries seven times the ink of the roundel beside it
 * and lands in the pile like a plank among pebbles.
 *
 * It is the ink's area, not the file's. Several of these logos are drawn well
 * inside their own box - one of them fills a quarter of it - and sizing by the
 * file is what makes that one arrive a quarter the size of everything else.
 */
const LOGO_AREA = 34 * 116;
const MIN_HEIGHT = 20;
const MAX_HEIGHT = 58;

/*
 * Draw the engine's own view of the world over the top: every body exactly as
 * it is being simulated. Off unless the page is asked for with ?hitboxes, so
 * it cannot be left on by accident.
 *
 * Not matter's wireframe mode, which strokes everything in a hardcoded grey
 * that is invisible against this page. Solid rendering with a colour of our
 * own on each body comes to the same picture and can be seen.
 */
const SHOW_HITBOXES =
  typeof window !== 'undefined' && window.location.search.includes('hitbox');
/*
 * Spread in, never set to undefined.
 *
 * matter-js builds a body by extending its defaults with what it is handed,
 * and an explicit `render: undefined` is handed over - so it replaces the
 * default render object with nothing, and the next line in Body.create reads
 * fillStyle off it and throws. A key that is absent is left alone; a key that
 * is there and empty is not the same thing.
 */
const DEBUG_BODY = SHOW_HITBOXES
  ? { render: { fillStyle: 'rgba(255, 45, 85, 0.14)', strokeStyle: '#FF2D55', lineWidth: 1.5 } }
  : null;
const DEBUG_WALL = SHOW_HITBOXES
  ? {
      render: {
        fillStyle: 'rgba(90, 120, 255, 0.1)',
        strokeStyle: 'rgba(60, 90, 255, 0.5)',
        lineWidth: 1,
      },
    }
  : null;

/*
 * The smallest sliver of a traced outline worth making a body out of, in
 * square pixels.
 *
 * Ear clipping leaves the occasional needle where two corners of the trace
 * nearly coincide, and a body with no area has no inertia either - matter
 * divides by it. Dropping them changes nothing anyone can see.
 */
const MIN_PART_AREA = 4;

const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

/*
 * An obstacle is a ref, or a ref with an image to take its shape from.
 *
 * The plain form is the common one and stays plain. The object form is for
 * something whose box is not its shape - see alphaOutline.js - and the two are
 * told apart by the ref itself, which is the only object here with a current.
 */
const entryRef = (entry) => (entry && 'current' in entry ? entry : (entry?.ref ?? null));
const entryOutline = (entry) => (entry && 'current' in entry ? null : (entry?.outline ?? null));

/*
 * Where the ink is inside the file, as fractions of it, and whether that ink
 * is a round thing or a rectangular one.
 *
 * Drawn small onto a canvas and read back: it is the only way to know, and it
 * is worth knowing three times over - the logos are sized by it so that a
 * padded file is not punished for its padding, the bodies are cut to it so
 * that what collides is the shape you can see rather than the margin around
 * it, and the corners say which shape of body to cut.
 *
 * The roundness test is the corners against the middle. A roundel leaves all
 * four corners of its own box empty; a wordmark or a square mark does not.
 * It is a cheap test and it only has to be right about the one case worth
 * being right about - a circular logo given a rectangular body is a logo that
 * rests on a corner that is not there.
 *
 * Same origin, so the canvas does not taint, and it is the image the browser
 * has already fetched for the img tag below.
 */
const blocksAcross = (size) => Math.max(1, Math.round(size / CHANGE_BLOCK));

/* Whenever the page has nothing better to do, where that can be asked. */
const whenIdle = (work) => {
  if (window.requestIdleCallback) {
    const id = window.requestIdleCallback(work);

    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(work, 50);

  return () => window.clearTimeout(id);
};

/*
 * The file drawn at the size it will be shown, as a bitmap, decoded and ready.
 * Resolves to its URL, or to null if the browser would not do it, in which case
 * the original file simply stays where it is.
 */
const bake = (src, width, height) =>
  new Promise((resolve) => {
    const image = new window.Image();
    const density = Math.min(BITMAP_MAX_DENSITY, window.devicePixelRatio || 1);

    image.onerror = () => resolve(null);
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');

        canvas.width = Math.max(1, Math.ceil(width * density));
        canvas.height = Math.max(1, Math.ceil(height * density));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(null);

            return;
          }

          const url = URL.createObjectURL(blob);
          const ready = new window.Image();

          ready.src = url;
          ready.decode().then(
            () => resolve(url),
            () => {
              URL.revokeObjectURL(url);
              resolve(null);
            },
          );
        });
      } catch (error) {
        resolve(null);
      }
    };
    image.src = src;
  });

const measureInk = (src) =>
  new Promise((resolve) => {
    const whole = { x: 0, y: 0, width: 1, height: 1, aspect: 1 };
    const image = new window.Image();

    image.onload = () => {
      const naturalWidth = image.naturalWidth || 300;
      const naturalHeight = image.naturalHeight || 150;
      const scale = Math.min(1, 80 / Math.max(naturalWidth, naturalHeight));
      const width = Math.max(1, Math.round(naturalWidth * scale));
      const height = Math.max(1, Math.round(naturalHeight * scale));
      const canvas = document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d', { willReadFrequently: true });

      context.drawImage(image, 0, 0, width, height);

      try {
        const { data } = context.getImageData(0, 0, width, height);
        let left = width;
        let top = height;
        let right = -1;
        let bottom = -1;

        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            /* Anything but the faintest edge of the anti-aliasing. */
            if (data[(y * width + x) * 4 + 3] > 12) {
              if (x < left) left = x;
              if (x > right) right = x;
              if (y < top) top = y;
              if (y > bottom) bottom = y;
            }
          }
        }

        if (right < 0) {
          resolve({ ...whole, aspect: naturalWidth / naturalHeight });

          return;
        }

        const inkWidth = (right - left + 1) / width;
        const inkHeight = (bottom - top + 1) / height;
        const boxWidth = right - left + 1;
        const boxHeight = bottom - top + 1;
        /* A corner square, a fifth of the box across. */
        const reach = Math.max(2, Math.round(Math.min(boxWidth, boxHeight) * 0.2));
        let corners = 0;
        let cells = 0;

        [
          [left, top],
          [right - reach, top],
          [left, bottom - reach],
          [right - reach, bottom - reach],
        ].forEach(([cx, cy]) => {
          for (let y = cy; y < cy + reach; y += 1) {
            for (let x = cx; x < cx + reach; x += 1) {
              cells += 1;

              if (data[(y * width + x) * 4 + 3] > 12) {
                corners += 1;
              }
            }
          }
        });

        const squarish = boxWidth / boxHeight > 0.78 && boxWidth / boxHeight < 1.28;

        resolve({
          x: left / width,
          y: top / height,
          width: inkWidth,
          height: inkHeight,
          aspect: (inkWidth * naturalWidth) / (inkHeight * naturalHeight),
          round: squarish && cells > 0 && corners / cells < 0.12,
        });
      } catch {
        /* A tainted canvas: fall back to the file's own box. */
        resolve({ ...whole, aspect: naturalWidth / naturalHeight });
      }
    };

    image.onerror = () => resolve(whole);
    image.src = src;
  });

export default function LogoSpill({
  items,
  /*
   * Crossing the playhead mark lets it go. Dropping back below does not cut
   * the pile off: the floor goes and the logos fall off the bottom, and the
   * world is only thrown away once they have faded.
   */
  running,
  stageRef,
  /*
   * How long after the mark to start, in ms, and what they turn from. takeClients
   * hides all the clients and returns those on screen, as { rect, src, filtered,
   * speed }. restoreClients brings them all back.
   */
  delay = 0,
  takeClients,
  restoreClients,
  /* Per-logo multipliers on the size the area rule arrives at, keyed by src.
     Optional: anything missing is left alone. */
  scales,
  /*
   * One multiplier over the whole set, after the bounds, for a small screen:
   * the area rule is in pixels, so without it a phone got logos as big as a
   * desktop's, two and three times the size of the clients they turn from.
   */
  sizeScale = 1,
  /*
   * Things on the page the pile has to make room for, as refs to the elements
   * themselves. Each becomes a static body the size of its box, moved to
   * follow it every frame - so content that slides up from underneath shoves
   * the logos along in front of it rather than passing through them.
   *
   * An entry may instead be { ref, outline }, where outline is an image src.
   * That one collides as the shape drawn in the image rather than as its box,
   * which is what a picture with corners full of nothing needs: the logos
   * come to rest against the thing itself.
   */
  obstacleRefs,
  /* Logos to collide as a circle whatever the corner test made of them. */
  roundSet,
  className,
  logoClassName,
  debugClassName,
}) {
  const groupRef = useRef(null);
  const debugRef = useRef(null);
  const [ink, setInk] = useState(null);
  /* One entry per obstacle: its traced shape, or null for the ones that are
     happy being their own box. */
  const [outlines, setOutlines] = useState(null);
  /*
   * The loop has to see the flag change without being torn down by it, so the
   * flag lives in a ref and a run id is what actually starts a world. The id
   * only advances on the rising edge: scrolling back up keeps the world that
   * is already falling, and scrolling down again starts a new one.
   */
  const runningRef = useRef(running);
  const wasRunningRef = useRef(false);
  const [runId, setRunId] = useState(0);

  runningRef.current = running;

  useEffect(() => {
    const started = running && !wasRunningRef.current;

    wasRunningRef.current = running;

    if (started) {
      setRunId((id) => id + 1);
    }
  }, [running]);

  useEffect(() => {
    let live = true;

    Promise.all(items.map(measureInk)).then((measured) => {
      if (live) setInk(measured);
    });

    return () => {
      live = false;
    };
  }, [items]);

  /* The obstacles that collide as a picture rather than as a box, traced once.
     Nothing is built until this has answered, which costs nothing: the spill
     is a long way down the page from where the component mounts. */
  useEffect(() => {
    let live = true;

    Promise.all(
      (obstacleRefs ?? []).map((entry) => {
        const src = entryOutline(entry);

        return src ? measureOutline(src) : Promise.resolve(null);
      }),
    ).then((measured) => {
      if (live) setOutlines(measured);
    });

    return () => {
      live = false;
    };
  }, [obstacleRefs]);

  /*
   * How big each one is drawn: the same area of ink for every logo, the
   * element sized around that so the ink comes out at the size asked for
   * however much margin the file carries, and the hand correction on top.
   */
  const sized = ink
    ? ink.map((shape, index) => {
        const nudge = scales?.get(items[index]) ?? 1;
        const inkHeight =
          clamp(Math.sqrt(LOGO_AREA / shape.aspect), MIN_HEIGHT, MAX_HEIGHT) * nudge * sizeScale;
        const inkWidth = inkHeight * shape.aspect;

        return {
          ...shape,
          inkWidth,
          inkHeight,
          elementWidth: inkWidth / shape.width,
          elementHeight: inkHeight / shape.height,
        };
      })
    : null;

  useEffect(() => {
    const group = groupRef.current;

    if (!group || !sized) {
      return undefined;
    }

    const nodes = Array.from(group.children);

    nodes.forEach((node, index) => {
      node.style.width = `${sized[index].elementWidth.toFixed(1)}px`;
      node.style.height = `${sized[index].elementHeight.toFixed(1)}px`;
    });

    /*
     * Everything the change will ask for, made ahead of time and one logo at a
     * time, whenever the page has a moment: its bitmap and its masks. The first
     * frame of the change is then only ever writing what already exists.
     */
    let live = true;
    let cancel = null;
    const urls = [];
    const prepare = (index) => {
      if (!live || index >= nodes.length) {
        return;
      }

      const shape = sized[index];

      for (let step = 0; step <= CHANGE_STEPS; step += 1) {
        maskAt(
          blocksAcross(shape.elementWidth),
          blocksAcross(shape.elementHeight),
          (index % MASK_SEEDS) * 2 + 1,
          step / CHANGE_STEPS,
        );
      }

      bake(items[index], shape.elementWidth, shape.elementHeight).then((url) => {
        if (url && live) {
          urls.push(url);
          nodes[index].src = url;
        } else if (url) {
          URL.revokeObjectURL(url);
        }

        cancel = whenIdle(() => prepare(index + 1));
      });
    };

    cancel = whenIdle(() => prepare(0));

    return () => {
      live = false;
      cancel?.();
      nodes.forEach((node, index) => {
        node.src = items[index];
      });
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
    // sized is rebuilt each render; ink and the scales are what actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ink, scales, sizeScale]);

  useEffect(() => {
    const group = groupRef.current;
    const stage = stageRef.current;

    if (!runId || !group || !stage || !items.length || !sized || !outlines) {
      return undefined;
    }

    const nodes = Array.from(group.children);
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const floor = height - FLOOR_INSET;

    const engine = Engine.create({ enableSleeping: true });

    engine.gravity.y = GRAVITY;

    /*
     * The room. Thick and overhanging, because a thin wall is a wall a fast
     * body can be the other side of by the time anything looks - and these are
     * static, so the size costs nothing.
     */
    const wall = { isStatic: true, ...DEBUG_WALL };
    const walls = [
      Bodies.rectangle(width / 2, floor + 200, width + 800, 400, wall),
      Bodies.rectangle(-200, height / 2, 400, height * 3, wall),
      Bodies.rectangle(width + 200, height / 2, 400, height * 3, wall),
    ];

    Composite.add(engine.world, walls);

    const bodies = nodes.map(() => null);
    /* The changes under way: { index, start, ghost }, oldest first. */
    const changes = [];
    /* The black copies of the clients, for clearing up. */
    const ghosts = new Set();
    /* One static body per obstacle, made the first time its element has a
       size to measure, and moved to follow it from then on. */
    const obstacles = (obstacleRefs ?? []).map(() => null);
    /*
     * Where each obstacle's body sits relative to the middle of its element.
     *
     * Zero for a box, and not for a traced one: matter puts a compound body's
     * position at its centre of mass, and the middle of a star's mass is not
     * the middle of the picture it was cut out of. Carrying the difference
     * here is what keeps the shape lined up with the thing on the page.
     */
    const offsets = (obstacleRefs ?? []).map(() => ({ x: 0, y: 0 }));
    /* Whether each body was asleep at the end of the last frame, so that the
       moment one wakes can be spotted and passed on. */
    const slept = nodes.map(() => false);
    let frames = 0;
    /* Counts down from SETTLE_WATCH whenever an obstacle moves. */
    let watching = 0;
    const startAt = performance.now() + delay;
    let started = false;
    let last = null;
    let frame = null;
    /* Set the frame the floor is removed, and the frame every logo has
       cleared the bottom of the stage. */
    let exitAt = null;
    let clearedAt = null;
    let retired = false;

    /*
     * Picking one up.
     *
     * matter's own mouse constraint, which is the whole of the wrecking ball:
     * grab a logo and the pile answers for itself.
     *
     * Its listeners have to be pruned, though. Mouse.create binds the wheel
     * and calls preventDefault on it, which would stop the page scrolling
     * anywhere over the stage - and the stage is the whole screen - and binds
     * touch the same way, which would stop a phone scrolling at all. Dragging
     * is a thing to do with a cursor; scrolling has to keep working.
     */
    const mouse = Mouse.create(stage);

    ['wheel', 'DOMMouseScroll'].forEach((name) => {
      mouse.element.removeEventListener(name, mouse.mousewheel);
    });
    mouse.element.removeEventListener('touchstart', mouse.mousedown);
    mouse.element.removeEventListener('touchmove', mouse.mousemove);
    mouse.element.removeEventListener('touchend', mouse.mouseup);

    const dragging = MouseConstraint.create(engine, {
      mouse,
      /* Slack rather than rigid, so a logo swings off the cursor and carries
         its own weight into whatever it hits. */
      constraint: { stiffness: 0.1, damping: 0.02, render: { visible: false } },
    });

    Composite.add(engine.world, dragging);

    /*
     * The frame the simulation is in, which is this group and not the stage.
     *
     * The two are the same box until the page slides the pile sideways, and
     * then they are not: the group carries that move as a transform, so a logo
     * written to x = 40 is drawn wherever 40 has been carried to. Measuring
     * everything the world is told about against the group is what makes the
     * move cost the world nothing - the panel and the pile travel together and
     * the simulation never learns it happened. Against the stage, the panel
     * would arrive in the world as a wall crossing the screen and would plough
     * the whole pile into the corner.
     *
     * The mouse is bound to the stage, because that is the element with the
     * pointer on it, so it is handed the difference: an offset that turns
     * where the cursor is into where the cursor is in the world.
     */
    const readFrame = () => {
      const frameBox = group.getBoundingClientRect();
      const stageBox = stage.getBoundingClientRect();
      const offsetX = stageBox.left - frameBox.left;
      const offsetY = stageBox.top - frameBox.top;

      if (mouse.offset.x !== offsetX || mouse.offset.y !== offsetY) {
        Mouse.setOffset(mouse, { x: offsetX, y: offsetY });
      }

      return frameBox;
    };

    /* The engine's own picture of the world, drawn over the stage. */
    let render = null;

    if (SHOW_HITBOXES && debugRef.current) {
      render = Render.create({
        element: debugRef.current,
        engine,
        options: {
          width,
          height,
          /* Solid, so each body's own colour is used - see DEBUG_BODY. */
          wireframes: false,
          background: 'transparent',
          /* Off, so a settled body's box is as solid as a falling one's.
             Matter draws anything asleep at half alpha, which is useful for
             seeing whether the pile has gone quiet and useless for looking at
             the boxes afterwards - and the boxes are what this is for. */
          showSleeping: false,
        },
      });

      Render.run(render);
    }

    /* A mask of blocks at `shown`, cut to the box it is on. */
    const maskElement = (element, boxWidth, boxHeight, seed, shown) => {
      setMask(element, maskAt(blocksAcross(boxWidth), blocksAcross(boxHeight), seed, shown));
    };

    /* Where a logo's element goes for its ink to be centred on a point. */
    const logoTransform = (index, x, y) => {
      const shape = sized[index];
      const offsetX = (shape.x + shape.width / 2 - 0.5) * shape.elementWidth;
      const offsetY = (shape.y + shape.height / 2 - 0.5) * shape.elementHeight;

      return `translate(${(x - offsetX - shape.elementWidth / 2).toFixed(1)}px, ${(y - offsetY - shape.elementHeight / 2).toFixed(1)}px)`;
    };

    /* What has been placed so far this run, for keeping the rest off it. */
    const placed = [];
    const overlaps = (x, y, shape) =>
      placed.some(
        (box) =>
          Math.abs(box.x - x) < (box.width + shape.inkWidth) / 2 &&
          Math.abs(box.y - y) < (box.height + shape.inkHeight) / 2,
      );

    /*
     * Somewhere in among the ones already there: across the screen and around the
     * middle of it, where the band is, clear of the others if a few goes can find
     * it. Failing that it takes the last go, and the world sorts out the overlap.
     */
    const thinAir = (shape, middle) => {
      const edge = shape.inkWidth / 2;
      let x = 0;
      let y = 0;

      for (let go = 0; go < THIN_AIR_TRIES; go += 1) {
        x = edge + Math.random() * Math.max(0, width - edge * 2);
        y = middle + (Math.random() * 2 - 1) * height * THIN_AIR_SPREAD;

        if (!overlaps(x, y, shape)) {
          break;
        }
      }

      return { x, y };
    };

    /*
     * Where a client was, a logo goes. With no client left on screen to take its
     * place from, it comes up out of nothing in among the others.
     *
     * The row goes on moving while they change, so those on it ride along, or the
     * rest of the row would pass through them. Handed to the compositor as one
     * animation each, since where they will be is known from the start: that is
     * no work on the page for the whole of the ride.
     */
    const startChange = (index, at, client, frameBox, middle) => {
      const rect = client?.rect;
      const shape = sized[index];
      const spot = rect ? null : thinAir(shape, middle);
      const centreX = rect ? rect.left + rect.width / 2 - frameBox.left : spot.x;
      const centreY = rect ? rect.top + rect.height / 2 - frameBox.top : spot.y;
      const endX = centreX + ((client?.speed ?? 0) * CHANGE_MS) / 1000;

      placed.push({ x: centreX, y: centreY, width: shape.inkWidth, height: shape.inkHeight });

      const node = nodes[index];
      const rides = [];
      let ghost = null;

      node.style.maskSize = '100% 100%';
      node.style.webkitMaskSize = '100% 100%';
      node.style.transform = logoTransform(index, endX, centreY);
      maskElement(node, shape.elementWidth, shape.elementHeight, (index % MASK_SEEDS) * 2 + 1, 0);
      node.style.opacity = '1';

      if (rect) {
        const ghostAt = (x) =>
          `translate(${(x - rect.width / 2).toFixed(1)}px, ${(centreY - rect.height / 2).toFixed(1)}px)`;

        ghost = document.createElement('img');
        ghost.src = client.src;
        ghost.alt = '';
        ghost.className = logoClassName ?? '';
        ghost.style.width = `${rect.width.toFixed(1)}px`;
        ghost.style.height = `${rect.height.toFixed(1)}px`;
        ghost.style.maskSize = '100% 100%';
        ghost.style.webkitMaskSize = '100% 100%';
        ghost.style.transform = ghostAt(endX);

        if (client.filtered) {
          ghost.style.filter = 'brightness(0)';
        }

        group.appendChild(ghost);
        ghosts.add(ghost);
        rides.push(
          node.animate(
            [{ transform: logoTransform(index, centreX, centreY) }, { transform: logoTransform(index, endX, centreY) }],
            { duration: CHANGE_MS, easing: 'linear' },
          ),
          ghost.animate([{ transform: ghostAt(centreX) }, { transform: ghostAt(endX) }], {
            duration: CHANGE_MS,
            easing: 'linear',
          }),
        );
      }

      changes.push({
        index,
        start: at,
        ghost,
        rides,
        step: 0,
        centreX: endX,
        centreY,
        boxWidth: rect?.width,
        boxHeight: rect?.height,
      });
    };

    /* All of them, off one reading of the page: nothing here lays it out again. */
    const startChanges = (at) => {
      const clients = takeClients?.() ?? [];
      const frameBox = readFrame();
      const middle = stage.getBoundingClientRect().top + height / 2 - frameBox.top;

      nodes.forEach((_, index) => startChange(index, at, clients[index], frameBox, middle));
    };

    const clearChange = (change) => {
      change.rides.forEach((ride) => ride.cancel());
      setMask(nodes[change.index], '');

      if (change.ghost) {
        change.ghost.remove();
        ghosts.delete(change.ghost);
      }
    };

    /* The logo is all there: from here on it is the world's. */
    const letGo = (change) => {
      const { index, centreY } = change;
      const shape = sized[index];
      /* A fast scroll can carry the row a long way in the time a change takes;
         the logo still has to land inside the walls. */
      const centreX = clamp(change.centreX, shape.inkWidth / 2, width - shape.inkWidth / 2);
      const options = { ...MATERIAL, ...DEBUG_BODY };

      clearChange(change);

      /* A roundel gets a round body, whether it said so itself or was named.
         Everything else is near enough a card. */
      const body = shape.round || roundSet?.has(items[index])
        ? Bodies.circle(centreX, centreY, Math.min(shape.inkWidth, shape.inkHeight) / 2, options)
        : Bodies.rectangle(centreX, centreY, shape.inkWidth, shape.inkHeight, options);

      Body.setVelocity(body, { x: ((Math.random() * 2 - 1) * DRIFT) / 60, y: 0 });
      Body.setAngularVelocity(body, ((Math.random() * 2 - 1) * SPIN) / 60);
      Composite.add(engine.world, body);

      bodies[index] = body;
    };

    const runChanges = (now) => {
      for (let at = changes.length - 1; at >= 0; at -= 1) {
        const change = changes[at];
        const progress = (now - change.start) / CHANGE_MS;

        if (progress >= 1) {
          changes.splice(at, 1);
          letGo(change);
        } else {
          const step = Math.min(
            CHANGE_STEPS,
            Math.floor(progress * CHANGE_STEPS + (change.index % CHANGE_PHASES) / CHANGE_PHASES),
          );

          if (step !== change.step) {
            const shape = sized[change.index];
            const seed = change.index % MASK_SEEDS;

            change.step = step;
            maskElement(nodes[change.index], shape.elementWidth, shape.elementHeight, seed * 2 + 1, step / CHANGE_STEPS);

            if (change.ghost) {
              maskElement(change.ghost, change.boxWidth, change.boxHeight, seed * 2 + 2, 1 - step / CHANGE_STEPS);
            }
          }
        }
      }
    };

    const draw = (index) => {
      const body = bodies[index];

      if (!body) {
        return;
      }

      const shape = sized[index];
      const sin = Math.sin(body.angle);
      const cos = Math.cos(body.angle);
      /* The body is the ink. The element is bigger than its ink and the ink is
         not always in the middle of it, so the element's own centre is the
         body's position less that offset, turned with it. */
      const offsetX = (shape.x + shape.width / 2 - 0.5) * shape.elementWidth;
      const offsetY = (shape.y + shape.height / 2 - 0.5) * shape.elementHeight;
      const midX = body.position.x - (offsetX * cos - offsetY * sin);
      const midY = body.position.y - (offsetX * sin + offsetY * cos);

      nodes[index].style.transform = `translate(${(midX - shape.elementWidth / 2).toFixed(1)}px, ${(midY - shape.elementHeight / 2).toFixed(1)}px) rotate(${((body.angle * 180) / Math.PI).toFixed(1)}deg)`;
    };

    /*
     * Where each obstacle's element is this frame, in the world's pixels.
     *
     * Read before the stepping and then moved towards in pieces, because a
     * panel driven by the scroll can cover half the screen between two frames
     * and a wall that teleports that far does not push anything - it is simply
     * on the other side of the pile, which is what it was doing before.
     */
    const readObstacles = () => {
      const frameBox = readFrame();

      return (obstacleRefs ?? []).map((entry) => {
        const element = entryRef(entry)?.current;

        if (!element) {
          return null;
        }

        const box = element.getBoundingClientRect();

        if (box.width < 1 || box.height < 1) {
          return null;
        }

        return {
          x: box.left - frameBox.left + box.width / 2,
          y: box.top - frameBox.top + box.height / 2,
          width: box.width,
          height: box.height,
        };
      });
    };

    /*
     * One obstacle's body, the first time its element has a size to make it
     * from: a plain box, or the traced shape cut into triangles.
     *
     * The triangles are built in the element's own frame, centred on nothing
     * in particular, and the body that comes out reports where its centre of
     * mass landed. That is the offset handed back, and every move afterwards
     * is made against it. Each triangle is its own convex part, because the
     * engine resolves contacts against convex shapes only - a concave body is
     * a bag of them, and the bag is what collides like a star.
     */
    const buildObstacle = (target, outline) => {
      const options = { isStatic: true, friction: 0.4, ...DEBUG_WALL };

      if (outline) {
        const parts = [];

        outline.forEach((triangle) => {
          const points = triangle.map((point) => ({
            x: (point.x - 0.5) * target.width,
            y: (point.y - 0.5) * target.height,
          }));
          const area =
            Math.abs(
              (points[1].x - points[0].x) * (points[2].y - points[0].y) -
                (points[1].y - points[0].y) * (points[2].x - points[0].x),
            ) / 2;

          if (area < MIN_PART_AREA) {
            return;
          }

          const centreX = (points[0].x + points[1].x + points[2].x) / 3;
          const centreY = (points[0].y + points[1].y + points[2].y) / 3;

          /* Placed at its own centroid, which is where it already is: the
             piece keeps the position the trace gave it. */
          parts.push(Bodies.fromVertices(centreX, centreY, [points], options));
        });

        if (parts.length) {
          const body = parts.length === 1 ? parts[0] : Body.create({ parts, ...options });

          return { body, offset: { x: body.position.x, y: body.position.y } };
        }
      }

      return {
        body: Bodies.rectangle(target.x, target.y, target.width, target.height, options),
        offset: { x: 0, y: 0 },
      };
    };

    /*
     * Carrying the obstacles part of the way to where their elements are.
     *
     * The third argument to setPosition is the one that matters: it works the
     * velocity out from the move and hangs it on the body, so a static wall
     * arrives at a contact already going somewhere and the impulse is resolved
     * as a push rather than as something to be squeezed out of.
     */
    const moveObstacles = (targets, through) => {
      targets.forEach((target, index) => {
        if (!target) {
          return;
        }

        if (!obstacles[index]) {
          const built = buildObstacle(target, outlines[index]);

          obstacles[index] = built.body;
          offsets[index] = built.offset;
          Body.setPosition(built.body, {
            x: target.x + built.offset.x,
            y: target.y + built.offset.y,
          });
          Composite.add(engine.world, built.body);

          return;
        }

        const obstacle = obstacles[index];
        const offset = offsets[index];
        const from = obstacle.position;
        const toX = from.x + (target.x + offset.x - from.x) * through;
        const toY = from.y + (target.y + offset.y - from.y) * through;

        if (Math.abs(toX - from.x) < 0.05 && Math.abs(toY - from.y) < 0.05) {
          /*
           * Stopped - and told so.
           *
           * setPosition's third argument works a velocity out from the move
           * and hangs it on the body, and a static body never integrates, so
           * that velocity stays on it for ever once the moving stops. Every
           * contact with it then resolves as though the wall were still
           * travelling, which is a pile that shivers against it and never
           * settles. Clearing it is the difference between a wall that has
           * arrived and one that is permanently about to.
           */
          if (obstacle.velocity.x || obstacle.velocity.y) {
            Body.setVelocity(obstacle, { x: 0, y: 0 });
          }

          return;
        }

        watching = SETTLE_WATCH;

        Body.setPosition(obstacle, { x: toX, y: toY }, true);

        /*
         * And wake everything it has passed through, or moved out from under.
         *
         * matter will not do this itself: Sleeping.afterCollisions skips any
         * pair with a static body in it, so a wall moving into a logo that has
         * gone to sleep passes straight through and leaves it hanging there.
         *
         * The region is swept rather than taken where the wall ended up. A
         * wall retreating is the harder case of the two - nothing is hit, a
         * support simply stops being there - and looking only at the new
         * position misses every body that was standing on the old one.
         */
        const { bounds } = obstacle;
        const spreadX = WAKE_MARGIN + Math.abs(toX - from.x);
        const spreadY = WAKE_MARGIN + Math.abs(toY - from.y);
        const region = {
          min: { x: bounds.min.x - spreadX, y: bounds.min.y - spreadY },
          max: { x: bounds.max.x + spreadX, y: bounds.max.y + spreadY },
        };

        Query.region(bodies.filter(Boolean), region).forEach((body) => {
          if (body.isSleeping) {
            Sleeping.set(body, false);
          }
        });
      });
    };

    const tick = (now) => {
      const elapsed = last === null ? 0 : now - last;

      last = now;
      const used = Math.min(elapsed, STEP_MS * MAX_STEPS);

      /*
       * The floor leaving is the end of the spill, not a pause in it. Nothing
       * further is let out, the floor and the obstacles go - the community
       * panel sits parked just under the fold and would otherwise be a second
       * floor - and anything asleep is woken so gravity can take it.
       */
      if (!runningRef.current && exitAt === null) {
        /* Whatever was still changing goes with the clients it came from. */
        changes.splice(0).forEach((change) => {
          clearChange(change);
          nodes[change.index].style.opacity = '0';
        });

        if (started) {
          restoreClients?.();
        }

        if (bodies.every((body) => !body)) {
          retire();

          return;
        }

        exitAt = now;
        Composite.remove(engine.world, walls[0]);
        obstacles.forEach((obstacle, index) => {
          if (!obstacle) {
            return;
          }

          Composite.remove(engine.world, obstacle);
          obstacles[index] = null;
        });
        bodies.forEach((body) => {
          if (body && body.isSleeping) {
            Sleeping.set(body, false);
          }
        });
      }

      if (exitAt === null && !started && now >= startAt) {
        started = true;
        startChanges(now);
      }

      if (changes.length) {
        runChanges(now);
      }

      const targets = exitAt === null ? readObstacles() : null;
      const steps = clamp(Math.round(used / STEP_MS), 1, MAX_STEPS);

      for (let step = 0; step < steps; step += 1) {
        /* An equal share of what is left each time, so the wall arrives over
           the whole frame rather than at the start of it. Once the floor has
           gone there is nothing on the page the pile should land on. */
        if (targets) {
          moveObstacles(targets, 1 / (steps - step));
        }

        Engine.update(engine, STEP_MS);

        for (let index = 0; index < bodies.length; index += 1) {
          const body = bodies[index];

          if (!body || body.isSleeping) {
            continue;
          }

          if (body.speed > MAX_SPEED) {
            const scale = MAX_SPEED / body.speed;

            Body.setVelocity(body, {
              x: body.velocity.x * scale,
              y: body.velocity.y * scale,
            });
          }

          if (Math.abs(body.angularVelocity) > MAX_TURN) {
            Body.setAngularVelocity(body, Math.sign(body.angularVelocity) * MAX_TURN);
          }
        }
      }

      /*
       * Anything asleep with nothing underneath it any more.
       *
       * matter sleeps each body on its own and has no notion of support, so a
       * logo whose neighbour has been carried off stays exactly where it was,
       * in the air. This looks for a floor: the stage's own, or any body or
       * obstacle in a thin strip beneath it. Finding none, it drops it.
       */
      frames += 1;

      if (watching > 0) {
        watching -= 1;
      }

      /*
       * While the floor is gone this keeps running even if nothing else is
       * moving: a logo that nods off on the way down has to be asked whether
       * anything is still under it, and the old floor line is not an answer.
       */
      if ((exitAt !== null || watching > 0) && frames % SUPPORT_EVERY === 0) {
        const everything = bodies.filter(Boolean).concat(obstacles.filter(Boolean));

        for (let index = 0; index < bodies.length; index += 1) {
          const body = bodies[index];

          if (!body || !body.isSleeping) {
            continue;
          }

          if (exitAt === null && body.bounds.max.y >= floor - SUPPORT_PROBE) {
            continue;
          }

          const under = {
            /* Inset a little, so two bodies merely side by side are not read
               as one standing on the other. */
            min: { x: body.bounds.min.x + 2, y: body.bounds.max.y },
            max: { x: body.bounds.max.x - 2, y: body.bounds.max.y + SUPPORT_PROBE },
          };
          const holding = Query.region(everything, under).filter((other) => other !== body);

          if (!holding.length) {
            Sleeping.set(body, false);
          }
        }
      }

      /*
       * Waking spreads to whatever was leaning on the waker.
       *
       * matter sleeps each body on its own: it has no notion of an island of
       * bodies that are touching and should go to sleep and wake as one. So a
       * logo resting on another is never told when the one underneath gets up
       * and walks off - nothing collides with it, it is simply unsupported -
       * and it stays asleep in mid-air.
       *
       * Catching the moment a body wakes and waking its neighbours is the
       * cheap version of an island. It costs a frame to travel each layer of
       * the pile, which is not something anyone can see, and it only fires on
       * the transition rather than for as long as something is awake.
       */
      for (let index = 0; index < bodies.length; index += 1) {
        const body = bodies[index];

        if (!body) {
          continue;
        }

        if (slept[index] && !body.isSleeping) {
          const { bounds } = body;
          const around = {
            min: { x: bounds.min.x - NEIGHBOUR_MARGIN, y: bounds.min.y - NEIGHBOUR_MARGIN },
            max: { x: bounds.max.x + NEIGHBOUR_MARGIN, y: bounds.max.y + NEIGHBOUR_MARGIN },
          };

          Query.region(bodies.filter(Boolean), around).forEach((neighbour) => {
            if (neighbour !== body && neighbour.isSleeping) {
              Sleeping.set(neighbour, false);
            }
          });
        }

        slept[index] = body.isSleeping;
      }

      for (let index = 0; index < bodies.length; index += 1) {
        /* A sleeping body is not going anywhere, so it does not need
           writing out again. */
        if (bodies[index] && !bodies[index].isSleeping) {
          draw(index);
        }
      }

      /*
       * Off the bottom, then a beat, then the fade, then the world stops.
       * The beat is what keeps the last logo from being faded while it is
       * still crossing the edge. Past the limit the fade starts anyway.
       */
      let leave = 0;

      if (exitAt !== null) {
        if (clearedAt === null) {
          const gone = bodies.every((body) => !body || body.bounds.min.y > height);

          if (gone || now - exitAt > EXIT_LIMIT) {
            clearedAt = now;
          }
        }

        if (clearedAt !== null) {
          leave = clamp((now - clearedAt - EXIT_LINGER) / EXIT_FADE, 0, 1);
        }
      }

      if (leave > 0) {
        for (let index = 0; index < bodies.length; index += 1) {
          if (bodies[index]) {
            nodes[index].style.opacity = (1 - leave).toFixed(3);
          }
        }
      }

      if (leave >= 1) {
        retire();

        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    /*
     * Thrown away once, from the fade finishing or from the effect going
     * away. Arriving at the mark again builds a new world rather than
     * resuming this one.
     */
    const retire = () => {
      if (retired) {
        return;
      }

      retired = true;
      window.cancelAnimationFrame(frame);

      if (render) {
        Render.stop(render);
        render.canvas.remove();
        render.textures = {};
      }

      Composite.clear(engine.world, false);
      Engine.clear(engine);
      ghosts.forEach((ghost) => ghost.remove());
      ghosts.clear();
      nodes.forEach((node) => {
        setMask(node, '');
        node.style.opacity = '0';
        node.style.transform = '';
      });
    };

    frame = window.requestAnimationFrame(tick);

    return retire;
    // sized is rebuilt each render; ink and the scales are what actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, items, stageRef, delay, takeClients, restoreClients, logoClassName, ink, scales, sizeScale, obstacleRefs, outlines, roundSet]);

  if (!items.length) {
    return null;
  }

  return (
    <>
      <div ref={groupRef} className={className} aria-hidden="true">
        {items.map((src, index) => (
          <img
            /* eslint-disable-next-line react/no-array-index-key */
            key={index}
            className={logoClassName}
            src={src}
            alt=""
            style={{ opacity: 0 }}
          />
        ))}
      </div>

      {SHOW_HITBOXES && <div ref={debugRef} className={debugClassName} aria-hidden="true" />}
    </>
  );
}