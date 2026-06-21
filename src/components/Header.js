import styles from '../css/Header.module.css';
import logo from '../images/navbarlogo.png';
import { NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useComingSoonLabel from './useComingSoonLabel';

export default function Header() {
  const activeLink = ({ isActive }) => isActive ? `${styles.activeLink}` : '';
  const [active, setActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [renderBackdrop, setRenderBackdrop] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const backdropOpenRef = useRef(false);
  const { label: comingSoonLabel, onMouseEnter, onMouseMove, onMouseLeave } = useComingSoonLabel();

  useEffect(() => {
    const updateScrolledState = () => {
      setScrolled(window.scrollY > 100);
    };

    updateScrolledState();
    window.addEventListener('scroll', updateScrolledState, { passive: true });

    return () => window.removeEventListener('scroll', updateScrolledState);
  }, []);

  useEffect(() => {
    if (!active) {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    document.body.classList.add('mobile-menu-open');

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [active]);

  useEffect(() => {
    if (active) {
      setRenderBackdrop(true);
      const frameId = window.requestAnimationFrame(() => {
        setBackdropOpen(true);
        backdropOpenRef.current = true;
      });

      return () => window.cancelAnimationFrame(frameId);
    }

    setBackdropOpen(false);
    backdropOpenRef.current = false;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRenderBackdrop(false);
    }

    return undefined;
  }, [active]);

  function handleBackdropTransitionEnd(event) {
    if (event.target !== event.currentTarget || event.propertyName !== 'opacity') {
      return;
    }

    if (!backdropOpenRef.current) {
      setRenderBackdrop(false);
    }
  }

  function deActivate() {
    setActive(false);
  }

  function hamburgerMode() {
    setActive((isOpen) => !isOpen);
  }

  return (
    <>
      {renderBackdrop && (
        <div
          className={`${styles.menuBackdrop} ${backdropOpen ? styles.menuBackdropOpen : ''}`}
          onClick={deActivate}
          onTransitionEnd={handleBackdropTransitionEnd}
          aria-hidden="true"
        />
      )}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`} id="header">
        {comingSoonLabel}
        <NavLink to="/"><img src={logo} alt="logo" /></NavLink>
        <div className={active ? `${styles.linksActive}` : `${styles.links}`} onClick={deActivate}>
          <NavLink to="/about/" className={activeLink}>about</NavLink>
          <NavLink to="/board/" className={activeLink}>board</NavLink>
          <NavLink to="/apply/" className={activeLink}>apply</NavLink>
          <NavLink to="/projects/" className={activeLink}>projects</NavLink>
          <NavLink to="/contact/" className={activeLink}>contact</NavLink>
          <NavLink to="/resources/" className={activeLink}>resources</NavLink>
          <span
            className={styles.openportalLink}
            aria-disabled="true"
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            open portal
          </span>
        </div>
        <div className={styles.hamburger}>
          <div className={styles.hamburger} onClick={hamburgerMode}>
            <span className={active ? `${styles.barLeft}` : `${styles.bar}`}></span>
            <span className={active ? `${styles.barGone}` : `${styles.bar}`}></span>
            <span className={active ? `${styles.barRight}` : `${styles.bar}`}></span>
          </div>
        </div>
      </header>
    </>
  );
}