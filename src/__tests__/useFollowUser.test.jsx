import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import * as communityHook from '../hooks/useCommunity';
import apiService from '../services/api';

function createWrapper(client) {
	return ({ children }) => (
		<QueryClientProvider client={client}>{children}</QueryClientProvider>
	);
}

describe('useFollowUser optimistic update', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('optimistically toggles following state and rolls back on error', async () => {
		const queryClient = new QueryClient();
		const targetUserId = 'userB';
		const currentUserId = 'currentUser';
		localStorage.setItem('currentUserId', currentUserId);

		// Seed data matching hook query keys
		queryClient.setQueryData(['user', 'followers', targetUserId], {
			followers: [{ _id: currentUserId }],
			count: 1,
		});
		queryClient.setQueryData(['user', 'profile', targetUserId], {
			_id: targetUserId,
			followersCount: 1,
		});

		const apiSpy = vi
			.spyOn(apiService, 'put')
			.mockRejectedValueOnce(new Error('network'));

		const { result } = renderHook(() => communityHook.useFollowUser(), {
			wrapper: createWrapper(queryClient),
		});

		await act(async () => {
			result.current.followUser(targetUserId);
		});

		// After rollback (error), original state should be preserved
		const followersData = queryClient.getQueryData([
			'user',
			'followers',
			targetUserId,
		]);
		expect(
			followersData.followers.some(
				(f) => (f._id || f.id) === currentUserId,
			),
		).toBe(true);
		const profileData = queryClient.getQueryData([
			'user',
			'profile',
			targetUserId,
		]);
		expect(profileData.followersCount).toBe(1);

		apiSpy.mockRestore();
	});

	it('optimistically updates follow then commits on success', async () => {
		const queryClient = new QueryClient();
		const targetUserId = 'userC';
		const currentUserId = 'currentUser';
		localStorage.setItem('currentUserId', currentUserId);

		queryClient.setQueryData(['user', 'followers', targetUserId], {
			followers: [],
			count: 0,
		});
		queryClient.setQueryData(['user', 'profile', targetUserId], {
			_id: targetUserId,
			followersCount: 0,
		});

		const apiSpy = vi
			.spyOn(apiService, 'put')
			.mockResolvedValueOnce({ message: 'ok', isFollowing: true });

		const { result } = renderHook(() => communityHook.useFollowUser(), {
			wrapper: createWrapper(queryClient),
		});

		await act(async () => {
			result.current.followUser(targetUserId);
		});

		// Optimistic state applied
		const followersData = queryClient.getQueryData([
			'user',
			'followers',
			targetUserId,
		]);
		expect(
			followersData.followers.some(
				(f) => (f._id || f.id) === currentUserId,
			),
		).toBe(true);
		const profileData = queryClient.getQueryData([
			'user',
			'profile',
			targetUserId,
		]);
		expect(profileData.followersCount).toBe(1);

		apiSpy.mockRestore();
	});
});
