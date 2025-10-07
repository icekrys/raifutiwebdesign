// ===== Imports =====
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
<<<<<<< HEAD
import { motion } from 'motion/react';
=======
>>>>>>> f793f28 (Second push)
import styles from './Home.module.css';
import 'swiper/css';
import 'swiper/css/navigation';

// ===== Assets =====
<<<<<<< HEAD
import signage from '../../assets/images/Final-image-raifuti.jpg';
import icedCaramelMacchiato from '../../assets/images/IcedCaramelMacchiato.jpg';
import cappuccino from '../../assets/images/Cappuccino.jpg';
import tiramisucake from '../../assets/images/tiramisucake.jpg';
import caramelapplecake from '../../assets/images/caramelapplecake.jpg';
import CortadoCoffee from '../../assets/images/CortadoCoffee.jpg';
=======
import signage from '../../assets/images/Milk_Tea.jpg';
import milktea1 from '../../assets/images/milktea/Classic Milk Tea.png';
import milktea2 from '../../assets/images/milktea/Matcha Tea.png';
import milktea3 from '../../assets/images/milktea/Strawberry Tea.png';
import generatedmilktea from '../../assets/images/milktea/Classic Milk Tea.png';
import generatedmilktea1 from '../../assets/images/milktea/Wintermelo Milk Tea.png';
import generatedmilktea2 from '../../assets/images/milktea/Brown Sugar Milk Tea.png';
>>>>>>> f793f28 (Second push)
import coffee from '../../assets/icons/coffeea.png';
import phone from '../../assets/icons/call2.jpg';
import email from '../../assets/icons/email1.jpg';
import location from '../../assets/icons/location.jpg';
import drinks from '../../assets/icons/beverage.png';
import desserts from '../../assets/icons/cake2.png';

// ===== Static Data =====
const signageSectionData = {
<<<<<<< HEAD
  title: 'Welcome to Raifuti',
  subtitle: 'Your Cozy Coffee Haven',
  description: 'Enjoy our signature blends and delicious desserts in a relaxing atmosphere.',
=======
  title: 'Boba & Beyond',
  subtitle: 'Sip happiness, taste the magic, and smile with every drink!',
  description: 'At Raifuti, we blend coffee, tea, and bubbles into unforgettable moments',
>>>>>>> f793f28 (Second push)
};

const menuBoxes = [
  {
<<<<<<< HEAD
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
=======
    name: 'Classic Milk Tea',
    image: milktea1,
    prices: { S: '₱80.00', M: '₱100.00', L: '₱120.00' },
    description: 'Traditional milk tea with rich black tea and creamy milk.',
  },
  {
    name: 'Matcha Milk Tea',
    image: milktea2,
    prices: { S: '₱90.00', M: '₱110.00', L: '₱130.00' },
    description: 'Creamy taro-flavored milk tea with a sweet purple taste.',
  },
  {
    name: 'Strawberry Milk Tea',
    image: milktea3,
    prices: { S: '₱95.00', M: '₱115.00', L: '₱135.00' },
    description: 'Rich strawberry flavor with fresh milk and chewy pearls.',
  },
  {
    name: 'Thai Milk Tea',
    image: generatedmilktea,
    prices: { S: '₱85.00', M: '₱105.00', L: '₱125.00' },
    description: 'Authentic Thai tea with condensed milk and spices.',
  },
  {
    name: 'Matcha Milk Tea',
    image: generatedmilktea1,
    prices: { S: '₱100.00', M: '₱120.00', L: '₱140.00' },
    description: 'Premium Japanese matcha with smooth milk blend.',
  },
  {
    name: 'Honeydew Milk Tea',
    image: generatedmilktea2,
    prices: { S: '₱90.00', M: '₱110.00', L: '₱130.00' },
    description: 'Refreshing honeydew melon flavor with creamy milk.',
>>>>>>> f793f28 (Second push)
  },
];

