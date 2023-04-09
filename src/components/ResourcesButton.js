import { useState } from 'react';
import styles from '../css/ResourcesButton.module.css';

function ResourcesButton({ button, content, state }) {
  const [expanded, setExpanded] = useState(false);

  const handleButtonClick = () => {
    setExpanded(!expanded);
    if (content.length == 0) {
      state(button);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handleButtonClick}>
        {content.length != 0 && <div className={`${styles['triangle-shape']} ${expanded ? styles.rotate : ''}`}></div>}
        <span className={styles.label}>{button}</span>
      </button>
      <div className={`${styles.content} ${expanded ? styles.expand : ''}`}>
        {content.map((item, index) => 
            <p key={index} onClick={() => state(item)}>{item}</p>
        )}
      </div>
    </div>
  );
}

export default ResourcesButton;