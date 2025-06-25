import { useState, useEffect, useMemo } from 'react';
import CocktailCard from './CocktailCard';

const Content = () => {
	const [activeCategory, setActiveCategory] = useState('signature');
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [cardsPerView, setCardsPerView] = useState(1);

	// Handle responsive cards per view
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setCardsPerView(3); // lg and above
			} else if (window.innerWidth >= 768) {
				setCardsPerView(2); // md
			} else {
				setCardsPerView(1); // sm and below
			}
		};

		handleResize(); // Set initial value
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Sample cocktail data organized by categories
	const cocktailData = useMemo(
		() => ({
			signature: [
				{
					id: 1,
					name: 'Gin Martini',
					image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
					difficulty: 'Intermediate',
					prepTime: '3 min',
					description:
						'The quintessential gin cocktail, crisp and clean Classic cocktail with a twist of lemon or olive',
					rating: 4.9,
				},
				{
					id: 2,
					name: 'Vodka Martini',
					image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
					difficulty: 'Intermediate',
					prepTime: '3 min',
					description:
						'Smooth Classic vodka cocktail with a twist of lemon or olive',
					rating: 4.7,
				},
				{
					id: 3,
					name: 'Mojito',
					image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
					difficulty: 'Intermediate',
					prepTime: '3 min',
					description:
						'Refreshing mint and lime cocktail with a hint of sweetness',
					rating: 4.8,
				},
				{
					id: 4,
					name: 'Dirty Martini',
					image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
					difficulty: 'Expert',
					prepTime: '4 min',
					description: 'Savory twist on the classic with olive brine',
					rating: 5.0,
				},
			],
			classics: [
				{
					id: 5,
					name: 'Caipinhira',
					image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
					difficulty: 'Intermediate',
					prepTime: '3 min',
					description:
						'Brazilian National drink, made with cachaça, lime, and sugar',
					rating: 4.8,
				},
				{
					id: 6,
					name: 'Old Fashioned',
					image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
					difficulty: 'Beginner',
					prepTime: '3 min',
					description:
						'Timeless whiskey cocktail with sugar and bitters',
					rating: 4.7,
				},
				{
					id: 7,
					name: 'Negroni',
					image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
					difficulty: 'Beginner',
					prepTime: '2 min',
					description:
						'Perfect balance of gin, vermouth, and Campari',
					rating: 4.5,
				},
				{
					id: 8,
					name: 'Manhattan',
					image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
					difficulty: 'Beginner',
					prepTime: '2 min',
					description:
						'Perfect balance of gin, vermouth, and Campari',
					rating: 4.5,
				},
			],
			seasonal: [
				{
					id: 8,
					name: 'Aperol Spritz',
					image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
					difficulty: 'Intermediate',
					prepTime: '4 min',
					description:
						'Refreshing Italian spritz with Aperol, prosecco, and soda',
					rating: 4.7,
				},
				{
					id: 9,
					name: 'Winter Warmer',
					image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
					difficulty: 'Advanced',
					prepTime: '6 min',
					description:
						'Spiced rum, apple cider, and cinnamon for a cozy drink',
					rating: 4.7,
				},
			],
		}),
		[],
	);

	const categories = [
		{
			id: 'signature',
			label: 'Signature Collection',
			icon: '👑',
			description: 'Our masterfully crafted signature cocktails',
		},
		{
			id: 'classics',
			label: 'Timeless Classics',
			icon: '🎩',
			description: 'Traditional cocktails perfected over time',
		},
		{
			id: 'seasonal',
			label: 'Seasonal Specials',
			icon: '🍂',
			description: 'Limited time seasonal creations',
		},
	];

	const currentCocktails = cocktailData[activeCategory];
	const maxSlides = Math.max(0, currentCocktails.length - cardsPerView);

	// Auto-play functionality
	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
		}, 4000);

		return () => clearInterval(interval);
	}, [maxSlides, isAutoPlaying]);

	// Reset slide when category changes
	useEffect(() => {
		setCurrentSlide(0);
	}, [activeCategory]);

	const handlePrevSlide = () => {
		setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
		setIsAutoPlaying(false);
	};

	const handleNextSlide = () => {
		setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
		setIsAutoPlaying(false);
	};

	const handleCategoryChange = (categoryId) => {
		setActiveCategory(categoryId);
		setIsAutoPlaying(true);
	};

	return (
		<section className='bg-gradient-to-br from-black via-gray-900 to-black py-12 sm:py-16 lg:py-24 relative overflow-hidden'>
			{/* Art Deco Background Pattern - Mobile Optimized */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/10 to-transparent'></div>
				<div className='absolute top-8 sm:top-20 left-8 sm:left-20 w-20 sm:w-32 h-20 sm:h-32 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-8 sm:bottom-20 right-8 sm:right-20 w-16 sm:w-24 h-16 sm:h-24 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/2 left-4 sm:left-10 w-12 sm:w-16 h-12 sm:h-16 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/3 right-4 sm:right-10 w-14 sm:w-20 h-14 sm:h-20 border border-yellow-400/20 rotate-45'></div>
			</div>

			<div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10'>
				{/* Section Header - Mobile Optimized */}
				<div className='text-center mb-12 sm:mb-16'>
					{/* Golden decorative line - Mobile responsive */}
					<div className='w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-4 sm:mb-6'></div>

					<h2 className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-3 sm:mb-4 tracking-widest uppercase px-2'>
						Cocktail{' '}
						<span className='text-yellow-400'>Collection</span>
					</h2>

					<p className='text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto font-light italic px-4'>
						"Discover the finest cocktails crafted with precision
						and passion"
					</p>

					{/* Bottom decorative line - Mobile responsive */}
					<div className='w-12 sm:w-16 h-0.5 bg-yellow-400 mx-auto mt-4 sm:mt-6'></div>
				</div>

				{/* Category Navigation - Mobile Optimized */}
				<div className='flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-2'>
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => handleCategoryChange(category.id)}
							className={`group relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 border transition-all duration-500 w-full sm:w-auto ${
								activeCategory === category.id
									? 'border-yellow-400 bg-yellow-400 text-black'
									: 'border-yellow-400/30 text-gray-400 hover:border-yellow-400/60 hover:text-white'
							}`}
						>
							{/* Art Deco corners - Mobile responsive */}
							<div className='absolute top-0 left-0 w-2 sm:w-3 h-2 sm:h-3 border-l border-t border-yellow-400'></div>
							<div className='absolute top-0 right-0 w-2 sm:w-3 h-2 sm:h-3 border-r border-t border-yellow-400'></div>
							<div className='absolute bottom-0 left-0 w-2 sm:w-3 h-2 sm:h-3 border-l border-b border-yellow-400'></div>
							<div className='absolute bottom-0 right-0 w-2 sm:w-3 h-2 sm:h-3 border-r border-b border-yellow-400'></div>

							<div className='flex items-center justify-center sm:justify-start gap-2 sm:gap-3'>
								<span className='text-xl sm:text-2xl'>
									{category.icon}
								</span>
								<div className='text-center sm:text-left'>
									<div className='font-light tracking-wide uppercase text-xs sm:text-sm'>
										{category.label}
									</div>
									<div className='text-xs opacity-70 mt-1 hidden sm:block'>
										{category.description}
									</div>
								</div>
							</div>
						</button>
					))}
				</div>

				{/* Carousel Container - Mobile Optimized */}
				<div className='relative'>
					{/* Navigation Buttons - Mobile responsive */}
					<button
						onClick={handlePrevSlide}
						className='absolute left-0 sm:left-0 top-1/2 transform -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 bg-black/70 border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 group'
						disabled={currentSlide === 0 && maxSlides === 0}
					>
						<div className='absolute top-0 left-0 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l border-t border-yellow-400'></div>
						<div className='absolute top-0 right-0 w-2 h-2 border-r border-t border-yellow-400'></div>
						<div className='absolute bottom-0 left-0 w-2 h-2 border-l border-b border-yellow-400'></div>
						<div className='absolute bottom-0 right-0 w-2 h-2 border-r border-b border-yellow-400'></div>
						<span className='text-xl'>‹</span>
					</button>

					<button
						onClick={handleNextSlide}
						className='absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-black/70 border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 group'
						disabled={currentSlide === maxSlides && maxSlides === 0}
					>
						<div className='absolute top-0 left-0 w-2 h-2 border-l border-t border-yellow-400'></div>
						<div className='absolute top-0 right-0 w-2 h-2 border-r border-t border-yellow-400'></div>
						<div className='absolute bottom-0 left-0 w-2 h-2 border-l border-b border-yellow-400'></div>
						<div className='absolute bottom-0 right-0 w-2 h-2 border-r border-b border-yellow-400'></div>
						<span className='text-xl'>›</span>
					</button>

					{/* Carousel Track - Mobile Optimized */}
					<div className='overflow-hidden mx-4 sm:mx-8 md:mx-12 lg:mx-16'>
						<div
							className='flex transition-transform duration-700 ease-in-out gap-2 sm:gap-4 md:gap-6 lg:gap-8'
							style={{
								transform: `translateX(-${
									currentSlide * (100 / cardsPerView)
								}%)`,
							}}
						>
							{currentCocktails.map((cocktail) => (
								<div
									key={cocktail.id}
									className='flex-shrink-0'
									style={{ width: `${100 / cardsPerView}%` }}
								>
									<div className='px-1 sm:px-2'>
										<CocktailCard
											cocktail={cocktail}
											size={
												cardsPerView === 1
													? 'large'
													: 'medium'
											}
											onCardClick={(cocktail) =>
												console.log(
													'Clicked:',
													cocktail.name,
												)
											}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Slide Indicators */}
				<div className='flex justify-center gap-3 mt-12'>
					{Array.from({ length: maxSlides + 1 }, (_, index) => (
						<button
							key={index}
							onClick={() => {
								setCurrentSlide(index);
								setIsAutoPlaying(false);
							}}
							className={`w-3 h-3 border border-yellow-400 rotate-45 transition-all duration-300 ${
								currentSlide === index
									? 'bg-yellow-400'
									: 'bg-transparent hover:bg-yellow-400/50'
							}`}
						/>
					))}
				</div>

				{/* Auto-play Toggle */}
				<div className='text-center mt-8'>
					<button
						onClick={() => setIsAutoPlaying(!isAutoPlaying)}
						className='text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm uppercase tracking-wide'
					>
						{isAutoPlaying
							? '⏸️ Pause Auto-play'
							: '▶️ Resume Auto-play'}
					</button>
				</div>

				{/* Bottom decorative element */}
				<div className='text-center mt-16'>
					<div className='w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-4'></div>
					<div className='text-yellow-400 text-sm uppercase tracking-widest font-light'>
						Crafted with Excellence
					</div>
				</div>
			</div>
		</section>
	);
};

export default Content;
