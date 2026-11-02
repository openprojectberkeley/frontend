import { useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import emailjs from 'emailjs-com';
import aboutStyles from '../css/About.module.css';
import applyStyles from '../css/Apply.module.css';
import homeStyles from '../css/HomePage.module.css';
import heroStyles from '../css/ImmersiveHero.module.css';
import styles from '../css/Contact.module.css';
import useInViewOnce from './useInViewOnce';
import { FixedStarField } from './StarField';
import JoinScene from './JoinScene';
import shapes from '../images/contact/shapes.svg';
import { CONTACT_EMAIL } from '../data/site';

const RUNS = [
  { text: 'If you have any questions, concerns or simply want to ' },
  { text: 'say hello', colour: '#4DB6AC' },
  { text: ", please don't hesitate to reach out to us through the form provided! We’ll get back to you as soon as we can!" },
];

// The fields, in order. `name` is what the email's template reads.
const FIELDS = [
  { name: 'from_name', label: 'Name', type: 'text' },
  { name: 'reply_to', label: 'Email', type: 'email' },
  { name: 'subject', label: 'Subject', type: 'text' },
  { name: 'message', label: 'Your message...' },
];

/* A field comes in a beat after the one above it. */
const FIELD_GAP_MS = 60;

/*
 * Down the left, the apply page's opening stacked and the form under it, its
 * fields coming in once as they reach the window. In the middle of the right
 * half, the shapes, with the apply page's astronaut's drift.
 *
 * The button stays grey until the form could be sent: everything filled in, with
 * more than spaces, and the email looking like one.
 */
export default function Contact() {
  const form = useRef();
  const headRef = useRef(null);
  const headIn = useInViewOnce(headRef, 0);
  const formIn = useInViewOnce(form);
  const reducedMotion = useReducedMotion();
  const [sent, setSent] = useState("notsent");
  const [complete, setComplete] = useState(false);

  const checkComplete = () => {
    const filled = FIELDS.every(({ name }) => form.current[name].value.trim() !== '');

    setComplete(filled && form.current.checkValidity());
  };

  const sendEmail = (e) => {
      e.preventDefault();

      const templateParams = {
        from_name: form.current.from_name.value,
        reply_to: form.current.reply_to.value,
        subject: form.current.subject.value,
        message: form.current.message.value,
      };

      emailjs.send('service_uuijmxu', 'template_3hiw07p', templateParams, 'u1fSQ6SkoqE4EVFIT')
      .then((result) => {
          setSent("success")
      }, (error) => {
          setSent("error")
      });
  };

  return (
    <>
      <FixedStarField />
      <div className={`${applyStyles.applyWrapper} ${styles.page} limitWidth`}>
        <div className={styles.main}>
          <div ref={headRef}>
            <JoinScene
              arrived={headIn}
              reducedMotion={reducedMotion}
              title="Experience For All."
              headClassName={styles.head}
              titleClassName={styles.title}
              runs={RUNS}
              button={null}
            />
          </div>

          <form
            ref={form}
            onSubmit={sendEmail}
            onChange={checkComplete}
            className={`${styles.form} ${formIn ? styles.inView : ''}`}
          >
            {FIELDS.map(({ name, label, type }, index) => {
              const Field = type ? 'input' : 'textarea';

              return (
                <label key={name} className={styles.field} style={{ '--reveal-delay': `${index * FIELD_GAP_MS}ms` }}>
                  <span className={aboutStyles.visuallyHidden}>{label}</span>
                  <Field type={type} placeholder={label} name={name} required />
                </label>
              );
            })}

            <div className={styles.field} style={{ '--reveal-delay': `${FIELDS.length * FIELD_GAP_MS}ms` }}>
              <button
                type="submit"
                disabled={!complete}
                className={`${homeStyles.getInvolvedButton} ${heroStyles.ctaButton} ${heroStyles.joinButton}`}
              >
                Send Message
                <span className={heroStyles.ctaArrow} aria-hidden="true">→</span>
              </button>
            </div>

            <div role="status">
              {sent === "success" && <p className={styles.message}>Email sent! We'll get back to you soon!</p>}
              {sent === "error" && <p className={styles.message}>Email failed to send. Please reach us at {CONTACT_EMAIL}!</p>}
            </div>
          </form>
        </div>

        <div className={`${applyStyles.circle} ${styles.shapes}`} aria-hidden="true">
          <img src={shapes} alt="" />
        </div>
      </div>
    </>
  )
}
