import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Menu.module.css';
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
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

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

// New variable names for Menu page
const menuCarouselItems = [
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
		image: require('../../assets/images/milktea1.jpg'),
		description: 'Signature drink with espresso, vanilla, milk, caramel.',
		prices: { S: '₱100.00', M: '₱120.00', L: '₱140.00' },
	},
];

function MenuCarouselBox({ name, image, prices, description }) {
	const [selectedSize, setSelectedSize] = React.useState('L');
	return (
		<div className={styles.menuBox}>
			<img src={image} alt={name} className={styles.menuImage} />
			<div className={styles.boxPanel}></div>
			<div className={styles.menuBoxInfo}>
				<div className={styles.menuBoxName}>{name}</div>
				<div className={styles.menuBoxDesc}>{description}</div>
				<div className={styles.menuBoxBottomRow}>
					<div className={styles.menuBoxPrice}>{prices[selectedSize]}</div>
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

export default function Menu() {
	useScrollToTopOnMount();
	// View More button handler (for when used from Home page)
	// Not used here, but if you want to show a View More button on this page, you can add it below.
	const swiperRef = useRef(null);

	// New menu grid data for second section
		const menuGridItems = [
			{
				name: 'Mocha Frappe',
				image: require('../../assets/images/frappe1.jpg'),
				description: 'Chilled espresso with chocolate and cream.',
				prices: { S: '₱150.00', M: '₱170.00', L: '₱190.00' },
			},
			{
				name: 'Mango Supreme Cake',
				image: require('../../assets/images/mangosupremecake.jpg'),
				description: 'A tropical delight with fresh mangoes.',
				prices: { S: '₱180.00', M: '₱200.00', L: '₱220.00' },
			},
			{
				name: 'Death by Chocolate Cake',
				image: require('../../assets/images/deathbychocolatecake.jpg'),
				description: 'Rich chocolate cake for chocolate lovers.',
				prices: { S: '₱190.00', M: '₱210.00', L: '₱230.00' },
			},
			{
				name: 'Mocha Frappe',
				image: require('../../assets/images/frappe1.jpg'),
				description: 'Chilled espresso with chocolate and cream.',
				prices: { S: '₱150.00', M: '₱170.00', L: '₱190.00' },
			},
			{
				name: 'Mango Supreme Cake',
				image: require('../../assets/images/mangosupremecake.jpg'),
				description: 'A tropical delight with fresh mangoes.',
				prices: { S: '₱180.00', M: '₱200.00', L: '₱220.00' },
			},
			{
				name: 'Death by Chocolate Cake',
				image: require('../../assets/images/deathbychocolatecake.jpg'),
				description: 'Rich chocolate cake for chocolate lovers.',
				prices: { S: '₱190.00', M: '₱210.00', L: '₱230.00' },
			},
			{
				name: 'Blueberry Cream Cheese',
				image: require('../../assets/images/blueberrycreamcheese.jpg'),
				description: 'Moist muffin with blueberry and cream cheese.',
				prices: { S: '₱120.00', M: '₱140.00', L: '₱160.00' },
			},
			{
				name: 'Iced Caramel Macchiato',
				image: require('../../assets/images/IcedCaramelMacchiato.jpg'),
				description: 'Signature drink with espresso, vanilla, milk, caramel.',
				prices: { S: '₱160.00', M: '₱180.00', L: '₱200.00' },
			},
			{
				name: 'Tiramisu Cake',
				image: require('../../assets/images/tiramisucake.jpg'),
				description: 'Classic Italian dessert with coffee and mascarpone.',
				prices: { S: '₱170.00', M: '₱190.00', L: '₱210.00' },
			},
		];

	function MenuGridBox({ name, image, prices, description }) {
		const [selectedSize, setSelectedSize] = React.useState('L');
		return (
			<div className={styles.menuBox}>
				<img src={image} alt={name} className={styles.menuImage} />
				<div className={styles.boxPanel}></div>
				<div className={styles.menuBoxInfo}>
					<div className={styles.menuBoxName}>{name}</div>
					<div className={styles.menuBoxDesc}>{description}</div>
					<div className={styles.menuBoxBottomRow}>
						<div className={styles.menuBoxPrice}>{prices[selectedSize]}</div>
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
          // Scroll to top on mount
        function useScrollToTopOnMount() {
          useEffect(() => {
            window.scrollTo({ top: 0, behavior: 'auto' });
          }, []);
        }
				return (
					<>
						<section className={styles.containerBoxSection}>
							<div className={styles.bestSellersHeader}>
								<h2 className={styles.sectionTitle}>Top Product Sale</h2>
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
									{menuCarouselItems.map((item, idx) => (
										<SwiperSlide key={idx}>
											<MenuCarouselBox
												name={item.name}
												image={item.image}
												prices={item.prices}
												description={item.description}
											/>
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						</section>

						<section className={styles.secondSection}>
							<div className={styles.secondSectionContent}>
								<h2 className={`${styles.sectionTitle} ${styles.menuSectionBrown}`}>Our Menu</h2>
								<p className={`${styles.sectionDescription} ${styles.menuSectionBrown}`}>Explore our delicious offerings!</p>
								<div className={styles.menuGrid}>
									<div className={styles.menuGridRow}>
										{menuGridItems.slice(0, 3).map((item, idx) => (
											<MenuGridBox
												key={idx}
												name={item.name}
												image={item.image}
												prices={item.prices}
												description={item.description}
											/>
										))}
									</div>
									<div className={styles.menuGridRow}>
										{menuGridItems.slice(3, 6).map((item, idx) => (
											<MenuGridBox
												key={idx + 3}
												name={item.name}
												image={item.image}
												prices={item.prices}
												description={item.description}
											/>
										))}
									</div>
									<div className={styles.menuGridRow}>
										{menuGridItems.slice(6, 9).map((item, idx) => (
											<MenuGridBox
												key={idx + 6}
												name={item.name}
												image={item.image}
												prices={item.prices}
												description={item.description}
											/>
										))}
									</div>
								</div>
							</div>
						</section>

						{/* ===================== SCROLL UP BUTTON ===================== */}
						<ScrollUpButton />
					</>
				);
}
