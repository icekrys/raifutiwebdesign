// ===== Imports =====
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'motion/react';
import styles from './Home.module.css';
import 'swiper/css';
import 'swiper/css/navigation';

// ===== Assets =====
import signage from '../../assets/images/Final-image-raifuti.jpg';
import icedCaramelMacchiato from '../../assets/images/IcedCaramelMacchiato.jpg';
import cappuccino from '../../assets/images/Cappuccino.jpg';
import tiramisucake from '../../assets/images/tiramisucake.jpg';
import caramelapplecake from '../../assets/images/caramelapplecake.jpg';
import CortadoCoffee from '../../assets/images/CortadoCoffee.jpg';
import coffee from '../../assets/icons/coffeea.png';
import phone from '../../assets/icons/call2.jpg';
import email from '../../assets/icons/email1.jpg';
import location from '../../assets/icons/location.jpg';
import drinks from '../../assets/icons/beverage.png';
import desserts from '../../assets/icons/cake2.png';

// ===== Static Data =====
const signageSectionData = {
  title: 'Welcome to Raifuti',
  subtitle: 'Your Cozy Coffee Haven',
  description: 'Enjoy our signature blends and delicious desserts in a relaxing atmosphere.',
};

const menuBoxes = [
  {
    name: 'Americano',
    image: cappuccino,
    prices: { S: '₱100.00', M: '₱120.00', L: '₱140.00' },
    description: 'Classic espresso with hot water.',
  },
  {
    name: 'Blueberry Cheesecake',
    image: tiramisucake,
    prices: { S: '₱120.00', M: '₱150.00', L: '₱180.00' },
    description: 'Rich cheesecake with blueberry topping.',
  },
  {
    name: 'Red Velvet Cake',
    image: caramelapplecake,
    prices: { S: '₱110.00', M: '₱140.00', L: '₱170.00' },
    description: 'Moist red velvet cake with cream cheese.',
  },
  {
    name: 'Cortado Coffee',
    image: CortadoCoffee,
    prices: { S: '₱105.00', M: '₱125.00', L: '₱145.00' },
    description: 'Espresso cut with a small amount of warm milk.',
  },
  {
    name: 'Iced Caramel Macchiato',
    image: icedCaramelMacchiato,
    prices: { S: '₱115.00', M: '₱135.00', L: '₱155.00' },
    description: 'Signature drink with espresso, vanilla, milk, caramel.',
  },
  {
    name: 'Tiramisu Cake',
    image: tiramisucake,
    prices: { S: '₱130.00', M: '₱160.00', L: '₱190.00' },
    description: 'Classic Italian dessert with coffee and mascarpone.',
  },
];

const containerBoxMenus = [
  {
    name: 'Mocha Frappe',
    image: require('../../assets/images/frappe1.jpg'),
    description: 'Chilled espresso with chocolate and cream.',
    prices: { S: '₱110.00', M: '₱130.00', L: '₱150.00' },
  },
  {
    name: 'Mango Supreme Cake',
    image: require('../../assets/images/mangosupremecake.jpg'),
    description: 'A tropical delight with fresh mangoes.',
    prices: { S: '₱120.00', M: '₱150.00', L: '₱180.00' },
  },
  {
    name: 'Death by Chocolate Cake',
    image: require('../../assets/images/deathbychocolatecake.jpg'),
    description: 'Rich chocolate cake for chocolate lovers.',
    prices: { S: '₱130.00', M: '₱160.00', L: '₱190.00' },
  },
  {
    name: 'Blueberry Cream Cheese',
    image: require('../../assets/images/blueberrycreamcheese.jpg'),
    description: 'Moist muffin with blueberry and cream cheese.',
    prices: { S: '₱70.00', M: '₱90.00', L: '₱110.00' },
  },
  {
    name: 'Iced Caramel Macchiato',
    image: icedCaramelMacchiato,
    description: 'Signature drink with espresso, vanilla, milk, caramel.',
    prices: { S: '₱100.00', M: '₱120.00', L: '₱140.00' },
  },
];

const blogCards = [
  {
    image: require('../../assets/images/raifutiemployees.jpg'),
    title: 'Coffee Connoisseur',
    description: `Jim Karlanda, a coffee enthusiast based in the North West of England. Jim is the founder, author, and chief brewer behind CoffeeKingClub, The CoffeeWeek, and The Coffee Way. You can channel his best insight being asked many times, 'I’m not from Yorkshire.'`,
  },
  {
    image: require('../../assets/images/coffee1.jpg'),
    title: 'Coffee Connoisseur',
    description: `Jim Karlanda, a coffee enthusiast based in the North West of England. Jim is the founder, author, and chief brewer behind CoffeeKingClub, The CoffeeWeek, and The Coffee Way. You can channel his best insight being asked many times, 'I’m not from Yorkshire.'`,
  },
  {
    image: require('../../assets/images/signage.jpg'),
    title: 'Coffee Connoisseur',
    description: `Jim Karlanda, a coffee enthusiast based in the North West of England. Jim is the founder, author, and chief brewer behind CoffeeKingClub, The CoffeeWeek, and The Coffee Way. You can channel his best insight being asked many times, 'I’m not from Yorkshire.'`,
  },
];

