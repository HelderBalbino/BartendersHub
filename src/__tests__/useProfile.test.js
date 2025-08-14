import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as profileHooks from '../hooks/useProfile';
import apiService from '../services/api';

jest.mock('../services/api');

const wrapper = ({ children }) => {
	const client = new QueryClient();
	return (
		<QueryClientProvider client={client}>{children}</QueryClientProvider>
	);
};

describe('useUserProfileById', () => {
	it('returns user data from apiService (user field)', async () => {
		apiService.get.mockResolvedValueOnce({
			success: true,
			user: { id: '123', name: 'Jane' },
		});
		const { result } = renderHook(
			() => profileHooks.useUserProfileById('123'),
			{ wrapper },
		);
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({ id: '123', name: 'Jane' });
	});

	it('handles direct user object shape', async () => {
		apiService.get.mockResolvedValueOnce({ id: 'abc', name: 'Direct' });
		const { result } = renderHook(
			() => profileHooks.useUserProfileById('abc'),
			{ wrapper },
		);
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({ id: 'abc', name: 'Direct' });
	});
});
