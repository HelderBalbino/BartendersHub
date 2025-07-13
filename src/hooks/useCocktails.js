import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

// Hook for fetching cocktails
export const useCocktails = (filters = {}) => {
	return useQuery({
		queryKey: ['cocktails', filters],
		queryFn: () => apiService.getCocktails(filters),
		staleTime: 5 * 60 * 1000, // 5 minutes
		onError: (error) => {
			toast.error(error.message || 'Failed to fetch cocktails');
		},
	});
};

// Hook for creating cocktails
export const useCreateCocktail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: apiService.createCocktail,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['cocktails'] });
			toast.success('Cocktail created successfully!');
			return data;
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to create cocktail');
		},
	});
};

// Hook for managing favorite cocktails
export const useFavoriteCocktail = () => {
	const queryClient = useQueryClient();

	const toggleFavorite = useMutation({
		mutationFn: ({ cocktailId, isFavorite }) =>
			isFavorite
				? apiService.removeFavorite(cocktailId)
				: apiService.addFavorite(cocktailId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cocktails'] });
			queryClient.invalidateQueries({ queryKey: ['favorites'] });
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to update favorite');
		},
	});

	return { toggleFavorite };
};

// Hook for responsive design
export const useResponsive = () => {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return {
		...windowSize,
		isMobile: windowSize.width < 768,
		isTablet: windowSize.width >= 768 && windowSize.width < 1024,
		isDesktop: windowSize.width >= 1024,
	};
};

// Hook for debounced search
export const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

// Hook for local storage
export const useLocalStorage = (key, initialValue) => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	const setValue = (value) => {
		try {
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error(`Error setting localStorage key "${key}":`, error);
		}
	};

	return [storedValue, setValue];
};
