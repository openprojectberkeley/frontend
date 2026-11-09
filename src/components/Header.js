import styles from '../css/Header.module.css';
import logo from '../images/navbarlogo.png';
import logoInk from '../images/navbarlogo_black.png';
import { PORTAL_URL } from '../data/site';
import ScrambleText from './ScrambleText';
import { NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useEffect, useRef, useState } from 'react';

/*
 * The board page's sections, for the menu under "board". Each id is set on
 * its section in Board.jsx.
 */
const BOARD_SECTIONS = [
  { id: 'exec', label: 'exec' },
  { id: 'pms', label: 'PMs' },
  { id: 'alumni', label: 'alumni' },
];

/* The menu's rows type in one after another, each this far behind the last. */
const MENU_LINE_STAGGER_MS = 70;
const MENU_LINE_MS = 280;

/* Clear of the fixed header, so a section's heading isn't landed under it. */
const SECTION_SCROLL_OFFSET = 100;

function scrollToSection(el) {
  const top = el.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

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
  /* Bumped each time the board menu opens, to key the rows so they replay. */
  const [menuPlay, setMenuPlay] = useState(0);
  const menuOpenRef = useRef(false);

  /*
   * Whether the page is more than SCROLLED_AFTER down, from a marker at the top
   * of the document going out of view rather than from reading scrollY on
   * every scroll event: that read is a layout query, and on the home page,
   * whose hero rewrites its stage every frame, it was making the browser
   * restyle the stage a second time per frame just to answer it.
   */
  const scrollMarkerRef = useRef(null);

  useEffect(() => {
    const marker = scrollMarkerRef.current;

    if (!marker) return undefined;

    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));

    observer.observe(marker);

    return () => observer.disconnect();
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
      <div ref={scrollMarkerRef} className={styles.scrollMarker} aria-hidden="true" />
      <header
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ''} ${
          active ? styles.headerMenuOpen : ''
        }`}
        id="header"
      >
        <NavLink to="/">
          <img src={logo} alt="logo" className={styles.logo} />
          <img src={logoInk} alt="" aria-hidden="true" className={styles.logoInk} />
        </NavLink>
        <div className={active ? `${styles.linksActive}` : `${styles.links}`} onClick={deActivate}>
          <NavLink to="/about/" className={activeLink('/about')}>about</NavLink>
          <NavLink to="/apply/" className={activeLink('/apply')}>apply</NavLink>
          <div
            className={styles.menuItem}
            onMouseEnter={openMenu}
            onFocus={openMenu}
            onMouseLeave={closeMenu}
            onBlur={closeMenu}
          >
            <NavLink to="/board/" className={activeLink('/board')}>board</NavLink>
            <div className={styles.dropdown}>
              {BOARD_SECTIONS.map((section, index) => (
                <HashLink
                  key={section.id}
                  to={`/board/#${section.id}`}
                  scroll={scrollToSection}
                  aria-label={section.label}
                >
                  <ScrambleText
                    key={menuPlay}
                    text={section.label}
                    delay={index * MENU_LINE_STAGGER_MS}
                    duration={MENU_LINE_MS}
                  />
                </HashLink>
              ))}
            </div>
          </div>
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
        {/*
          A solid tile with the three bars cut out of it, so whatever is behind
          the header shows through them. They used to be dark bars painted on a
          white tile, which only looked cut out while the page behind was black.
          The cut is a mask, so the bars still turn into the cross.
        */}
        <button
          type="button"
          className={`${styles.hamburger} ${active ? styles.hamburgerOpen : ''}`}
          onClick={hamburgerMode}
          aria-label={active ? 'Close menu' : 'Open menu'}
          aria-expanded={active}
        >
          <svg viewBox="0 0 25 29" aria-hidden="true" focusable="false">
            <defs>
              <mask id="op-hamburger-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="29">
                <rect width="25" height="29" fill="white" />
                <rect className={`${styles.cut} ${styles.cutTop}`} x="-1" y="5" width="27" height="3" fill="black" />
                <rect className={`${styles.cut} ${styles.cutMiddle}`} x="-1" y="13" width="27" height="3" fill="black" />
                <rect className={`${styles.cut} ${styles.cutBottom}`} x="-1" y="21" width="27" height="3" fill="black" />
              </mask>
            </defs>
            <rect width="25" height="29" fill="currentColor" mask="url(#op-hamburger-cut)" />
          </svg>
        </button>
      </header>
    </>
  );
}