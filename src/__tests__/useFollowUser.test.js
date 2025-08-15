import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import * as communityHook from '../hooks/useCommunity';

// We'll import apiService to stub follow/unfollow low-level calls if needed
import apiService from '../services/api';

// Helper to render hooks with React Query context
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

		// Seed initial caches
		queryClient.setQueryData(['userProfile', targetUserId], {
			_id: targetUserId,
			followers: [currentUserId],
		});
		queryClient.setQueryData(['userStats', targetUserId], {
			followerCount: 1,
		});
		queryClient.setQueryData(
			['communityMembers'],
			[{ _id: targetUserId, followers: [currentUserId] }],
		);

		// Spy on apiService.post to simulate failure
		const apiSpy = vi
			.spyOn(apiService, 'post')
			.mockRejectedValueOnce(new Error('network'));

		const { result } = renderHook(
			() => communityHook.useFollowUser(currentUserId),
			{ wrapper: createWrapper(queryClient) },
		);

		await act(async () => {
			try {
				await result.current.mutateAsync(targetUserId);
			} catch {
				// expected
			}
		});

		// After rollback, original state should be preserved
		const profile = queryClient.getQueryData(['userProfile', targetUserId]);
		expect(profile.followers).toContain(currentUserId);
		const stats = queryClient.getQueryData(['userStats', targetUserId]);
		expect(stats.followerCount).toBe(1);

		apiSpy.mockRestore();
	});

	it('optimistically updates follow then commits on success', async () => {
		const queryClient = new QueryClient();
		const targetUserId = 'userC';
		const currentUserId = 'currentUser';

		queryClient.setQueryData(['userProfile', targetUserId], {
			_id: targetUserId,
			followers: [],
		});
		queryClient.setQueryData(['userStats', targetUserId], {
			followerCount: 0,
		});
		queryClient.setQueryData(
			['communityMembers'],
			[{ _id: targetUserId, followers: [] }],
		);

		const apiSpy = vi
			.spyOn(apiService, 'post')
			.mockResolvedValueOnce({ success: true });

		const { result } = renderHook(
			() => communityHook.useFollowUser(currentUserId),
			{ wrapper: createWrapper(queryClient) },
		);

		await act(async () => {
			await result.current.mutateAsync(targetUserId);
		});

		// Optimistic state should have follower added
		const profile = queryClient.getQueryData(['userProfile', targetUserId]);
		expect(profile.followers).toContain(currentUserId);
		const stats = queryClient.getQueryData(['userStats', targetUserId]);
		expect(stats.followerCount).toBe(1);

		apiSpy.mockRestore();
	});
});
