import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

// Hook for fetching user profile by ID
export const useUserProfileById = (userId, options = {}) => {
	return useQuery({
		queryKey: ['user', 'profile', userId],
		queryFn: async () => {
			const response = await apiService.get(`/users/${userId}`);

			// Handle response structure
			let responseData;
			if (response.data?.user) {
				responseData = response.data.user;
			} else if (response.data) {
				responseData = response.data;
			} else {
				throw new Error('No valid response data found');
			}

			return responseData;
		},
		enabled: options.enabled !== undefined ? options.enabled : !!userId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: (failureCount, error) => {
			// Don't retry on 404 errors
			if (error?.response?.status === 404) {
				return false;
			}
			return failureCount < 2;
		},
	});
};

// Hook for fetching user's submitted cocktails
export const useUserCocktails = (userId, options = {}) => {
	return useQuery({
		queryKey: ['user', 'cocktails', userId, options],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (options.limit) params.append('limit', options.limit);
			if (options.page) params.append('page', options.page);

			const response = await apiService.get(
				`/users/${userId}/cocktails?${params.toString()}`,
			);

			// Handle response structure
			let responseData;
			if (response.data?.cocktails) {
				responseData = response.data;
			} else if (response.data) {
				responseData = response.data;
			} else {
				throw new Error('No valid response data found');
			}

			return responseData;
		},
		enabled: options.enabled !== undefined ? options.enabled : !!userId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: (failureCount, error) => {
			if (error?.response?.status === 404) {
				return false;
			}
			return failureCount < 2;
		},
	});
};

// Hook for fetching user's favorite cocktails
export const useUserFavorites = (userId, options = {}) => {
	return useQuery({
		queryKey: ['user', 'favorites', userId, options],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (options.limit) params.append('limit', options.limit);
			if (options.page) params.append('page', options.page);

			// Note: This assumes there's a favorites endpoint, if not we'll need to adjust
			const response = await apiService.get(
				`/users/${userId}/favorites?${params.toString()}`,
			);

			// Handle response structure
			let responseData;
			if (response.data?.favorites) {
				responseData = response.data;
			} else if (response.data) {
				responseData = response.data;
			} else {
				throw new Error('No valid response data found');
			}

			return responseData;
		},
		enabled: options.enabled !== undefined ? options.enabled : !!userId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: (failureCount, error) => {
			// Don't retry for favorites if endpoint doesn't exist
			if (error?.response?.status === 404) {
				return false;
			}
			return failureCount < 1;
		},
	});
};

// Hook for fetching user's followers
export const useUserFollowers = (userId, options = {}) => {
	return useQuery({
		queryKey: ['user', 'followers', userId, options],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (options.limit) params.append('limit', options.limit);
			if (options.page) params.append('page', options.page);

			const response = await apiService.get(
				`/users/${userId}/followers?${params.toString()}`,
			);

			// Handle response structure
			let responseData;
			if (response.data?.followers) {
				responseData = response.data;
			} else if (response.data) {
				responseData = response.data;
			} else {
				throw new Error('No valid response data found');
			}

			return responseData;
		},
		enabled: options.enabled !== undefined ? options.enabled : !!userId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: (failureCount, error) => {
			if (error?.response?.status === 404) {
				return false;
			}
			return failureCount < 2;
		},
	});
};

// Hook for fetching user's following
export const useUserFollowing = (userId, options = {}) => {
	return useQuery({
		queryKey: ['user', 'following', userId, options],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (options.limit) params.append('limit', options.limit);
			if (options.page) params.append('page', options.page);

			const response = await apiService.get(
				`/users/${userId}/following?${params.toString()}`,
			);

			// Handle response structure
			let responseData;
			if (response.data?.following) {
				responseData = response.data;
			} else if (response.data) {
				responseData = response.data;
			} else {
				throw new Error('No valid response data found');
			}

			return responseData;
		},
		enabled: options.enabled !== undefined ? options.enabled : !!userId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: (failureCount, error) => {
			if (error?.response?.status === 404) {
				return false;
			}
			return failureCount < 2;
		},
	});
};

// Hook for updating user profile (for current user only)
export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (profileData) => {
			const response = await apiService.put(
				'/users/profile',
				profileData,
			);

			// Handle response structure
			let responseData;
			if (response.data?.user) {
				responseData = response.data;
			} else if (response.data) {
				responseData = response.data;
			} else {
				throw new Error('No valid response data found');
			}

			return responseData;
		},
		onSuccess: () => {
			// Invalidate and refetch profile queries
			queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
			toast.success('Profile updated successfully!');
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to update profile');
		},
	});
};
