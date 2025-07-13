import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

// Hook for fetching community members
export const useCommunityMembers = (filters = {}) => {
	return useQuery({
		queryKey: ['community', 'members', filters],
		queryFn: () => apiService.getCommunityMembers(filters),
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
		queryFn: () => apiService.getUserStats(userId),
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
		mutationFn: ({ userId, action }) => {
			return action === 'follow'
				? apiService.followUser(userId)
				: apiService.unfollowUser(userId);
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
		queryFn: () => apiService.getProfile(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		onError: (error) => {
			toast.error(error.message || 'Failed to fetch user profile');
		},
	});
};
