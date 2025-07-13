import { useState, useCallback, useEffect } from 'react';

/**
 * Reusable touch/swipe functionality hook
 * @param {Object} options
 * @param {Function} options.onSwipeLeft - Callback for left swipe
 * @param {Function} options.onSwipeRight - Callback for right swipe
 * @param {number} options.minSwipeDistance - Minimum distance for swipe detection (default: 50)
 * @returns {Object} Touch event handlers
 */
export const useSwipeGestures = ({
	onSwipeLeft,
	onSwipeRight,
	minSwipeDistance = 50,
}) => {
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);

	const handleTouchStart = useCallback((e) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	}, []);

	const handleTouchMove = useCallback((e) => {
		setTouchEnd(e.targetTouches[0].clientX);
	}, []);

	const handleTouchEnd = useCallback(() => {
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe && onSwipeLeft) {
			onSwipeLeft();
		}
		if (isRightSwipe && onSwipeRight) {
			onSwipeRight();
		}
	}, [touchStart, touchEnd, minSwipeDistance, onSwipeLeft, onSwipeRight]);

	return {
		onTouchStart: handleTouchStart,
		onTouchMove: handleTouchMove,
		onTouchEnd: handleTouchEnd,
	};
};

/**
 * Carousel functionality hook
 * @param {Object} options
 * @param {number} options.totalItems - Total number of items
 * @param {number} options.itemsPerView - Items visible per view
 * @param {boolean} options.autoPlay - Whether to auto-play (default: true)
 * @param {number} options.autoPlayInterval - Auto-play interval in ms (default: 4000)
 * @returns {Object} Carousel state and controls
 */
export const useCarousel = ({
	totalItems,
	itemsPerView,
	autoPlay = true,
	autoPlayInterval = 4000,
}) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

	const maxSlide = Math.max(0, totalItems - itemsPerView);

	const nextSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
	}, [maxSlide]);

	const prevSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
	}, [maxSlide]);

	const goToSlide = useCallback(
		(slideIndex) => {
			setCurrentSlide(Math.max(0, Math.min(slideIndex, maxSlide)));
		},
		[maxSlide],
	);

	// Auto-play effect
	useEffect(() => {
		if (!isAutoPlaying || totalItems === 0) return;

		const interval = setInterval(nextSlide, autoPlayInterval);
		return () => clearInterval(interval);
	}, [isAutoPlaying, totalItems, nextSlide, autoPlayInterval]);

	const swipeHandlers = useSwipeGestures({
		onSwipeLeft: nextSlide,
		onSwipeRight: prevSlide,
	});

	return {
		currentSlide,
		setCurrentSlide,
		nextSlide,
		prevSlide,
		goToSlide,
		maxSlide,
		isAutoPlaying,
		setIsAutoPlaying,
		swipeHandlers,
	};
};
