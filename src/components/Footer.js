import styles from '../css/Footer.module.css';
import footerLogo from '../images/op_footer.png';
import { NavLink } from 'react-router-dom';
import instagram from '../images/instagram.png';
import github from '../images/github.png';
import { NavHashLink } from 'react-router-hash-link';

export default function Footer() {
    return (
      <div className={styles.background}>
        <div className={`${styles.footer} limitWidth`}>
          <div className={styles.socials}>
            <NavLink to="/"><img src={footerLogo} alt="footer logo" className={styles.footerLogo} /></NavLink>
            <div className={styles.socialLinks}>
              <a href="https://www.instagram.com/openprojectberkeley/" target="_blank" rel="noopener noreferrer">
                <div className={styles.socialsgroup}>
                  <img src={instagram} alt="instagram" className={styles.socialicons}/>
                  <p>Instagram</p>
                </div>
              </a>
              <a href="https://github.com/openprojectberkeley" target="_blank" rel="noopener noreferrer">
                <div className={styles.socialsgroup}>
                  <img src={github} alt="github" className={styles.socialicons}/>
                  <p>Github</p>
                </div>
              </a>
            </div>
          </div>
          <div className={styles.rightContent}>
            <div className={styles.general}>
              <p className={styles.title}>General</p>
              <div className={styles.links}>
                <NavLink to="/about">About</NavLink>
                <NavHashLink smooth to="/about#team">Team</NavHashLink>
                <NavHashLink smooth to="/about#values">Values</NavHashLink>
                <NavLink to="/contact">Contact</NavLink>
              </div>
            </div>
            <div className={styles.students}>
              <p className={styles.title}>Students</p>
              <div className={styles.links}>
                <NavLink to="/apply">Apply</NavLink>
                <NavHashLink smooth to="/apply#timeline">Timeline</NavHashLink>
                <NavHashLink smooth to="/apply#faqs">FAQs</NavHashLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}