// ===== Components =====
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

function MenuBox({ name, image, prices, description, onMenuBoxBottomRowClick }) {
  const [selectedSize, setSelectedSize] = useState('L');
  return (
    <div className={styles.menuBox}>
      <img src={image} alt={name} className={styles.menuImage} />
      <div className={styles.boxPanel}></div>
      <div className={styles.menuBoxInfo}>
        <div className={styles.menuBoxName}>{name}</div>
        <div className={styles.menuBoxDesc}>{description}</div>
        <div
          className={styles.menuBoxBottomRow}
          onClick={onMenuBoxBottomRowClick}
        >
          <div className={styles.menuBoxPrice}>
            {prices[selectedSize]}
          </div>
          <div className={styles.menuBoxSizes}>
            {['S', 'M', 'L'].map(size => (
              <button
                key={size}
                className={`${styles.sizeButton} ${selectedSize === size ? styles.selectedSizeButton : ''}`}
                onClick={() => setSelectedSize(size)}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Main Home Function =====
export default function Home() {
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const autoplayTimeout = useRef(null);

  const handleMenuBoxBottomRowClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
      if (autoplayTimeout.current) clearTimeout(autoplayTimeout.current);
      autoplayTimeout.current = setTimeout(() => {
        swiperRef.current.swiper.autoplay.start();
      }, 3000);
    }
  };

  return (
    <div className={styles.container}>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.signageHeroSection}>
        <div id="home" className={styles.heroImageWrapper}>
          <img src={signage} alt="Home" className={styles.heroImage} />
          <div className={styles.signageHeroContent}>
            <h1 className={styles.signageHeroTitle}>{signageSectionData.title}</h1>
            <h2 className={styles.signageHeroSubtitle}>{signageSectionData.subtitle}</h2>
            <p className={styles.signageHeroDesc}>{signageSectionData.description}</p>
          </div>
        </div>
      </section>

      {/* ===== ICONS SECTION ===== */}
      <section className={styles.iconsSection}>
        <div className={styles.iconItem}>
          <img src={coffee} alt="Coffee" className={styles.iconImage}/>
          <p>Coffee</p>
        </div>
        <div className={styles.iconItem}>
          <img src={drinks} alt="Milk Tea" className={styles.iconImage}/>
          <p>Milk Tea</p>
        </div>
        <div className={styles.iconItem}>
          <img src={desserts} alt="Desserts" className={styles.iconImage}/>
          <p>Desserts</p>
        </div>
      </section>

      {/* ===== TOP COFFEE SALE ===== */}
      <div className={styles.topCoffeeSaleOuterContainer}>
        <div className={styles.menuBoxContainer}>
          <div>
            <span className={styles.topCoffeeSaleLabel}>Top Coffee Sale</span>
            <span className={styles.topCoffeeSaleSubLabel}>Your Favorite Blends at Unbeatable Prices</span>
          </div>
          <div className={styles.menusContainer}>
            {menuBoxes.slice(0, 3).map((item, idx) => (
              <MenuBox
                key={idx}
                name={item.name}
                image={item.image}
                prices={item.prices}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== TOP PRODUCT SALE (Carousel) ===== */}
      <section className={styles.containerBoxSection}>
        <div className={styles.bestSellersHeader}>
          <h2 className={styles.sectionTitle}> Top Product Sale </h2>
          <p className={styles.sectionDescription}>
            Customer favorites, tried and true!
          </p>
        </div>
        <div className={styles.carouselContainerBox}>
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay]}
            spaceBetween={200}
            slidesPerView={3}
            autoplay={{ delay: 2200, disableOnInteraction: false }}
            loop={true}
            className={styles.swiperContainerBox}
            breakpoints={{
              320: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 }
            }}
          >
            {containerBoxMenus.map((item, idx) => (
              <SwiperSlide key={idx}>
                <MenuBox
                  name={item.name}
                  image={item.image}
                  prices={item.prices}
                  description={item.description}
                  onMenuBoxBottomRowClick={handleMenuBoxBottomRowClick}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ===== OUR MENU SECTION ===== */}
      <div className={styles.ourMenuOuterContainer}>
        <section id="menu" className={styles.ourMenuSection}>
          <h2 className={styles.ourMenuTitle}>Our Menu</h2>
          <p className={styles.ourMenuDescription}>Explore our delicious offerings!</p>
          <div className={styles.ourMenuGrid}>
            <div className={styles.ourMenuRow}>
              {containerBoxMenus.slice(0, 3).map((item, idx) => (
                <MenuBox
                  key={idx}
                  name={item.name}
                  image={item.image}
                  prices={item.prices}
                  description={item.description}
                />
              ))}
            </div>
            <div className={styles.ourMenuRow}>
              {containerBoxMenus.slice(0, 3).map((item, idx) => (
                <MenuBox
                  key={idx + 3}
                  name={item.name}
                  image={item.image}
                  prices={item.prices}
                  description={item.description}
                />
              ))}
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                className={styles.viewMoreButton}
                onClick={() => navigate('/menu')}
              >
                View More
              </button>
            </div>
          </div>
        </section>
      </div>
      
      {/* ===== PROMO SECTION ===== */}
      <div id="promotions" className={styles.promoSection}>
        <div className={styles.promoTextCol}>
          <div className={styles.promoTitleMain}>Caramel Latte</div>
          <div className={styles.promoTitleSub}>Milk Tea</div>
          <div className={styles.promoDivider} />
          <div className={styles.promoPrice}>₱ 100.00 </div>
          <div className={styles.promoDesc}>
            The Caramel Latte offers a surprising and delightful combination of premium caramel with rich creamy notes and natural sweetness, mixed with the signature espresso for a complete taste.
          </div>
        </div>
        <div className={styles.promoImageCol}>
          <img
            src={require('../../assets/images/CortadoCoffee.jpg')}
            alt="Matcha Fusion"
            className={styles.promoImage}
          />
        </div>
        <div className={styles.promoCircleLeft} />
        <div className={styles.promoCircleRight} />
      </div>

      {/* ===== ABOUT US & OUR TEAM ===== */}
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => {
          navigate('/about');
          window.scrollTo({ top: 0, behavior: 'auto' });
        }}
      >
        {/* ABOUT US SECTION */}
        <section id="about" className={styles.containerBlack}>
          <div className={styles.containerBlackImgWrapper}>
            <img
              src={require('../../assets/images/Raifuti2.jpg')}
              alt="Your Custom"
              className={styles.containerBlackImg}
            />
            <div className={styles.containerBlackText}>
              <h2>About Us</h2>
              <p> Welcome to Raifuti! We are passionate about crafting the perfect cup of coffee and serving delicious treats in a cozy atmosphere.</p>
            </div>
          </div>
        </section>
      

        {/* OUR TEAM SECTION */}
        <section className={styles.containerBoxAboutUs}>
          <div className={styles.containerText}>
            <h2>Our Team</h2>
            <p>
              Meet the passionate people behind Raifuti! Our baristas and staff are dedicated to making every visit special, from expertly crafted drinks to friendly service. .
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
      </div>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section id="reviews" className={styles.testimonialsSection}>
        <div className={styles.testimonialsHeader}>
          <h2>What Our Clients Say</h2>
          <p>
            At Coffee Heaven, we believe that the best coffee shop is the one that lets you relax and enjoy every moment. Hear what our guests have to say!
          </p>
        </div>
        <div className={styles.testimonialsCards}>
          {/* Testimonial 1 */}
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.testimonialText}>
              “From the moment you step inside, the inviting aroma of freshly brewed coffee envelops you.”
            </p>
            <div className={styles.testimonialProfile}>
              <img src={require('../../assets/images/raifutiemployees.jpg')} alt="Karen H." className={styles.profileImg} />
              <span className={styles.profileName}>Krystel C.</span>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.testimonialText}>
              “What sets this coffee shop apart is not just the fantastic coffee but also the welcoming ambiance.”
            </p>
            <div className={styles.testimonialProfile}>
              <img src={require('../../assets/images/raifutiemployees.jpg')} alt="Art M." className={styles.profileImg} />
              <span className={styles.profileName}>Anthony B.</span>
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.testimonialText}>
              “If you’re a coffee lover like me, do yourself a favor and pay a visit – you won’t be disappointed!”
            </p>
            <div className={styles.testimonialProfile}>
              <img src={require('../../assets/images/raifutiemployees.jpg')} className={styles.profileImg} />
              <span className={styles.profileName}>Meime D.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT US SECTION ===== */}
      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactFlexRow}>
          {/* Left: Contact Details */}
          <div className={styles.contactTextBlock}>
            <div className={styles.contactDetails}>
              <div className={styles.emailContainer}>
                <img src={email} alt="Email" className={`${styles.iconContactImage} ${styles.iconSmall}`}/>
                <p><strong>Email:</strong> info@brewnative.com</p>
              </div>
              <div className={styles.containerContactNumber}>
                <img src={phone} alt="Phone Number" className={`${styles.iconContactImage} ${styles.iconSmall}`}/>
                <p><strong>Phone:</strong> (123) 456-7890</p>
              </div>
              <div className={styles.containerLocation}>
                <img src={location} alt="Location" className={`${styles.iconContactImage} ${styles.iconSmall}`}/>
                <p><strong>Location:</strong> 123 Coffee Lane, Brewtown</p>
              </div>
            </div>
          </div>
          {/* Right: Contact Box with Map */}
          <div
            className={styles.contactContainer}
            role="button"
            tabIndex={0}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'auto' });
              navigate('/contact');
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.scrollTo({ top: 0, behavior: 'auto' });
                navigate('/contact');
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <h2>Contact Us</h2>
            <p>We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, reach out to us below.</p>
            <div className={styles.mapContainer}>
              <iframe
                title="Raifuti Location"
                src="https://www.google.com/maps?q=Raifuti%2C%2018%20de%20Julio%20Street%2C%20Minglanilla%2C%20Cebu&output=embed"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SCROLL UP BUTTON ===== */}
      <ScrollUpButton />
    </div>
  );
}