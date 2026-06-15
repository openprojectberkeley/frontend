import { NavLink } from 'react-router-dom';
import styles from '../css/NotFound.module.css';
import square from '../images/square.png';

export default function NotFound() {
  return (
    <div className={`${styles.page} limitWidth`}>
      <div className={`${styles.content}`}>
        <p className={styles.code}>404: Page Not Found</p>
        <h1>Huh, that's odd...</h1>
        <p className={styles.message}>
          The page you tried to visit does not exist or may have been moved.
        </p>
        <NavLink to="/" className={styles.homeLink}>
          Back to home
        </NavLink>
      </div>
      <div className={styles.square}>
        <img src={square} alt="square" />
      </div>
    </div>
  );
}
