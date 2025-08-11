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
		mutationFn: (cocktailData) => apiService.createCocktail(cocktailData),
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

export default {
	useCocktails,
	useCreateCocktail,
	useFavoriteCocktail,
};
