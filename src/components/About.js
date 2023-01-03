import styles from '../css/About.module.css';
import orangeCurve from "../images/orangecurve.png";
import colin from '../images/aboutPictures/colin.jpg';
import nhu from '../images/aboutPictures/nhu.jpg';
import uyen from '../images/aboutPictures/uyen.jpg';
import ethan from '../images/aboutPictures/ethan.jpg';
import nick from '../images/aboutPictures/nick.jpg';
import joel from '../images/aboutPictures/joel.jpg';


export default function About() {
    return (
      <div>
        <img src={orangeCurve} className={styles.orangeCurve}></img>
      <div className={`${styles.aboutBottomHalf} limitWidth`}>
        <h1>Meet the Team</h1>
      <div className={styles.imagesContainer}>
        <div className={styles.topHalf}>
        <div className={styles.person}>
          <img className={styles.gridImage} src={ethan}></img>
          <h3>Ethan Ikegami</h3>
        </div>
        <div className={styles.person}>
          <img className={styles.gridImage} src={nick}></img>
          <h3>Nick Litvinov</h3>
        </div>
        <div className={styles.person}>
          <img className={styles.gridImage} src={joel}></img>
          <h3>Joel Jaison</h3>
        </div>
        </div>
       <div className={styles.bottomHalf}>
       <div className={styles.person}>
          <img className={styles.gridImage} src={colin}></img>
          <h3>Colin FitzGerald</h3>
        </div>
        <div className={styles.person}>
          <img className={styles.gridImage} src={nhu}></img>
          <h3>Nhu Vu </h3>
        </div>
        <div className={styles.person}>
          <img className={styles.gridImage} src={uyen}></img>
          <h3>Uyen Phan </h3>
        </div>
       </div>
    </div>
  </div>
  </div>
    );
  }
