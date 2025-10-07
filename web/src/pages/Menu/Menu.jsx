import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Menu.module.css';
import signage from '../../assets/images/Final-image-raifuti.jpg';
import icedCaramelMacchiato from '../../assets/images/IcedCaramelMacchiato.jpg';
import cappuccino from '../../assets/images/Cappuccino.jpg';
<<<<<<< HEAD
import tiramisucake from '../../assets/images/tiramisucake.jpg';
import caramelapplecake from '../../assets/images/caramelapplecake.jpg';
=======
>>>>>>> f793f28 (Second push)
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
<<<<<<< HEAD
		image: require('../../assets/images/frappe1.jpg'),
=======
		image: require('../../assets/images/coffee/mocha.png'),
>>>>>>> f793f28 (Second push)
		description: 'Chilled espresso with chocolate and cream.',
		prices: { S: '₱110.00', M: '₱130.00', L: '₱150.00' },
	},
	{
		name: 'Mango Supreme Cake',
<<<<<<< HEAD
		image: require('../../assets/images/mangosupremecake.jpg'),
=======
		image: require('../../assets/images/cake/mango.png'),
>>>>>>> f793f28 (Second push)
		description: 'A tropical delight with fresh mangoes.',
		prices: { S: '₱120.00', M: '₱150.00', L: '₱180.00' },
	},
	{
		name: 'Death by Chocolate Cake',
<<<<<<< HEAD
		image: require('../../assets/images/deathbychocolatecake.jpg'),
=======
		image: require('../../assets/images/cake/chocolate.png'),
>>>>>>> f793f28 (Second push)
		description: 'Rich chocolate cake for chocolate lovers.',
		prices: { S: '₱130.00', M: '₱160.00', L: '₱190.00' },
	},
	{
		name: 'Blueberry Cream Cheese',
<<<<<<< HEAD
		image: require('../../assets/images/blueberrycreamcheese.jpg'),
=======
		image: require('../../assets/images/cake/mousse.png'),
>>>>>>> f793f28 (Second push)
		description: 'Moist muffin with blueberry and cream cheese.',
		prices: { S: '₱70.00', M: '₱90.00', L: '₱110.00' },
	},
	{
		name: 'Iced Caramel Macchiato',
<<<<<<< HEAD
		image: require('../../assets/images/milktea1.jpg'),
		description: 'Signature drink with espresso, vanilla, milk, caramel.',
		prices: { S: '₱100.00', M: '₱120.00', L: '₱140.00' },
	},
];

=======
		image: require('../../assets/images/coffee/macchiato.png'),
		description: 'Signature drink with espresso, vanilla, milk, caramel.',
		prices: { S: '₱100.00', M: '₱120.00', L: '₱140.00' },
	},
	{
		name: 'Caramel Apple Cake',
		image: require('../../assets/images/cake/caramel.png'),
		description: 'Sweet and tangy caramel apple flavored cake.',
		prices: { S: '₱175.00', M: '₱195.00', L: '₱215.00' },
		category: 'desserts'
	},
];