const containerBoxMenus = [
  {
    name: 'Mocha Frappe',
<<<<<<< HEAD
    image: require('../../assets/images/frappe1.jpg'),
=======
    image: require('../../assets/images/coffee/affogato.png'),
>>>>>>> f793f28 (Second push)
    description: 'Chilled espresso with chocolate and cream.',
    prices: { S: '₱110.00', M: '₱130.00', L: '₱150.00' },
  },
  {
    name: 'Mango Supreme Cake',
<<<<<<< HEAD
    image: require('../../assets/images/mangosupremecake.jpg'),
=======
    image: require('../../assets/images/cake/chocolate.png'),
>>>>>>> f793f28 (Second push)
    description: 'A tropical delight with fresh mangoes.',
    prices: { S: '₱120.00', M: '₱150.00', L: '₱180.00' },
  },
  {
    name: 'Death by Chocolate Cake',
<<<<<<< HEAD
    image: require('../../assets/images/deathbychocolatecake.jpg'),
=======
    image: require('../../assets/images/milktea/Strawberry Tea.png'),
>>>>>>> f793f28 (Second push)
    description: 'Rich chocolate cake for chocolate lovers.',
    prices: { S: '₱130.00', M: '₱160.00', L: '₱190.00' },
  },
  {
    name: 'Blueberry Cream Cheese',
<<<<<<< HEAD
    image: require('../../assets/images/blueberrycreamcheese.jpg'),
=======
    image: require('../../assets/images/milktea/Taro Tea.png'),
>>>>>>> f793f28 (Second push)
    description: 'Moist muffin with blueberry and cream cheese.',
    prices: { S: '₱70.00', M: '₱90.00', L: '₱110.00' },
  },
  {
    name: 'Iced Caramel Macchiato',
<<<<<<< HEAD
    image: icedCaramelMacchiato,
=======
    image: require('../../assets/images/milktea/Thai Tea.png'),
    description: 'Signature drink with espresso, vanilla, milk, caramel.',
    prices: { S: '₱100.00', M: '₱120.00', L: '₱140.00' },
  },
   {
    name: 'Mango Supreme Cake',
    image: require('../../assets/images/cake/mango.png'),
>>>>>>> f793f28 (Second push)
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
<<<<<<< HEAD
    image: require('../../assets/images/signage.jpg'),
=======
    image: require('../../assets/images/raifutiemployees.jpg'),
>>>>>>> f793f28 (Second push)
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

<<<<<<< HEAD
function MenuBox({ name, image, prices, description, onMenuBoxBottomRowClick }) {
  const [selectedSize, setSelectedSize] = useState('L');
  return (
    <div className={styles.menuBox}>
      <img src={image} alt={name} className={styles.menuImage} />
      <div className={styles.boxPanel}></div>
      <div className={styles.menuBoxInfo}>
        <div className={styles.menuBoxName}>{name}</div>
        <div className={styles.menuBoxDesc}>{description}</div>
=======
function MenuBox({ name, image, prices, description, onMenuBoxBottomRowClick, isCarousel = false }) {
  const [selectedSize, setSelectedSize] = useState('L');
  
  const boxClass = isCarousel ? styles.carouselMenuBox : styles.menuBox;
  const infoClass = isCarousel ? styles.carouselMenuBoxInfo : styles.menuBoxInfo;
  const nameClass = isCarousel ? styles.carouselMenuBoxName : styles.menuBoxName;
  const descClass = isCarousel ? styles.carouselMenuBoxDesc : styles.menuBoxDesc;
  const priceClass = isCarousel ? styles.carouselMenuBoxPrice : styles.menuBoxPrice;
  
  return (
    <div className={boxClass}>
      <img src={image} alt={name} className={styles.menuImage} />
      <div className={styles.boxPanel}></div>
      <div className={infoClass}>
        <div className={nameClass}>{name}</div>
        <div className={descClass}>{description}</div>
>>>>>>> f793f28 (Second push)
        <div
          className={styles.menuBoxBottomRow}
          onClick={onMenuBoxBottomRowClick}
        >
<<<<<<< HEAD
          <div className={styles.menuBoxPrice}>
=======
          <div className={priceClass}>
>>>>>>> f793f28 (Second push)
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

<<<<<<< HEAD
=======
  const handlePromoButtonClick = () => {
    const promoSection = document.getElementById('promotions');
    if (promoSection) {
      promoSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

>>>>>>> f793f28 (Second push)
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
<<<<<<< HEAD
=======
            <button className={styles.promoButton} onClick={handlePromoButtonClick}>
              <span className={styles.promoButtonText}>Promo</span>
            </button>
          </div>
          <div className={styles.signageHeroImageContainer}>
            <img src={signage} alt="Milk Tea" className={styles.signageHeroImageDisplay} />
>>>>>>> f793f28 (Second push)
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
<<<<<<< HEAD
            <span className={styles.topCoffeeSaleLabel}>Top Coffee Sale</span>
=======
            <span className={styles.topCoffeeSaleLabel}>TOP MILK TEA SALE</span>
>>>>>>> f793f28 (Second push)
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
<<<<<<< HEAD
          <h2 className={styles.sectionTitle}> Top Product Sale </h2>
=======
          <h2 className={styles.sectionTitle}> TOP PRODUCT SALE </h2>
>>>>>>> f793f28 (Second push)
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
<<<<<<< HEAD
=======
                  isCarousel={true}
>>>>>>> f793f28 (Second push)
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ===== OUR MENU SECTION ===== */}
      <div className={styles.ourMenuOuterContainer}>
        <section id="menu" className={styles.ourMenuSection}>
<<<<<<< HEAD
          <h2 className={styles.ourMenuTitle}>Our Menu</h2>
=======
          <h2 className={styles.ourMenuTitle}>OUR MENU</h2>
>>>>>>> f793f28 (Second push)
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
<<<<<<< HEAD
              {containerBoxMenus.slice(0, 3).map((item, idx) => (
=======
              {containerBoxMenus.slice(3, 6).map((item, idx) => (
>>>>>>> f793f28 (Second push)
                <MenuBox
                  key={idx + 3}
                  name={item.name}
                  image={item.image}
                  prices={item.prices}
                  description={item.description}
                />
              ))}
            </div>
<<<<<<< HEAD
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
=======
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '16px' }}>
>>>>>>> f793f28 (Second push)
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
<<<<<<< HEAD
        <div className={styles.promoCircleLeft} />
        <div className={styles.promoCircleRight} />
=======
>>>>>>> f793f28 (Second push)
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