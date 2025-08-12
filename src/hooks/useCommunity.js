import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

// Hook for fetching community members
export const useCommunityMembers = (filters = {}) => {
	return useQuery({
		queryKey: ['community', 'members', filters],
		queryFn: async () => {
			// Build query parameters based on filters
			const params = new URLSearchParams();

			if (filters.limit) {
				params.append('limit', filters.limit);
			}

			if (filters.filter) {
				switch (filters.filter) {
					case 'verified':
						params.append('verified', 'true');
						break;
					case 'top':
						params.append('sortBy', 'cocktails');
						break;
					case 'new':
						params.append('sortBy', 'createdAt');
						break;
					default:
						// 'all' - no specific filter
						break;
				}
			}

			// Call the users endpoint with proper response handling
			const response = await apiService.get(
				`/users?${params.toString()}`,
			);

			// Handle different response structures (applying the lesson learned from login)
			let responseData;
			if (response.data?.data) {
				// Backend returns: { success: true, data: [...], count: x, total: x }
				responseData = { users: response.data.data, ...response.data };
			} else if (response.data) {
				// Standard axios response structure
				responseData = response.data;
			} else if (response.users !== undefined) {
				// Response is the data itself
				responseData = response;
			} else {
				throw new Error('No valid response data found');
			}

			return responseData;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		onError: (error) => {
			toast.error(error.message || 'Failed to fetch community members');
		},
	});
};

// Hook for user stats
export const useUserStats = (userId) => {
	return useQuery({
		queryKey: ['user', 'stats', userId],
		queryFn: async () => {
			// Get user cocktails to calculate stats
			const response = await apiService.get(`/users/${userId}/cocktails`);

			// Handle response structure
			let responseData;
			if (response.data) {
				responseData = response.data;
			} else if (response.cocktails !== undefined) {
				responseData = response;
			} else {
				throw new Error('No valid response data found');
			}

			return responseData;
		},
		enabled: !!userId,
		staleTime: 2 * 60 * 1000, // 2 minutes
		onError: (error) => {
			toast.error(error.message || 'Failed to fetch user stats');
		},
	});
};

// Hook for following/unfollowing users
export const useFollowUser = () => {
	const queryClient = useQueryClient();

	const followMutation = useMutation({
		mutationFn: async ({ userId }) => {
			const response = await apiService.put(`/users/${userId}/follow`);

			// Handle response structure
			let responseData;
			if (response.data) {
				responseData = response.data;
			} else if (response.message !== undefined) {
				responseData = response;
			} else {
				throw new Error('No valid response data found');
			}

			return responseData;
		},
		onSuccess: (data, variables) => {
			const action = variables.action;
			queryClient.invalidateQueries({
				queryKey: ['community', 'members'],
			});
			queryClient.invalidateQueries({ queryKey: ['user', 'stats'] });
			toast.success(
				action === 'follow'
					? 'Successfully followed user!'
					: 'Successfully unfollowed user!',
			);
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to update follow status');
		},
	});

	return {
		followUser: (userId) =>
			followMutation.mutate({ userId, action: 'follow' }),
		unfollowUser: (userId) =>
			followMutation.mutate({ userId, action: 'unfollow' }),
		isLoading: followMutation.isPending,
	};
};

// Hook for user profile
export const useUserProfile = () => {
	return useQuery({
		queryKey: ['user', 'profile'],
		queryFn: async () => {
			const response = await apiService.get('/users/profile');

			// Handle response structure
			let responseData;
			if (response.data) {
				responseData = response.data;
			} else if (response.user !== undefined) {
				responseData = response;
			} else {
				throw new Error('No valid response data found');
			}

			return responseData;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		onError: (error) => {
			toast.error(error.message || 'Failed to fetch user profile');
		},
	});
};
