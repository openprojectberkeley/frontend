import React from 'react';
import styles from '../css/OpensElsewhere.module.css';

/* Comes in after a link's words, for a link to another page, when it is hovered -
   or with `shown`, is simply there, for words that are only up while it is. */
export default function OpensElsewhere({ shown }) {
  return (
    <svg className={`${styles.opensElsewhere} ${shown ? styles.shown : ''}`} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M5 2H2v8h8V7M7 1.5h3.5V5M10.5 1.5 5.5 6.5" />
    </svg>
  );
}
