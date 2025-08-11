import { useState, useCallback } from 'react';

/**
 * Hook for managing localStorage with error handling and type safety
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Default value if key doesn't exist
 * @returns {[*, function]} Array with [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
	// Get initial value from localStorage or use initialValue
	const [storedValue, setStoredValue] = useState(() => {
		if (typeof window === 'undefined') {
			return initialValue;
		}

		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	// Memoized setValue function to prevent unnecessary re-renders
	const setValue = useCallback(
		(value) => {
			try {
				// Allow value to be a function for lazy initial state
				const valueToStore =
					value instanceof Function ? value(storedValue) : value;

				// Update state
				setStoredValue(valueToStore);

				// Save to localStorage if running in browser
				if (typeof window !== 'undefined') {
					window.localStorage.setItem(
						key,
						JSON.stringify(valueToStore),
					);
				}
			} catch (error) {
				console.error(
					`Error setting localStorage key "${key}":`,
					error,
				);
			}
		},
		[key, storedValue],
	);

	// Function to remove item from localStorage
	const removeValue = useCallback(() => {
		try {
			setStoredValue(initialValue);
			if (typeof window !== 'undefined') {
				window.localStorage.removeItem(key);
			}
		} catch (error) {
			console.error(`Error removing localStorage key "${key}":`, error);
		}
	}, [key, initialValue]);

	return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
