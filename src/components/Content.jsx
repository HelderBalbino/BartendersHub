import { useState, useEffect, useMemo } from 'react';
import { useCocktails } from '../hooks/useCocktails';
import { useResponsive } from '../hooks/useCocktails';
import CocktailCard from './CocktailCard';
import LoadingSpinner from './LoadingSpinner';

const Content = () => {
	const [activeCategory, setActiveCategory] = useState('all');
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);

	const { isMobile, isTablet } = useResponsive();
	const cardsPerView = useMemo(() => {
		if (isMobile) return 1;
		if (isTablet) return 2;
		return 3;
	}, [isMobile, isTablet]);

	// Fetch cocktails from API
	const {
		data: cocktailsData,
		isLoading,
		error,
	} = useCocktails({
		difficulty: activeCategory !== 'all' ? activeCategory : undefined,
		limit: 12,
	});

	const cocktails = cocktailsData?.cocktails || [];

	// Categories for filtering
	const categories = [
		{ id: 'all', name: 'All Cocktails', emoji: '🍸' },
		{ id: 'beginner', name: 'Beginner', emoji: '🟢' },
		{ id: 'intermediate', name: 'Intermediate', emoji: '🟡' },
		{ id: 'advanced', name: 'Advanced', emoji: '🟠' },
		{ id: 'expert', name: 'Expert', emoji: '🔴' },
	];

	// Auto-play functionality
	useEffect(() => {
		if (!isAutoPlaying || cocktails.length === 0) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => {
				const maxSlide = Math.max(0, cocktails.length - cardsPerView);
				return prev >= maxSlide ? 0 : prev + 1;
			});
		}, 4000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, cocktails.length, cardsPerView]);

	// Touch handlers
	const handleTouchStart = (e) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = () => {
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > 50;
		const isRightSwipe = distance < -50;

		if (isLeftSwipe) nextSlide();
		if (isRightSwipe) prevSlide();
	};

	const nextSlide = () => {
		const maxSlide = Math.max(0, cocktails.length - cardsPerView);
		setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
	};

	const prevSlide = () => {
		const maxSlide = Math.max(0, cocktails.length - cardsPerView);
		setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
	};

	const handleCategoryChange = (category) => {
		setActiveCategory(category);
		setCurrentSlide(0);
	};

	const handleCardClick = (cocktail) => {
		// Navigate to cocktail detail page or show modal
		console.log('Cocktail clicked:', cocktail);
		// TODO: Implement navigation to detail page
	};

	if (error) {
		return (
			<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-20'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<div className='text-6xl text-red-400 mb-6'>⚠️</div>
					<h2 className='text-2xl text-white font-light tracking-wide uppercase mb-4'>
						Failed to Load Cocktails
					</h2>
					<p className='text-gray-400 mb-8'>
						{error?.message ||
							'Something went wrong while fetching cocktails.'}
					</p>
					<button
						onClick={() => window.location.reload()}
						className='bg-yellow-400 text-black px-6 py-3 border border-yellow-400 hover:bg-black hover:text-yellow-400 transition-all duration-300 tracking-wide uppercase text-sm'
					>
						Try Again
					</button>
				</div>
			</section>
		);
	}

	return (
		<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-20'>
			{/* Background Elements */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute top-20 left-10 w-40 h-40 border border-yellow-400/30 rotate-45'></div>
				<div className='absolute bottom-20 right-10 w-32 h-32 border border-yellow-400/30 rotate-45'></div>
				<div className='absolute top-1/2 left-1/4 w-24 h-24 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/3 right-1/4 w-28 h-28 border border-yellow-400/20 rotate-45'></div>
			</div>

			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Header */}
				<div className='text-center mb-16'>
					<div className='flex items-center justify-center mb-6'>
						<div className='text-6xl md:text-7xl lg:text-8xl text-yellow-400 mb-4 filter drop-shadow-lg'>
							🍸
						</div>
					</div>
					<h1 className='text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 tracking-[0.2em] uppercase'>
						Premium Cocktail Collection
					</h1>
					<div className='w-24 h-0.5 bg-yellow-400 mx-auto mb-6'></div>
					<p className='text-gray-400 text-lg md:text-xl font-light italic max-w-2xl mx-auto'>
						Discover masterfully crafted cocktails from bartenders
						around the world
					</p>
				</div>

				{/* Category Filter */}
				<div className='flex flex-wrap justify-center gap-4 mb-12'>
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => handleCategoryChange(category.id)}
							className={`px-6 py-3 text-sm font-light tracking-wide uppercase transition-all duration-300 border ${
								activeCategory === category.id
									? 'bg-yellow-400 text-black border-yellow-400'
									: 'bg-transparent text-yellow-400 border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10'
							}`}
						>
							<span className='mr-2'>{category.emoji}</span>
							{category.name}
						</button>
					))}
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className='flex justify-center py-20'>
						<LoadingSpinner
							size='large'
							text='Loading cocktails...'
						/>
					</div>
				)}

				{/* Cocktails Grid/Carousel */}
				{!isLoading && cocktails.length > 0 && (
					<div className='relative'>
						{/* Carousel Container */}
						<div
							className='relative overflow-hidden'
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
							onMouseEnter={() => setIsAutoPlaying(false)}
							onMouseLeave={() => setIsAutoPlaying(true)}
						>
							<div
								className='flex transition-transform duration-500 ease-in-out'
								style={{
									transform: `translateX(-${
										currentSlide * (100 / cardsPerView)
									}%)`,
								}}
							>
								{cocktails.map((cocktail) => (
									<div
										key={cocktail._id || cocktail.id}
										className={`flex-shrink-0 px-4 ${
											cardsPerView === 1
												? 'w-full'
												: cardsPerView === 2
												? 'w-1/2'
												: 'w-1/3'
										}`}
									>
										<CocktailCard
											cocktail={{
												id: cocktail._id || cocktail.id,
												name: cocktail.name,
												image:
													cocktail.image ||
													cocktail.imageUrl,
												imageAlt: `${cocktail.name} cocktail`,
												difficulty: cocktail.difficulty,
												prepTime: cocktail.prepTime,
												description:
													cocktail.description,
												rating: cocktail.rating || 4.5,
											}}
											onCardClick={handleCardClick}
											size='medium'
										/>
									</div>
								))}
							</div>
						</div>

						{/* Navigation Arrows */}
						{cocktails.length > cardsPerView && (
							<>
								<button
									onClick={prevSlide}
									className='absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-black/80 border border-yellow-400/50 text-yellow-400 w-12 h-12 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300 z-10'
									aria-label='Previous cocktail'
								>
									<svg
										className='w-6 h-6'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 19l-7-7 7-7'
										/>
									</svg>
								</button>
								<button
									onClick={nextSlide}
									className='absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-black/80 border border-yellow-400/50 text-yellow-400 w-12 h-12 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300 z-10'
									aria-label='Next cocktail'
								>
									<svg
										className='w-6 h-6'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 5l7 7-7 7'
										/>
									</svg>
								</button>
							</>
						)}

						{/* Slide Indicators */}
						{cocktails.length > cardsPerView && (
							<div className='flex justify-center mt-8 space-x-2'>
								{Array.from({
									length: Math.max(
										0,
										cocktails.length - cardsPerView + 1,
									),
								}).map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentSlide(index)}
										className={`w-3 h-3 border border-yellow-400 rotate-45 transition-all duration-300 ${
											currentSlide === index
												? 'bg-yellow-400'
												: 'bg-transparent hover:bg-yellow-400/50'
										}`}
										aria-label={`Go to slide ${index + 1}`}
									/>
								))}
							</div>
						)}
					</div>
				)}

				{/* Empty State */}
				{!isLoading && cocktails.length === 0 && (
					<div className='text-center py-20'>
						<div className='text-6xl text-gray-600 mb-6'>🍸</div>
						<h3 className='text-2xl text-white font-light tracking-wide uppercase mb-4'>
							No Cocktails Found
						</h3>
						<p className='text-gray-400 mb-8'>
							{activeCategory === 'all'
								? 'No cocktails available at the moment.'
								: `No ${activeCategory} cocktails found. Try a different category.`}
						</p>
						{activeCategory !== 'all' && (
							<button
								onClick={() => handleCategoryChange('all')}
								className='bg-yellow-400 text-black px-6 py-3 border border-yellow-400 hover:bg-black hover:text-yellow-400 transition-all duration-300 tracking-wide uppercase text-sm'
							>
								Show All Cocktails
							</button>
						)}
					</div>
				)}

				{/* Call to Action */}
				<div className='text-center mt-16'>
					<div className='flex items-center justify-center mb-8'>
						<div className='w-16 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
						<div className='w-3 h-3 border border-yellow-400 rotate-45 bg-yellow-400/20 mx-4'></div>
						<div className='w-16 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
					</div>
					<h3 className='text-xl md:text-2xl font-light text-white mb-4 tracking-wide uppercase'>
						Ready to Share Your Creation?
					</h3>
					<p className='text-gray-400 mb-8 max-w-md mx-auto'>
						Join our community of master mixologists and share your
						signature cocktails
					</p>
				</div>
			</div>
		</section>
	);
};

export default Content;
