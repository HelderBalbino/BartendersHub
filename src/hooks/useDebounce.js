import { useState, useEffect } from 'react';

/**
 * Hook for debouncing values to prevent excessive API calls or computations
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} The debounced value
 */
export const useDebounce = (value, delay = 300) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		// Set up a timeout to update the debounced value after the delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up the timeout if value changes before delay is complete
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

export default useDebounce;
