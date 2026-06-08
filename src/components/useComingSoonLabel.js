import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../css/ComingSoonLabel.module.css';

const CURSOR_OFFSET = 14;

export default function useComingSoonLabel() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [flipLeft, setFlipLeft] = useState(false);
  const labelRef = useRef(null);

  const updatePosition = (event) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const onMouseEnter = (event) => {
    updatePosition(event);
    setVisible(true);
  };

  const onMouseMove = (event) => {
    updatePosition(event);
  };

  const onMouseLeave = () => {
    setVisible(false);
    setFlipLeft(false);
  };

  useLayoutEffect(() => {
    if (!visible || !labelRef.current) {
      return;
    }

    const { width } = labelRef.current.getBoundingClientRect();
    const overflowsRight = position.x + CURSOR_OFFSET + width > window.innerWidth;
    setFlipLeft(overflowsRight);
  }, [visible, position]);

  const label = visible
    ? createPortal(
        <div
          ref={labelRef}
          className={`${styles.comingSoonLabel} ${flipLeft ? styles.flipLeft : ''}`}
          style={{ left: position.x, top: position.y }}
          aria-hidden="true"
        >
          {'coming soon! 👀'}
        </div>,
        document.body,
      )
    : null;

  return { label, onMouseEnter, onMouseMove, onMouseLeave };
}
