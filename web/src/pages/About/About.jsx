import styles from './About.module.css';
import signage from '../../assets/images/finalimage.jpg';
import React, { useState, useEffect } from 'react';

// Scroll Up Button Component
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

export default function About() {
  return (
    <div className={styles.aboutPage}>
      {/* 1st Part - Hero section */}
      <section className={styles.heroSection}>
        <img src={signage} alt="About Us" className={styles.heroImage} />
        <h1 className={styles.heroTitle}>About Us</h1>
      </section>

      {/* ===============ABOUT US ================== */}
      <section id="about" className={styles.containerBlack}>
        <div className={styles.containerBlackImgWrapper}>
          <img
            src={require('../../assets/images/Raifuti2.jpg')}
            alt="Your Custom"
            className={styles.containerBlackImg}
          />
          <div className={styles.containerBlackText}>
            <h2>About Us</h2>
            <p> Welcome to Brewnative! We are passionate about crafting the perfect cup of coffee and serving delicious treats in a cozy atmosphere.</p>
          </div>
        </div>
      </section>

      {/* =============== ABOUT US2 ================== */}
      <section className={styles.containerBoxAboutUs}>
        <div className={styles.containerText}>
          <h2>Our Team</h2>
          <p>
            Meet the passionate people behind Brewnative! Our baristas and staff are dedicated to making every visit special, from expertly crafted drinks to friendly service.
          </p>
        </div>
        <div className={styles.containerBoxImage}>
          <img
            src={require('../../assets/images/raifutiemployees.jpg')}
            alt="Our Team"
            className={styles.containerImage}
          />
        </div>
      </section>
      <ScrollUpButton />
    </div>
  );
}