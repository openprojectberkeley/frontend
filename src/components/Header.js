import styles from '../css/Header.module.css';
import logo from '../images/navbarlogo.png';
import logoInk from '../images/navbarlogo_black.png';
import { PORTAL_URL } from '../data/site';
import { HOME_SECTIONS } from '../data/homeSections';
import { HIGHLIGHT_TINTS } from './MomentStrip';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export default function Header() {
  const location = useLocation();
  const currentPath = normalizePath(location.pathname);
  const activeLink = (to) =>
    normalizePath(to) === currentPath ? `${styles.activeLink}` : '';
  const [active, setActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [renderBackdrop, setRenderBackdrop] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const backdropOpenRef = useRef(false);
  /* Bumped each time the home menu opens, to key the rows so their highlight replays. */
  const [menuPlay, setMenuPlay] = useState(0);
  const menuOpenRef = useRef(false);

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

  function openMenu(event) {
    if (event.type === 'focus' && !event.target.matches(':focus-visible')) {
      return;
    }

    if (!menuOpenRef.current) {
      menuOpenRef.current = true;
      setMenuPlay((play) => play + 1);
    }
  }

  // Shut only once neither the pointer nor the focus is anywhere in the item.
  function closeMenu(event) {
    const item = event.currentTarget;

    if (event.type === 'blur' && item.contains(event.relatedTarget)) {
      return;
    }

    if (event.type === 'blur' ? item.matches(':hover') : item.querySelector(':focus-visible')) {
      return;
    }

    menuOpenRef.current = false;
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
        <NavLink to="/">
          <img src={logo} alt="logo" className={styles.logo} />
          <img src={logoInk} alt="" aria-hidden="true" className={styles.logoInk} />
        </NavLink>
        <div className={active ? `${styles.linksActive}` : `${styles.links}`} onClick={deActivate}>
          <div
            className={styles.homeItem}
            onMouseEnter={openMenu}
            onFocus={openMenu}
            onMouseLeave={closeMenu}
            onBlur={closeMenu}
          >
            <NavLink to="/" className={activeLink('/')}>home</NavLink>
            <div className={styles.dropdown}>
              {HOME_SECTIONS.map((section, index) => (
                <Link
                  key={section.id}
                  to={`/#${section.id}`}
                  style={{
                    '--row-accent': HIGHLIGHT_TINTS[index % HIGHLIGHT_TINTS.length],
                    '--row-index': index,
                  }}
                >
                  {/* Keyed so each opening remounts the mark and replays its wipe. */}
                  <span key={menuPlay} className={styles.rowMark}>
                    <span className={styles.rowText}>{section.label}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <NavLink to="/about/" className={activeLink('/about')}>about</NavLink>
          <NavLink to="/board/" className={activeLink('/board')}>board</NavLink>
          <NavLink to="/apply/" className={activeLink('/apply')}>apply</NavLink>
          <NavLink to="/projects/" className={activeLink('/projects')}>projects</NavLink>
          <NavLink to="/contact/" className={activeLink('/contact')}>contact</NavLink>
          <a
            className={styles.openportalLink}
            href={PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            open portal
          </a>
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