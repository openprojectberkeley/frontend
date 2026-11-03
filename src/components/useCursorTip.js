import { useRef } from 'react';
import heroStyles from '../css/ImmersiveHero.module.css';

/*
 * A label that follows the cursor: the home page's community caption, white
 * pass then colour - see MomentStrip, whose classes it borrows. The board
 * shows a person's major and year with it over their card, the apply page why
 * its button is grey. Written straight to the element, as there: a render per
 * pointer move would be the whole page.
 *
 * `className` is the page's own, for hiding it where there is no hover, and
 * `after` is anything to set after the words.
 */
const TIP_FLIP_MARGIN = 260;

export default function useCursorTip(className = '', after = null) {
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
  const show = (event, text, accent) => {
    const tip = tipRef.current;

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
    <div ref={tipRef} className={`${heroStyles.momentTip} ${className}`} aria-hidden="true">
      <span className={heroStyles.momentTipText}>
        <span ref={textRef} />
        {after}
      </span>
    </div>
  );

  return { tip, show, move, hide };
}