// Categorized menu data
const allMenuItems = {
	coffee: [
		{
			name: 'Mocha Frappe',
			image: require('../../assets/images/coffee/mocha.png'),
			description: 'Chilled espresso with chocolate and cream.',
			prices: { S: '₱150.00', M: '₱170.00', L: '₱190.00' },
			category: 'coffee'
		},
		{
			name: 'Iced Caramel Macchiato',
			image: require('../../assets/images/coffee/macchiato.png'),
			description: 'Signature drink with espresso, vanilla, milk, caramel.',
			prices: { S: '₱160.00', M: '₱180.00', L: '₱200.00' },
			category: 'coffee'
		},
		{
			name: 'Cappuccino',
			image: require('../../assets/images/coffee/cappucino.png'),
			description: 'Classic Italian coffee with steamed milk and foam.',
			prices: { S: '₱120.00', M: '₱140.00', L: '₱160.00' },
			category: 'coffee'
		},
		{
			name: 'Cortado Coffee',
			image: require('../../assets/images/coffee/cortado.png'),
			description: 'Equal parts espresso and warm milk.',
			prices: { S: '₱130.00', M: '₱150.00', L: '₱170.00' },
			category: 'coffee'
		},
		{
			name: 'Americano',
			image: require('../../assets/images/coffee/americano.png'),
			description: 'Espresso shots topped with hot water.',
			prices: { S: '₱100.00', M: '₱120.00', L: '₱140.00' },
			category: 'coffee'
		},
		{
			name: 'Vienna',
			image: require('../../assets/images/coffee/vienna.png'),
			description: 'Espresso shots topped with hot water.',
			prices: { S: '₱100.00', M: '₱120.00', L: '₱140.00' },
			category: 'coffee'
		}
	],
	drinks: [
		{
			name: 'Brown Sugar Milk Tea',
			image: require('../../assets/images/milktea/Brown Sugar Milk Tea.png'),
			description: 'Traditional milk tea with tapioca pearls.',
			prices: { S: '₱120.00', M: '₱140.00', L: '₱160.00' },
			category: 'drinks'
		},
		{
			name: 'Classic Milk Tea',
			image: require('../../assets/images/milktea/Classic Milk Tea.png'),
			description: 'Creamy taro flavored milk tea.',
			prices: { S: '₱130.00', M: '₱150.00', L: '₱170.00' },
			category: 'drinks'
		},
		{
			name: 'Coffee Milk Tea',
			image: require('../../assets/images/milktea/Coffee Milk Tea.png'),
			description: 'Rich and creamy Thai-style milk tea.',
			prices: { S: '₱125.00', M: '₱145.00', L: '₱165.00' },
			category: 'drinks'
		},
		{
			name: 'Honeydew Milk Tea',
			image: require('../../assets/images/milktea/Honeydew Milk Tea.png'),
			description: 'Japanese green tea with milk and sweetener.',
			prices: { S: '₱140.00', M: '₱160.00', L: '₱180.00' },
			category: 'drinks'
		},	
		{
			name: 'Lychee Tea',
			image: require('../../assets/images/milktea/Lychee Tea.png'),
			description: 'Japanese green tea with milk and sweetener.',
			prices: { S: '₱140.00', M: '₱160.00', L: '₱180.00' },
			category: 'drinks'
		},
		{
			name: 'Strawberry Tea',
			image: require('../../assets/images/milktea/Strawberry Tea.png'),
			description: 'Japanese green tea with milk and sweetener.',
			prices: { S: '₱140.00', M: '₱160.00', L: '₱180.00' },
			category: 'drinks'
		}
	],
	desserts: [
		{
			name: 'Mango Supreme Cake',
			image: require('../../assets/images/cake/mango.png'),
			description: 'A tropical delight with fresh mangoes.',
			prices: { S: '₱180.00', M: '₱200.00', L: '₱220.00' },
			category: 'desserts'
		},
		{
			name: 'Death by Chocolate Cake',
			image: require('../../assets/images/cake/chocolate.png'),
			description: 'Rich chocolate cake for chocolate lovers.',
			prices: { S: '₱190.00', M: '₱210.00', L: '₱230.00' },
			category: 'desserts'
		},
		{
			name: 'Tiramisu Cake',
			image: require('../../assets/images/cake/tiramisu.png'),
			description: 'Classic Italian dessert with coffee and mascarpone.',
			prices: { S: '₱170.00', M: '₱190.00', L: '₱210.00' },
			category: 'desserts'
		},
		{
			name: 'Blueberry Cream Cheese',
			image: require('../../assets/images/cake/mousse.png'),
			description: 'Moist muffin with blueberry and cream cheese.',
			prices: { S: '₱120.00', M: '₱140.00', L: '₱160.00' },
			category: 'desserts'
		},
		{
			name: 'Caramel Apple Cake',
			image: require('../../assets/images/cake/caramel.png'),
			description: 'Sweet and tangy caramel apple flavored cake.',
			prices: { S: '₱175.00', M: '₱195.00', L: '₱215.00' },
			category: 'desserts'
		},
		{
			name: 'Strawberry Cake',
			image: require('../../assets/images/cake/strawberry.png'),
			description: 'Sweet and tangy strawberry flavored cake.',
			prices: { S: '₱175.00', M: '₱195.00', L: '₱215.00' },
			category: 'desserts'
		}
	]
};

// Flatten all items for default view
const getAllMenuItems = () => {
	return [...allMenuItems.coffee, ...allMenuItems.drinks, ...allMenuItems.desserts];
};

>>>>>>> f793f28 (Second push)
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

