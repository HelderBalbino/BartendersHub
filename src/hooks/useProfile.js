import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

// Hook for fetching user profile by ID
export const useUserProfileById = (userId, options = {}) => {
	return useQuery({
		queryKey: ['user', 'profile', userId],
		queryFn: async () => {
			// apiService already returns the JSON payload (not an axios response object)
			const data = await apiService.get(`/users/${userId}`);
			if (data?.user) return data.user; // expected shape { success, user }
			if (data?.data) return data.data; // fallback
			if (!data) throw new Error('No valid user data received');
			return data; // last resort (maybe the user object directly)
		},
		enabled: options.enabled !== undefined ? options.enabled : !!userId,
		staleTime: 5 * 60 * 1000,
		retry: (failureCount, error) => {
			if (error?.response?.status === 404 || error?.status === 404)
				return false;
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

			const data = await apiService.get(
				`/users/${userId}/cocktails?${params.toString()}`,
			);

			if (data && 'cocktails' in data) {
				return {
					cocktails: data.cocktails,
					count:
						data.total ?? data.count ?? data.cocktails?.length ?? 0,
					total:
						data.total ?? data.count ?? data.cocktails?.length ?? 0,
					page: data.page ?? 1,
					pages: data.pages ?? 1,
				};
			}
			if (data) return data;
			throw new Error('No valid cocktails data received');
		},
		enabled: options.enabled !== undefined ? options.enabled : !!userId,
		staleTime: 5 * 60 * 1000,
		retry: (failureCount, error) => {
			if (error?.response?.status === 404 || error?.status === 404)
				return false;
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

			const data = await apiService.get(
				`/users/${userId}/favorites?${params.toString()}`,
			);

			if (data && 'favorites' in data) {
				return {
					favorites: data.favorites,
					count:
						data.total ?? data.count ?? data.favorites?.length ?? 0,
					total:
						data.total ?? data.count ?? data.favorites?.length ?? 0,
					page: data.page ?? 1,
					pages: data.pages ?? 1,
				};
			}
			if (data) return data;
			throw new Error('No valid favorites data received');
		},
		enabled: options.enabled !== undefined ? options.enabled : !!userId,
		staleTime: 5 * 60 * 1000,
		retry: (failureCount, error) => {
			if (error?.response?.status === 404 || error?.status === 404)
				return false;
			return failureCount < 1; // fewer retries for favorites
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

			const data = await apiService.get(
				`/users/${userId}/followers?${params.toString()}`,
			);

			if (data && 'followers' in data) {
				return {
					followers: data.followers,
					count:
						data.total ?? data.count ?? data.followers?.length ?? 0,
					total:
						data.total ?? data.count ?? data.followers?.length ?? 0,
					page: data.page ?? 1,
					pages: data.pages ?? 1,
				};
			}
			if (data) return data;
			throw new Error('No valid followers data received');
		},
		enabled: options.enabled !== undefined ? options.enabled : !!userId,
		staleTime: 5 * 60 * 1000,
		retry: (failureCount, error) => {
			if (error?.response?.status === 404 || error?.status === 404)
				return false;
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

			const data = await apiService.get(
				`/users/${userId}/following?${params.toString()}`,
			);

			if (data && 'following' in data) {
				return {
					following: data.following,
					count:
						data.total ?? data.count ?? data.following?.length ?? 0,
					total:
						data.total ?? data.count ?? data.following?.length ?? 0,
					page: data.page ?? 1,
					pages: data.pages ?? 1,
				};
			}
			if (data) return data;
			throw new Error('No valid following data received');
		},
		enabled: options.enabled !== undefined ? options.enabled : !!userId,
		staleTime: 5 * 60 * 1000,
		retry: (failureCount, error) => {
			if (error?.response?.status === 404 || error?.status === 404)
				return false;
			return failureCount < 2;
		},
	});
};

// Hook for updating user profile (for current user only)
export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (profileData) => {
			// If an avatar File object is present, use multipart/form-data
			if (profileData && profileData.avatar instanceof File) {
				const formData = new FormData();
				// Append primitive fields
				['name', 'bio', 'speciality', 'location'].forEach((f) => {
					if (profileData[f] !== undefined && profileData[f] !== null)
						formData.append(f, profileData[f]);
				});
				// Nested objects must be JSON.stringified
				if (profileData.socialLinks)
					formData.append(
						'socialLinks',
						JSON.stringify(profileData.socialLinks),
					);
				if (profileData.preferences)
					formData.append(
						'preferences',
						JSON.stringify(profileData.preferences),
					);
				formData.append('avatar', profileData.avatar);
				const data = await apiService.put('/users/profile', formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				});
				if (data?.user) return data;
				if (data?.data) return data;
				throw new Error('No valid profile update response');
			}
			// Fallback: normal JSON update
			const data = await apiService.put('/users/profile', profileData);
			if (data?.user) return data;
			if (data?.data) return data;
			throw new Error('No valid profile update response');
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
			toast.success('Profile updated successfully!');
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to update profile');
		},
	});
};
