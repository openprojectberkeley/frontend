import styles from '../css/Footer.module.css';
import { NavLink } from 'react-router-dom';
import instagram from '../images/instagram.png';
import github from '../images/github.png';
import email from '../images/email.png';
import linkedin from '../images/linkedin.png';
import footerLogo from '../images/footerlogo.png';
import { NavHashLink } from 'react-router-hash-link';
import { useState } from 'react';
import StarField from './StarField';

const SOCIALS = [
  { href: 'https://www.instagram.com/openprojectberkeley/', icon: instagram, name: 'Instagram', handle: '@openprojectberkeley' },
  { href: 'https://linkedin.com/company/openprojectberkeley', icon: linkedin, name: 'LinkedIn', handle: 'openprojectberkeley' },
  { href: 'https://github.com/openprojectberkeley', icon: github, name: 'GitHub', handle: 'openprojectberkeley' },
  { href: 'mailto:openprojectberkeley@gmail.com', icon: email, name: 'Email', handle: 'openprojectberkeley@gmail.com' },
];

export default function Footer() {
    // The handle of whichever icon is under the cursor, and where the cursor is.
    const [hovered, setHovered] = useState(null);

    const showHandle = (handle, x, y) => setHovered({ handle, x, y });
    const hideHandle = () => setHovered(null);

    return (
      <div className={styles.background}>
        <img
          src={`${process.env.PUBLIC_URL}/favicon.svg`}
          alt=""
          aria-hidden="true"
          className={styles.watermark}
        />
        {/*
          The home hero's scene-six stars carry on down past its copy, and
          this is where they land: the same field, inked, placed the copy's
          height above the footer so each star lines up with its white self.
          Off the page unless the hero has written that height.
        */}
        <div className={styles.stars} aria-hidden="true">
          <StarField ink />
        </div>
        <div className={`${styles.footer} limitWidth`}>
          <div className={styles.socials}>
            <NavLink to="/" className={styles.logoLink}>
              <img src={footerLogo} alt="Open Project home" className={styles.footerLogo} />
            </NavLink>
          </div>
          <div className={styles.rightContent}>
            <div className={styles.general}>
              <p className={styles.title}>General</p>
              <div className={styles.links}>
                <NavLink to="/about/">About</NavLink>
                <NavHashLink smooth to="/board/#team">Team</NavHashLink>
                <NavLink to="/projects/">Projects</NavLink>
                <NavLink to="/contact/">Contact</NavLink>
              </div>
            </div>
            <div className={styles.students}>
              <p className={styles.title}>Students</p>
              <div className={styles.links}>
                <NavLink to="/apply/">Apply</NavLink>
                <NavHashLink smooth to="/apply/#timeline">Timeline</NavHashLink>
                <NavHashLink smooth to="/apply/#faqs">FAQs</NavHashLink>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.copyright} limitWidth`}>
          <div className={styles.socialLinks}>
            {SOCIALS.map(({ href, icon, name, handle }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name}: ${handle}`}
                onPointerEnter={(event) => showHandle(handle, event.clientX, event.clientY)}
                onPointerMove={(event) => showHandle(handle, event.clientX, event.clientY)}
                onPointerLeave={hideHandle}
                onFocus={(event) => {
                  const box = event.currentTarget.getBoundingClientRect();
                  showHandle(handle, box.left + box.width / 2, box.bottom);
                }}
                onBlur={hideHandle}
              >
                <img src={icon} alt="" className={styles.socialicons}/>
              </a>
            ))}
          </div>
          <p>© {new Date().getFullYear()} Open Project at Berkeley. All rights reserved.</p>
        </div>
        {hovered && (
          <span
            className={styles.cursorLabel}
            style={{ transform: `translate(${hovered.x}px, ${hovered.y}px)` }}
            aria-hidden="true"
          >
            {hovered.handle}
          </span>
        )}
      </div>
    );
}