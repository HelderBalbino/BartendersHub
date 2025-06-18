import { useState, useEffect, useMemo } from 'react';
import CocktailCard from './CocktailCard';

const Content = () => {
	const [activeCategory, setActiveCategory] = useState('signature');
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	// Sample cocktail data organized by categories
	const cocktailData = useMemo(
		() => ({
			signature: [
				{
					id: 1,
					name: 'Golden Manhattan',
					image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
					difficulty: 'Expert',
					prepTime: '4 min',
					description:
						'A luxurious twist on the classic Manhattan with gold leaf',
					rating: 4.9,
					price: '$18',
				},
				{
					id: 2,
					name: 'Smoky Gatsby',
					image: 'src/assets/images/cocktailsImages/smoky.jpg',
					difficulty: 'Advanced',
					prepTime: '5 min',
					description:
						'Mezcal-based cocktail with a mysterious smoky finish',
					rating: 4.7,
					price: '$16',
				},
				{
					id: 3,
					name: 'Diamond Fizz',
					image: 'src/assets/images/cocktailsImages/fizz.jpg',
					difficulty: 'Intermediate',
					prepTime: '3 min',
					description:
						'Sparkling cocktail that shimmers like precious gems',
					rating: 4.8,
					price: '$14',
				},
				{
					id: 4,
					name: 'Noir Martini',
					image: 'src/assets/images/cocktailsImages/noir.jpg',
					difficulty: 'Expert',
					prepTime: '4 min',
					description: 'Dark and mysterious with activated charcoal',
					rating: 4.6,
					price: '$17',
				},
			],
			classics: [
				{
					id: 5,
					name: 'Classic Martini',
					image: 'src/assets/images/cocktailsImages/martini.jpg',
					difficulty: 'Intermediate',
					prepTime: '3 min',
					description:
						'The quintessential gin cocktail, crisp and clean',
					rating: 4.8,
					price: '$14',
				},
				{
					id: 6,
					name: 'Old Fashioned',
					image: 'src/assets/images/cocktailsImages/oldfashioned.jpg',
					difficulty: 'Beginner',
					prepTime: '3 min',
					description:
						'Timeless whiskey cocktail with sugar and bitters',
					rating: 4.7,
					price: '$13',
				},
				{
					id: 7,
					name: 'Negroni',
					image: 'src/assets/images/cocktailsImages/negroni.jpg',
					difficulty: 'Beginner',
					prepTime: '2 min',
					description:
						'Perfect balance of gin, vermouth, and Campari',
					rating: 4.5,
					price: '$12',
				},
			],
			seasonal: [
				{
					id: 8,
					name: 'Summer Solstice',
					image: 'src/assets/images/cocktailsImages/summer.jpg',
					difficulty: 'Intermediate',
					prepTime: '4 min',
					description:
						'Refreshing blend of gin, elderflower, and cucumber',
					rating: 4.6,
					price: '$15',
				},
				{
					id: 9,
					name: 'Winter Warmer',
					image: 'src/assets/images/cocktailsImages/winter.jpg',
					difficulty: 'Advanced',
					prepTime: '6 min',
					description:
						'Spiced rum cocktail with cinnamon and star anise',
					rating: 4.4,
					price: '$16',
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
	const cardsPerView = 3;
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
		<section className='bg-gradient-to-br from-black via-gray-900 to-black py-16 lg:py-24 relative overflow-hidden'>
			{/* Art Deco Background Pattern */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/10 to-transparent'></div>
				<div className='absolute top-20 left-20 w-32 h-32 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-20 right-20 w-24 h-24 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/2 left-10 w-16 h-16 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/3 right-10 w-20 h-20 border border-yellow-400/20 rotate-45'></div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
				{/* Section Header */}
				<div className='text-center mb-16'>
					{/* Golden decorative line */}
					<div className='w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6'></div>

					<h2 className='text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4 tracking-widest uppercase'>
						Cocktail{' '}
						<span className='text-yellow-400'>Collection</span>
					</h2>

					<p className='text-gray-400 text-lg max-w-2xl mx-auto font-light italic'>
						"Discover the finest cocktails crafted with precision
						and passion"
					</p>

					{/* Bottom decorative line */}
					<div className='w-16 h-0.5 bg-yellow-400 mx-auto mt-6'></div>
				</div>

				{/* Category Navigation */}
				<div className='flex flex-wrap justify-center gap-4 mb-12'>
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => handleCategoryChange(category.id)}
							className={`group relative px-8 py-4 border transition-all duration-500 ${
								activeCategory === category.id
									? 'border-yellow-400 bg-yellow-400 text-black'
									: 'border-yellow-400/30 text-gray-400 hover:border-yellow-400/60 hover:text-white'
							}`}
						>
							{/* Art Deco corners */}
							<div className='absolute top-0 left-0 w-3 h-3 border-l border-t border-yellow-400'></div>
							<div className='absolute top-0 right-0 w-3 h-3 border-r border-t border-yellow-400'></div>
							<div className='absolute bottom-0 left-0 w-3 h-3 border-l border-b border-yellow-400'></div>
							<div className='absolute bottom-0 right-0 w-3 h-3 border-r border-b border-yellow-400'></div>

							<div className='flex items-center gap-3'>
								<span className='text-2xl'>
									{category.icon}
								</span>
								<div className='text-left'>
									<div className='font-light tracking-wide uppercase text-sm'>
										{category.label}
									</div>
									<div className='text-xs opacity-70 mt-1'>
										{category.description}
									</div>
								</div>
							</div>
						</button>
					))}
				</div>

				{/* Carousel Container */}
				<div className='relative'>
					{/* Navigation Buttons */}
					<button
						onClick={handlePrevSlide}
						className='absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-black/70 border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 group'
						disabled={currentSlide === 0 && maxSlides === 0}
					>
						<div className='absolute top-0 left-0 w-2 h-2 border-l border-t border-yellow-400'></div>
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

					{/* Carousel Track */}
					<div className='overflow-hidden mx-16'>
						<div
							className='flex transition-transform duration-700 ease-in-out gap-8'
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
									<div className='px-2'>
										<CocktailCard
											cocktail={cocktail}
											size='medium'
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
