import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

/*
 * Logos tipping out of the banner and piling up at the bottom of the screen.
 *
 * The falling is matter-js's: a rigid body per logo in a world with a floor
 * and two walls, stepped once a frame, with this file doing nothing but
 * deciding how big each body is, when it is dropped in, and where to put the
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
 * it is read off the scroll position; this runs on a clock, so once the scroll
 * has let it go it plays at its own speed and scrolling back up does not
 * rewind it - it resets and plays again from the top.
 */

const { Bodies, Body, Composite, Engine, Mouse, MouseConstraint, Query, Render, Sleeping } =
  Matter;

/* How often the next logo is let out of the banner. */
const SPAWN_EVERY = 110;
/* How far above the bottom of the stage the pile stands. */
const FLOOR_INSET = 24;
/* Sideways and turning, either way, as it leaves the banner. */
const DRIFT = 90;
const SPIN = 2.4;

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

const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

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
  /* Crossing the playhead mark lets it go; dropping back below clears it. */
  running,
  stageRef,
  /*
   * What the logos fall out of. Its underside is the spawn line and its width
   * is the spread they spawn across, so the banner can be moving while they
   * are arriving without any of that being passed in as numbers.
   */
  originRef,
  /* Per-logo multipliers on the size the area rule arrives at, keyed by src.
     Optional: anything missing is left alone. */
  scales,
  /*
   * Things on the page the pile has to make room for, as refs to the elements
   * themselves. Each becomes a static body the size of its box, moved to
   * follow it every frame - so content that slides up from underneath shoves
   * the logos along in front of it rather than passing through them.
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

  useEffect(() => {
    let live = true;

    Promise.all(items.map(measureInk)).then((measured) => {
      if (live) setInk(measured);
    });

    return () => {
      live = false;
    };
  }, [items]);

  /*
   * How big each one is drawn: the same area of ink for every logo, the
   * element sized around that so the ink comes out at the size asked for
   * however much margin the file carries, and the hand correction on top.
   */
  const sized = ink
    ? ink.map((shape, index) => {
        const nudge = scales?.get(items[index]) ?? 1;
        const inkHeight =
          clamp(Math.sqrt(LOGO_AREA / shape.aspect), MIN_HEIGHT, MAX_HEIGHT) * nudge;
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
      return;
    }

    Array.from(group.children).forEach((node, index) => {
      node.style.width = `${sized[index].elementWidth.toFixed(1)}px`;
      node.style.height = `${sized[index].elementHeight.toFixed(1)}px`;
    });
    // sized is rebuilt each render; ink and scales are what actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ink, scales]);

  useEffect(() => {
    const group = groupRef.current;
    const stage = stageRef.current;

    if (!group || !stage || !running || !items.length || !sized) {
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
    /* One static body per obstacle, made the first time its element has a
       size to measure, and moved to follow it from then on. */
    const obstacles = (obstacleRefs ?? []).map(() => null);
    /* Whether each body was asleep at the end of the last frame, so that the
       moment one wakes can be spotted and passed on. */
    const slept = nodes.map(() => false);
    let frames = 0;
    /* Counts down from SETTLE_WATCH whenever an obstacle moves. */
    let watching = 0;
    let spawned = 0;
    let sinceSpawn = SPAWN_EVERY;
    let last = null;
    let frame = null;

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

    const spawn = (index) => {
      const bar = originRef.current?.getBoundingClientRect();
      const stageBox = stage.getBoundingClientRect();

      if (!bar) {
        return;
      }

      const shape = sized[index];
      /* Across the banner rather than across the screen: they come out of the
         word, so they should start under it. */
      const x = bar.left - stageBox.left + Math.random() * bar.width;
      const y = bar.bottom - stageBox.top + shape.inkHeight / 2;
      const options = {
        ...MATERIAL,
        angle: (Math.random() * 2 - 1) * 0.25,
        ...DEBUG_BODY,
      };
      /* A roundel gets a round body, whether it said so itself or was named.
         Everything else is near enough a card. */
      const body = shape.round || roundSet?.has(items[index])
        ? Bodies.circle(x, y, Math.min(shape.inkWidth, shape.inkHeight) / 2, options)
        : Bodies.rectangle(x, y, shape.inkWidth, shape.inkHeight, options);

      Body.setVelocity(body, { x: ((Math.random() * 2 - 1) * DRIFT) / 60, y: 0 });
      Body.setAngularVelocity(body, ((Math.random() * 2 - 1) * SPIN) / 60);
      Composite.add(engine.world, body);

      bodies[index] = body;
      nodes[index].style.opacity = '1';
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
     * Where each obstacle's element is this frame, in the stage's pixels.
     *
     * Read before the stepping and then moved towards in pieces, because a
     * panel driven by the scroll can cover half the screen between two frames
     * and a wall that teleports that far does not push anything - it is simply
     * on the other side of the pile, which is what it was doing before.
     */
    const readObstacles = () => {
      const stageBox = stage.getBoundingClientRect();

      return (obstacleRefs ?? []).map((ref) => {
        const element = ref?.current;

        if (!element) {
          return null;
        }

        const box = element.getBoundingClientRect();

        if (box.width < 1 || box.height < 1) {
          return null;
        }

        return {
          x: box.left - stageBox.left + box.width / 2,
          y: box.top - stageBox.top + box.height / 2,
          width: box.width,
          height: box.height,
        };
      });
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
          obstacles[index] = Bodies.rectangle(target.x, target.y, target.width, target.height, {
            isStatic: true,
            friction: 0.4,
            ...DEBUG_WALL,
          });
          Composite.add(engine.world, obstacles[index]);

          return;
        }

        const obstacle = obstacles[index];
        const from = obstacle.position;
        const toX = from.x + (target.x - from.x) * through;
        const toY = from.y + (target.y - from.y) * through;

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
      /*
       * Spawning runs on the engine's clock and not on the wall, so that a run
       * of slow frames cannot let the next logo out before the one in front of
       * it has fallen anywhere - they would arrive inside each other.
       */
      const used = Math.min(elapsed, STEP_MS * MAX_STEPS);

      sinceSpawn += used;

      if (spawned < nodes.length && sinceSpawn >= SPAWN_EVERY) {
        sinceSpawn = 0;
        spawn(spawned);
        spawned += 1;
      }

      const targets = readObstacles();
      const steps = clamp(Math.round(used / STEP_MS), 1, MAX_STEPS);

      for (let step = 0; step < steps; step += 1) {
        /* An equal share of what is left each time, so the wall arrives over
           the whole frame rather than at the start of it. */
        moveObstacles(targets, 1 / (steps - step));
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

      if (watching > 0 && frames % SUPPORT_EVERY === 0) {
        const everything = bodies.filter(Boolean).concat(obstacles.filter(Boolean));

        for (let index = 0; index < bodies.length; index += 1) {
          const body = bodies[index];

          if (!body || !body.isSleeping || body.bounds.max.y >= floor - SUPPORT_PROBE) {
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

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);

      if (render) {
        Render.stop(render);
        render.canvas.remove();
        render.textures = {};
      }

      Composite.clear(engine.world, false);
      Engine.clear(engine);

      /* Scrolled back above the mark: put every logo away, so arriving at it
         again is the spill starting rather than resuming. */
      nodes.forEach((node) => {
        node.style.opacity = '0';
        node.style.transform = '';
      });
    };
    // sized is rebuilt each render; ink and scales are what actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, running, stageRef, originRef, ink, scales, obstacleRefs, roundSet]);

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