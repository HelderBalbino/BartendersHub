import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import CocktailCard from '../../CocktailCard';
import CarouselNavigation from '../../ui/Navigation/CarouselNavigation';
import { useTouchGestures } from '../../../hooks/useTouchGestures';
import { useResponsive } from '../../../hooks/useResponsive';

const CarouselContainer = ({
	cocktails,
	onCardClick,
	autoPlay = true,
	autoPlayInterval = 4000,
}) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

	const { isMobile, isTablet } = useResponsive();
	const cardsPerView = useMemo(() => {
		if (isMobile) return 1;
		if (isTablet) return 2;
		return 3;
	}, [isMobile, isTablet]);

	const maxSlide = Math.max(0, cocktails.length - cardsPerView);

	// Auto-play functionality
	useEffect(() => {
		if (!isAutoPlaying || cocktails.length === 0) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => {
				return prev >= maxSlide ? 0 : prev + 1;
			});
		}, autoPlayInterval);

		return () => clearInterval(interval);
	}, [isAutoPlaying, cocktails.length, maxSlide, autoPlayInterval]);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
	};

	const selectSlide = (index) => {
		setCurrentSlide(index);
	};

	// Touch gestures
	const { touchHandlers } = useTouchGestures({
		onSwipeLeft: nextSlide,
		onSwipeRight: prevSlide,
	});

	// Reset slide when cocktails change
	useEffect(() => {
		setCurrentSlide(0);
	}, [cocktails]);

	if (cocktails.length === 0) return null;

	return (
		<div className='relative'>
			{/* Carousel Container */}
			<div
				className='relative overflow-hidden'
				{...touchHandlers}
				onMouseEnter={() => setIsAutoPlaying(false)}
				onMouseLeave={() => setIsAutoPlaying(autoPlay)}
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
								cocktailData={{
									id: cocktail._id || cocktail.id,
									name: cocktail.name,
									image: cocktail.image || cocktail.imageUrl,
									imageAlt: `${cocktail.name} cocktail`,
									category: cocktail.category,
									prepTime: cocktail.prepTime,
									description: cocktail.description,
									rating: cocktail.rating || 4.5,
								}}
								onCardClick={onCardClick}
								size='medium'
							/>
						</div>
					))}
				</div>
			</div>

			<CarouselNavigation
				onPrevious={prevSlide}
				onNext={nextSlide}
				currentSlide={currentSlide}
				totalSlides={maxSlide + 1}
				onSlideSelect={selectSlide}
				showArrows={cocktails.length > cardsPerView}
				showIndicators={cocktails.length > cardsPerView}
			/>
		</div>
	);
};

CarouselContainer.propTypes = {
	cocktails: PropTypes.array.isRequired,
	onCardClick: PropTypes.func.isRequired,
	autoPlay: PropTypes.bool,
	autoPlayInterval: PropTypes.number,
};

export default CarouselContainer;
