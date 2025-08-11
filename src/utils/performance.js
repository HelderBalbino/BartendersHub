/**
 * Performance optimization utilities for React components
 */

import React, { memo, useState, useEffect, useRef } from 'react';

/**
 * Higher-order component for shallow comparison memoization
 * @param {React.Component} Component - Component to memoize
 * @param {function} areEqual - Optional comparison function
 */
export const withMemo = (Component, areEqual) => memo(Component, areEqual);

/**
 * Utility for lazy loading components with better error handling
 * @param {function} importFunc - Dynamic import function
 * @param {string} componentName - Name for debugging
 */
export const lazyLoad = (importFunc, componentName = 'Component') => {
	return React.lazy(() =>
		importFunc().catch((error) => {
			console.error(`Failed to load ${componentName}:`, error);
			// Return a fallback component
			return {
				default: () => (
					<div className='p-4 text-center text-red-400'>
						Failed to load {componentName}
					</div>
				),
			};
		}),
	);
};

/**
 * Debounced function utility with cleanup
 * @param {function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 */
export const createDebouncedFunction = (func, delay = 300) => {
	let timeoutId;

	const debouncedFn = (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};

	// Add cleanup method
	debouncedFn.cancel = () => {
		clearTimeout(timeoutId);
	};

	return debouncedFn;
};

/**
 * Throttled function utility
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 */
export const createThrottledFunction = (func, limit = 100) => {
	let inThrottle;

	return (...args) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
};

/**
 * Image lazy loading with intersection observer
 * @param {string} src - Image source
 * @param {object} options - Intersection observer options
 */
export const useLazyImage = (src, options = { threshold: 0.1 }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [isInView, setIsInView] = useState(false);
	const imgRef = useRef();

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsInView(true);
				observer.disconnect();
			}
		}, options);

		if (imgRef.current) {
			observer.observe(imgRef.current);
		}

		return () => observer.disconnect();
	}, [options]);

	useEffect(() => {
		if (isInView && src) {
			const img = new Image();
			img.onload = () => setIsLoaded(true);
			img.src = src;
		}
	}, [isInView, src]);

	return { imgRef, isLoaded, isInView };
};

export default {
	withMemo,
	lazyLoad,
	createDebouncedFunction,
	createThrottledFunction,
	useLazyImage,
};
