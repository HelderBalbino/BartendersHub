import PropTypes from 'prop-types';

const CarouselNavigation = ({
	onPrevious,
	onNext,
	currentSlide,
	totalSlides,
	onSlideSelect,
	showArrows = true,
	showIndicators = true,
	className = '',
}) => {
	return (
		<div className={className}>
			{/* Navigation Arrows */}
			{showArrows && totalSlides > 1 && (
				<>
					<button
						onClick={onPrevious}
						className='absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-black/80 border border-yellow-400/50 text-yellow-400 w-12 h-12 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300 z-10'
						aria-label='Previous item'
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
						onClick={onNext}
						className='absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-black/80 border border-yellow-400/50 text-yellow-400 w-12 h-12 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300 z-10'
						aria-label='Next item'
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
			{showIndicators && totalSlides > 1 && (
				<div className='flex justify-center mt-8 space-x-2'>
					{Array.from({ length: totalSlides }).map((_, index) => (
						<button
							key={index}
							onClick={() => onSlideSelect(index)}
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
	);
};

CarouselNavigation.propTypes = {
	onPrevious: PropTypes.func.isRequired,
	onNext: PropTypes.func.isRequired,
	currentSlide: PropTypes.number.isRequired,
	totalSlides: PropTypes.number.isRequired,
	onSlideSelect: PropTypes.func.isRequired,
	showArrows: PropTypes.bool,
	showIndicators: PropTypes.bool,
	className: PropTypes.string,
};

export default CarouselNavigation;
