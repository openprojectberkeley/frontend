import { useEffect, useRef } from 'react';
import styles from '../css/Board.module.css';
import accentInk from './accentInk';
import { orderedProjects } from '../data/projectsData';

/* Down and to the left of the cursor, or on the other side of it where that would
   run off the window: this far from the left edge, and from the bottom. */
const FLIP_LEFT = 120;
const FLIP_BOTTOM = 130;

/*
 * A project's rounded icon, beside the cursor: its logo or, without one, its
 * first letter on its accent. Written straight to the element, as useCursorTip's
 * label is, as a render per pointer move would be the whole page.
 */
export default function useCursorIcon() {
  const iconRef = useRef(null);
  const logoRef = useRef(null);
  const letterRef = useRef(null);

  // So that the first one hovered is there at once.
  useEffect(() => {
    orderedProjects.forEach(({ logo }) => {
      if (logo) new Image().src = logo;
    });
  }, []);

  const move = (event) => {
    const icon = iconRef.current;

    if (!icon) return;

    icon.style.setProperty('--icon-x', `${event.clientX}px`);
    icon.style.setProperty('--icon-y', `${event.clientY}px`);
    icon.classList.toggle(styles.cursorIconRight, event.clientX < FLIP_LEFT);
    icon.classList.toggle(styles.cursorIconAbove, event.clientY > window.innerHeight - FLIP_BOTTOM);
  };

  const show = (event, project) => {
    const icon = iconRef.current;

    if (event.pointerType !== 'mouse' || !icon || !project) return;

    logoRef.current.hidden = !project.logo;
    logoRef.current.src = project.logo || '';
    letterRef.current.textContent = project.logo ? '' : project.name[0];
    icon.classList.toggle(styles.cursorIconLetter, !project.logo);
    icon.style.setProperty('--accent', project.accent);
    icon.style.setProperty('--on-accent', accentInk(project.accent));
    move(event);
    icon.classList.add(styles.cursorIconOn);
  };

  const hide = () => iconRef.current?.classList.remove(styles.cursorIconOn);

  const cursorIcon = (
    <div ref={iconRef} className={styles.cursorIcon} aria-hidden="true">
      <img ref={logoRef} alt="" hidden />
      <span ref={letterRef} />
    </div>
  );

  return { icon: cursorIcon, show, move, hide };
}
