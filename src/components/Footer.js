import styles from '../css/Footer.module.css';
import { NavLink } from 'react-router-dom';
import instagram from '../images/instagram.png';
import github from '../images/github.png';
import email from '../images/email.png';
import linkedin from '../images/linkedin.png';
import { NavHashLink } from 'react-router-hash-link';
import StarField from './StarField';

export default function Footer() {
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
            <div className={styles.socialLinks}>
              <a href="https://www.instagram.com/openprojectberkeley/" target="_blank" rel="noopener noreferrer">
                <div className={styles.socialsgroup}>
                  <img src={instagram} alt="instagram" className={styles.socialicons}/>
                  <p>@openprojectberkeley</p>
                </div>
              </a>
              <a href="https://linkedin.com/company/openprojectberkeley" target="_blank" rel="noopener noreferrer">
                <div className={styles.socialsgroup}>
                  <img src={linkedin} alt="linkedin" className={styles.socialicons}/>
                  <p>openprojectberkeley</p>
                </div>
              </a>
              <a href="https://github.com/openprojectberkeley" target="_blank" rel="noopener noreferrer">
                <div className={styles.socialsgroup}>
                  <img src={github} alt="github" className={styles.socialicons}/>
                  <p>openprojectberkeley</p>
                </div>
              </a>
              <a href="mailto:openprojectberkeley@gmail.com" target="_blank" rel="noopener noreferrer">
                <div className={styles.socialsgroup}>
                  <img src={email} alt="email" className={styles.socialicons}/>
                  <p>openprojectberkeley@gmail.com</p>
                </div>
              </a>
            </div>
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
        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} Open Project at Berkeley. All rights reserved.</p>
        </div>
      </div>
    );
}