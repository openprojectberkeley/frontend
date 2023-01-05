import { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import styles from '../css/Contact.module.css';
import homepageShapes from '../images/homepage-shapes.png';

export default function Contact() {
  const form = useRef();
  const [sent, setSent] = useState("notsent");

  const sendEmail = (e) => {
      e.preventDefault();

      emailjs.sendForm('service_uuijmxu', 'template_3hiw07p', form.current, 'u1fSQ6SkoqE4EVFIT')
      .then((result) => {
          setSent("success")
      }, (error) => {
          setSent("error")
      });
  };

  return (
      <div className="limitWidth">
        <div className={styles.addMargin}>
          <div className={styles.cover}>
            <div className={styles.coverLeft}>
              <h1 className={styles.blueText}>Experience</h1>
              <h1 className={styles.orangeText}>For All.</h1>
              <h2>If you have any questions or concern, fill out the form below or just want to say hi that's cool too! We'll get back to you as soon as we can!</h2>
            </div>
            <div className={styles.coverRight}>
              <img src={homepageShapes} alt="Homepage Shapes" />
            </div>
          </div>


          <form ref={form} onSubmit={sendEmail} className={styles.fullform}>
              <div className={styles.form}>
                <input type="text" placeholder="Name" name="from_name" required/>
                <input type="email" placeholder="Email" name="reply_to" required/>
                <textarea placeholder="Your message..." name="message" required/>
              </div>
              <input type="submit" value="send message" className={styles.submit}/>
              {sent === "success" && <p className={styles.message}>Email sent! We'll get back to you soon!</p>}
              {sent === "error" && <p className={styles.message}>Email failed to send. Please reach us at openprojectberkeley@gmail.com!</p>}
          </form>
        </div>
      </div>
  )
}