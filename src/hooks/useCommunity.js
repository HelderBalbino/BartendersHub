import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

// Hook for fetching community members
export const useCommunityMembers = (filters = {}) => {
	return useQuery({
		queryKey: ['community', 'members', filters],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (filters.limit) params.append('limit', filters.limit);
			if (filters.filter) {
				if (filters.filter === 'verified')
					params.append('verified', 'true');
				else if (filters.filter === 'top')
					params.append('sortBy', 'cocktails');
				else if (filters.filter === 'new')
					params.append('sortBy', 'createdAt');
			}
			const data = await apiService.get(`/users?${params.toString()}`);
			// Expected backend shape: { success, data: [...], total, page, ... }
			if (data?.data) return { users: data.data, ...data };
			if (Array.isArray(data?.users)) return data;
			if (Array.isArray(data)) return { users: data, success: true };
			throw new Error('Invalid community members response');
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
			const data = await apiService.get(`/users/${userId}/cocktails`);
			if (data?.cocktails) return data;
			if (Array.isArray(data))
				return { cocktails: data, count: data.length };
			throw new Error('Invalid user stats response');
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
			// toggle follow on backend
			const data = await apiService.put(`/users/${userId}/follow`);
			if (data?.message) return data;
			throw new Error('Invalid follow response');
		},
		onSuccess: (_data, variables) => {
			// Invalidate related caches (followers/following lists and profiles)
			queryClient.invalidateQueries({
				queryKey: ['community', 'members'],
			});
			queryClient.invalidateQueries({
				queryKey: ['user', 'followers', variables.userId],
			});
			queryClient.invalidateQueries({ queryKey: ['user', 'following'] });
			queryClient.invalidateQueries({
				queryKey: ['user', 'profile', variables.userId],
			});
			queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
			toast.success('Follow status updated');
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to update follow status');
		},
	});

	return {
		// Single toggle (backend determines final state)
		followUser: (userId) => followMutation.mutate({ userId }),
		unfollowUser: (userId) => followMutation.mutate({ userId }),
		isLoading: followMutation.isPending,
	};
};

// Hook for user profile
export const useUserProfile = () => {
	return useQuery({
		queryKey: ['user', 'profile'],
		queryFn: async () => {
			const data = await apiService.get('/users/profile');
			if (data?.user) return data.user;
			if (data?.data) return data.data;
			if (data?.id || data?._id) return data; // user object directly
			throw new Error('Invalid profile response');
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		onError: (error) => {
			toast.error(error.message || 'Failed to fetch user profile');
		},
	});
};
