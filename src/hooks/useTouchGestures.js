import { useState, useCallback } from 'react';

export const useTouchGestures = (options = {}) => {
	const {
		threshold = 50,
		onSwipeLeft,
		onSwipeRight,
		onSwipeUp,
		onSwipeDown,
	} = options;

	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);

	const handleTouchStart = useCallback((e) => {
		setTouchEnd(null);
		setTouchStart({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY,
		});
	}, []);

	const handleTouchMove = useCallback((e) => {
		setTouchEnd({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY,
		});
	}, []);

	const handleTouchEnd = useCallback(() => {
		if (!touchStart || !touchEnd) return;

		const deltaX = touchStart.x - touchEnd.x;
		const deltaY = touchStart.y - touchEnd.y;
		const absDeltaX = Math.abs(deltaX);
		const absDeltaY = Math.abs(deltaY);

		// Determine if this is a horizontal or vertical swipe
		if (absDeltaX > absDeltaY) {
			// Horizontal swipe
			if (absDeltaX > threshold) {
				if (deltaX > 0 && onSwipeLeft) {
					onSwipeLeft();
				} else if (deltaX < 0 && onSwipeRight) {
					onSwipeRight();
				}
			}
		} else {
			// Vertical swipe
			if (absDeltaY > threshold) {
				if (deltaY > 0 && onSwipeUp) {
					onSwipeUp();
				} else if (deltaY < 0 && onSwipeDown) {
					onSwipeDown();
				}
			}
		}
	}, [
		touchStart,
		touchEnd,
		threshold,
		onSwipeLeft,
		onSwipeRight,
		onSwipeUp,
		onSwipeDown,
	]);

	return {
		touchHandlers: {
			onTouchStart: handleTouchStart,
			onTouchMove: handleTouchMove,
			onTouchEnd: handleTouchEnd,
		},
		touchStart,
		touchEnd,
	};
};

export default useTouchGestures;
