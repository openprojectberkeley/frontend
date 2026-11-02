import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import applyStyles from '../css/Apply.module.css';
import contactStyles from '../css/Contact.module.css';
import styles from '../css/NotFound.module.css';
import useInViewOnce from './useInViewOnce';
import { FixedStarField } from './StarField';
import JoinScene from './JoinScene';
import square from '../images/square.png';

const RUNS = [{ text: 'The page you tried to visit does not exist or may have been moved.' }];
const BUTTON = { label: 'Back to home', to: '/', back: true };

/*
 * The contact page's opening: the words stacked down the left and, in the middle
 * of the right half, the square with the apply page's astronaut's drift.
 */
export default function NotFound() {
  const headRef = useRef(null);
  const headIn = useInViewOnce(headRef, 0);
  const reducedMotion = useReducedMotion();

  return (
    <>
      <FixedStarField />
      <div className={`${applyStyles.applyWrapper} ${styles.page} limitWidth`}>
        <div ref={headRef} className={contactStyles.main}>
          <JoinScene
            arrived={headIn}
            reducedMotion={reducedMotion}
            title="Huh, that's odd..."
            headClassName={contactStyles.head}
            runs={RUNS}
            button={BUTTON}
          />
        </div>

        <div className={`${applyStyles.circle} ${styles.square}`} aria-hidden="true">
          <img src={square} alt="" />
        </div>
      </div>
    </>
  );
}
