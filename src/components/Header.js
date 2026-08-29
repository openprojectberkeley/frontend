import styles from '../css/Header.module.css';
import logo from '../images/navbarlogo.png';
import { NavLink, useLocation } from 'react-router-dom';
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
        <NavLink to="/"><img src={logo} alt="logo" /></NavLink>
        <div className={active ? `${styles.linksActive}` : `${styles.links}`} onClick={deActivate}>
          <NavLink to="/about/" className={activeLink('/about')}>about</NavLink>
          <NavLink to="/board/" className={activeLink('/board')}>board</NavLink>
          <NavLink to="/apply/" className={activeLink('/apply')}>apply</NavLink>
          <NavLink to="/projects/" className={activeLink('/projects')}>projects</NavLink>
          <NavLink to="/contact/" className={activeLink('/contact')}>contact</NavLink>
          <NavLink to="/resources/" className={activeLink('/resources')}>resources</NavLink>
          <a
            className={styles.openportalLink}
            href="https://portal.openprojectberkeley.com"
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