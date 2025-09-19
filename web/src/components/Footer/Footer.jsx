import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';


import { faTiktok } from '@fortawesome/free-brands-svg-icons';

const Footer = ({ isContactPage = false }) => {
  return (
    <footer className={`${styles.footer} ${isContactPage ? styles.contactFooter : ''}`}>
      <div className={styles.footerContent}>
        {/* Column 1: Products */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Products</h3>
          <ul className={styles.sectionList}>
            <li>Americano</li>
            <li>Macchiato</li>
            <li>Latte</li>
            <li>Cappuccino</li>
            <li>Milk Tea</li>
            <li>Cakes</li>
            {/* Add links to categories or menu sections as needed */}
          </ul>
        </div>

        {/* Column 2: Explore */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Explore</h3>
          <ul className={styles.sectionList}>
            <li><a href="#home" className={styles.footerLink}>Home</a></li>
            <li><a href="#menu" className={styles.footerLink}>Menu</a></li>
            <li><a href="#promotions" className={styles.footerLink}>Promotion</a></li>
            <li><a href="#about" className={styles.footerLink}>About Us</a></li>
            <li><a href="#contact" className={styles.footerLink}>Contact Us</a></li>
          </ul>
        </div>

        {/* Column 3: Contact / Visit Us */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Contact / Visit Us</h3>
          <ul className={styles.sectionList}>
            <li><span className={styles.staticText}>lifebordz@gmail.com</span></li>
            <li>(032) 383 0855</li>
            <li>Mon–Sat: 8AM – 9PM</li>
            <li>Sun: Closed</li>
            <li>Pob. Ward II, Mingianillo, Cebu</li>
            <li>18 De Julio Street</li>
            {/* <li><a href="#branches">Branches</a></li> */}
          </ul>
          <div style={{marginTop: '0.5rem'}}>
            <a href="#messenger" className={styles.messengerBtn}>Message Us on Messenger</a>
          </div>
        </div>

        {/* Column 4: Stay Connected */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Stay Connected</h3>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/Raifuti" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faXTwitter} /></a>
            <a href="https://www.youtube.com/@teamtahupon/featured" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYoutube} /></a>
            <a href="#"><FontAwesomeIcon icon={faTiktok} /></a>
          </div>
          {/* Newsletter subscribe form removed as requested */}
        </div>
      </div>
      {/* Tagline and legal/social proof links */}
      <div className={styles.footerBottom}>
        <span className={styles.tagline}>Brewing happiness, one cup at a time ☕</span>
        <span className={styles.footerBottomLinks}>
          <a href="#reviews" className={styles.footerLink}>Customer Reviews</a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;