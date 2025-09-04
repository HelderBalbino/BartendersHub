import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

// Generic normalizer factory to reduce repetition across hooks.
// Accepts possible key candidates and returns the first present.
const pickFirst = (obj, keys) =>
	keys.find((k) => obj && Object.prototype.hasOwnProperty.call(obj, k));

export const normalizeUserListResponse = (data) => {
	if (!data) throw new Error('Empty response');
	if (Array.isArray(data))
		return { users: data, total: data.length, count: data.length };
	if (data.data && Array.isArray(data.data))
		return { users: data.data, ...data };
	if (data.users && Array.isArray(data.users))
		return { users: data.users, ...data };
	const arrKey = pickFirst(data, ['results', 'items']);
	if (arrKey && Array.isArray(data[arrKey]))
		return { users: data[arrKey], ...data };
	throw new Error('Unrecognized users response shape');
};

// Hook for fetching community members
export const useCommunityMembers = (filters = {}) => {
	return useQuery({
		queryKey: ['community', 'members', filters],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (filters.limit) params.append('limit', filters.limit);
			if (filters.filter === 'verified')
				params.append('verified', 'true');
			else if (filters.filter === 'top')
				params.append('sortBy', 'cocktails');
			else if (filters.filter === 'new')
				params.append('sortBy', 'createdAt');
			const raw = await apiService.get(`/users?${params.toString()}`);
			return normalizeUserListResponse(raw);
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
			const data = await apiService.put(`/users/${userId}/follow`);
			if (data?.message !== undefined) return data; // { success, message, isFollowing }
			throw new Error('Invalid follow response');
		},
		onMutate: async ({ userId }) => {
			// Cancel queries to avoid race conditions during optimistic update
			await Promise.all([
				queryClient.cancelQueries({
					queryKey: ['user', 'followers', userId],
				}),
				queryClient.cancelQueries({
					queryKey: ['user', 'profile', userId],
				}),
			]);
			// Snapshot previous followers list
			const prevFollowers = queryClient.getQueryData([
				'user',
				'followers',
				userId,
			]);
			const prevProfile = queryClient.getQueryData([
				'user',
				'profile',
				userId,
			]);
			// Determine if current user is already in followers list
			// Resolve current user id from storage (AuthContext ensures it is set)
			const currentUserId =
				localStorage.getItem('currentUserId') ||
				sessionStorage.getItem('currentUserId');
			if (currentUserId && prevFollowers?.followers) {
				const exists = prevFollowers.followers.some(
					(f) => (f._id || f.id) === currentUserId,
				);
				let newFollowers;
				if (exists) {
					newFollowers = {
						...prevFollowers,
						followers: prevFollowers.followers.filter(
							(f) => (f._id || f.id) !== currentUserId,
						),
						count:
							(prevFollowers.count ||
								prevFollowers.followers.length) - 1,
					};
				} else {
					newFollowers = {
						...prevFollowers,
						followers: [
							...(prevFollowers.followers || []),
							{
								id: currentUserId,
								_id: currentUserId,
								name: 'You',
							},
						],
						count:
							(prevFollowers.count ||
								prevFollowers.followers.length) + 1,
					};
				}
				queryClient.setQueryData(
					['user', 'followers', userId],
					newFollowers,
				);
			}
			if (prevProfile && currentUserId) {
				// Determine if current user appears in followers list when available
				let currentlyFollowing = false;
				if (prevFollowers?.followers) {
					currentlyFollowing = prevFollowers.followers.some(
						(f) => (f._id || f.id) === currentUserId,
					);
				}
				queryClient.setQueryData(['user', 'profile', userId], {
					...prevProfile,
					followersCount:
						(prevProfile.followersCount || 0) +
						(currentlyFollowing ? -1 : 1),
				});
			}
			return { prevFollowers, prevProfile };
		},
		onError: (error, _vars, context) => {
			// Rollback
			if (context?.prevFollowers) {
				queryClient.setQueryData(
					['user', 'followers', _vars.userId],
					context.prevFollowers,
				);
			}
			if (context?.prevProfile) {
				queryClient.setQueryData(
					['user', 'profile', _vars.userId],
					context.prevProfile,
				);
			}
			toast.error(error.message || 'Failed to update follow status');
		},
		onSuccess: () => {
			toast.success('Follow status updated');
		},
		onSettled: (_data, _err, variables) => {
			// Ensure fresh data
			queryClient.invalidateQueries({
				queryKey: ['user', 'followers', variables.userId],
			});
			queryClient.invalidateQueries({
				queryKey: ['user', 'profile', variables.userId],
			});
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