<<<<<<< HEAD
export default function Menu() {
	useScrollToTopOnMount();
=======
	// Dock Component for Icons
	function DockComponent({ selectedCategory, setSelectedCategory }) {
		const [hoveredIndex, setHoveredIndex] = useState(null);
		
		const dockItems = [
			{ icon: coffee, label: 'Coffee', id: 'coffee' },
			{ icon: drinks, label: 'Milk Tea', id: 'drinks' },
			{ icon: desserts, label: 'Desserts', id: 'desserts' }
		];

		const getIconScale = (index) => {
			if (hoveredIndex === null) return 1;
			
			const distance = Math.abs(hoveredIndex - index);
			if (distance === 0) return 1.15; // Hovered item
			if (distance === 1) return 1.05; // Adjacent items
			return 1; // Other items
		};

		const handleItemClick = (itemId) => {
			// Toggle category selection: if already selected, show all items
			if (selectedCategory === itemId) {
				setSelectedCategory('all');
			} else {
				setSelectedCategory(itemId);
			}
			
			// Smooth scroll to menu grid
			const menuGrid = document.querySelector('.menuGrid');
			if (menuGrid) {
				menuGrid.scrollIntoView({ 
					behavior: 'smooth', 
					block: 'start',
					inline: 'nearest'
				});
			}
		};

		return (
			<section className={styles.iconsSectionMenu}>
				{dockItems.map((item, index) => (
					<div 
						key={item.id}
						className={`${styles.iconItemMenu} ${selectedCategory === item.id ? styles.iconItemActive : ''}`}
						onMouseEnter={() => setHoveredIndex(index)}
						onMouseLeave={() => setHoveredIndex(null)}
						onClick={() => handleItemClick(item.id)}
						style={{
							transform: `scale(${getIconScale(index)})`,
							transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
						}}
					>
						<img 
							src={item.icon} 
							alt={item.label} 
							className={styles.iconImageMenu}
						/>
						<p>{item.label}</p>
						{selectedCategory === item.id && (
							<div className={styles.activeIndicator}></div>
						)}
					</div>
				))}
			</section>
		);
	}

	export default function Menu() {
	useScrollToTopOnMount();
	
	// State for category filtering
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [filteredItems, setFilteredItems] = useState(getAllMenuItems());
	
	// Filter menu items based on selected category
	useEffect(() => {
		if (selectedCategory === 'all') {
			setFilteredItems(getAllMenuItems());
		} else {
			setFilteredItems(allMenuItems[selectedCategory] || []);
		}
	}, [selectedCategory]);
	
>>>>>>> f793f28 (Second push)
	// View More button handler (for when used from Home page)
	// Not used here, but if you want to show a View More button on this page, you can add it below.
	const swiperRef = useRef(null);

<<<<<<< HEAD
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
=======
	function MenuGridBox({ name, image, prices, description }) {
		const [selectedSize, setSelectedSize] = React.useState('L');
		return (
			<div className={styles.menuGridBox}>
				<img src={image} alt={name} className={styles.menuGridImage} />
				<div className={styles.boxPanel}></div>
				<div className={styles.menuGridBoxInfo}>
					<div className={styles.menuGridBoxName}>{name}</div>
					<div className={styles.menuGridBoxDesc}>{description}</div>
					<div className={styles.menuGridBoxBottomRow}>
						<div className={styles.menuGridBoxPrice}>{prices[selectedSize]}</div>
						<div className={styles.menuGridBoxSizes}>
							{['S', 'M', 'L'].map(size => (
								<button
									key={size}
									className={`${styles.menuGridSizeButton} ${selectedSize === size ? styles.selectedSizeButton : ''}`}
>>>>>>> f793f28 (Second push)
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
<<<<<<< HEAD
=======
						<section className={styles.secondSection}>
							<div className={styles.secondSectionContent}>
								<h2 className={`${styles.sectionTitle} ${styles.menuSectionBrown}`}>Our Menu</h2>
								<p className={`${styles.sectionDescription} ${styles.menuSectionBrown}`}>Explore our delicious offerings!</p>
								
								{/* ===== ICONS SECTION ===== */}
								<DockComponent 
									selectedCategory={selectedCategory} 
									setSelectedCategory={setSelectedCategory} 
								/>

								{/* ===== DYNAMIC MENU GRID ===== */}
								<div className={`${styles.menuGrid} menuGrid`}>
									{filteredItems.length === 0 ? (
										<div className={styles.noItemsMessage}>
											<p>No items found in this category.</p>
										</div>
									) : (
										// Create rows of 3 items each
										Array.from({ length: Math.ceil(filteredItems.length / 3) }, (_, rowIndex) => (
											<div key={rowIndex} className={styles.menuGridRow}>
												{filteredItems.slice(rowIndex * 3, (rowIndex + 1) * 3).map((item, idx) => (
													<MenuGridBox
														key={`${rowIndex}-${idx}`}
														name={item.name}
														image={item.image}
														prices={item.prices}
														description={item.description}
													/>
												))}
											</div>
										))
									)}
								</div>
							</div>
						</section>

>>>>>>> f793f28 (Second push)
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

<<<<<<< HEAD
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

=======
>>>>>>> f793f28 (Second push)
						{/* ===================== SCROLL UP BUTTON ===================== */}
						<ScrollUpButton />
					</>
				);
}
