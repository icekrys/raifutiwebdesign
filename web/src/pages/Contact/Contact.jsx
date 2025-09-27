import React, { useState, useEffect } from 'react';
import styles from './Contact.module.css';
import signage from '../../assets/images/finalimage.jpg';
import phone from '../../assets/icons/call2.jpg';
import email from '../../assets/icons/email1.jpg';
import location from '../../assets/icons/location.jpg';
import Footer from '../../components/Footer/Footer';

// ===================== SCROLL UP BUTTON =====================
function ScrollUpButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollToTop}
      className={visible ? styles.scrollUpButton : `${styles.scrollUpButton} ${styles.scrollUpButtonHidden}`}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

// ===================== CONTACT PAGE =====================
const Contact = () => {
  return (
    <div className={styles.contactPage}>
      {/* ===================== HERO SECTION ===================== */}
      <section className={styles.heroSection}>
        <img src={signage} alt="Contact Us" className={styles.heroImage} />
        <h1 className={styles.heroTitle}>Contact Us</h1>
      </section>

      {/* ===================== CONTACT US SECTION ===================== */}
      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactFlexRow}>
          {/* --- Contact Info Block --- */}
          <div className={styles.contactTextBlock}>
            <h2>Let's Connect!</h2>
            <p>
              Have a question, suggestion, or just want to chat about coffee? <br />
              Our team is here to help you with anything you need. <br /><br />
              <div className={styles.businessHoursContainer}>
                <strong>Business Hours:</strong><br />
              </div>
              Monday - Saturday: 8:00 AM - 8:00 PM<br />
              Sunday: 10:00 AM - 6:00 PM<br />
              <br />
              We look forward to hearing from you and welcoming you to Brewnative!
            </p>
          </div>
          {/* --- Contact Details Block --- */}
          <div className={styles.contactContainer}>
            <h2>Contact Us</h2>
            <p>We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, reach out to us below.</p>
            <div className={styles.contactDetails}>
              <div className={styles.emailContainer}>
                <img src={email} alt="Email" className={`${styles.iconImage} ${styles.iconSmall}`} />
                <p><strong>Email:</strong> info@brewnative.com</p>
              </div>
              <div className={styles.containerContactNumber}>
                <img src={phone} alt="Phone Number" className={`${styles.iconImage} ${styles.iconSmall}`} />
                <p><strong>Phone:</strong> (123) 456-7890</p>
              </div>
              <div className={styles.containerLocation}>
                <img src={location} alt="Location" className={`${styles.iconImage} ${styles.iconSmall}`} />
                <p><strong>Location:</strong> 123 Coffee Lane, Brewtown</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MAP SECTION ===================== */}
      <section className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <iframe
            title="Brewnative Location"
            src="https://www.google.com/maps?q=6QVW%2B8J8%2C%2018%20de%20Julio%20Street%2C%20Minglanilla%2C%20Cebu&output=embed"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div style={{ marginTop: '10px', textAlign: 'left' }}>
            <a
              href="https://www.google.com/maps?q=6QVW%2B8J8%2C%2018%20de%20Julio%20Street%2C%20Minglanilla%2C%20Cebu"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewLargerMapButton}
            >
              {/* Optionally: View Larger Map */}
            </a>
          </div>
        </div>
      </section>

      {/* ===================== SCROLL UP BUTTON ===================== */}
      <ScrollUpButton />
    </div>
  );
};

export default Contact;