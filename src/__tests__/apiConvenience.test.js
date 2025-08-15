import { vi } from 'vitest';
import apiService from '../services/api';

// Mock axios client internals indirectly by spying on apiService.request

describe('API convenience methods', () => {
	it('builds cocktails GET URL with filters', async () => {
		const spy = vi
			.spyOn(apiService, 'get')
			.mockResolvedValueOnce({ data: [], total: 0 });
		await apiService.getCocktails({ page: 2, limit: 10, tag: 'citrus' });
		expect(spy).toHaveBeenCalled();
		const calledUrl = spy.mock.calls[0][0];
		expect(calledUrl).toContain('/cocktails?');
		expect(calledUrl).toContain('page=2');
		expect(calledUrl).toContain('limit=10');
		expect(calledUrl).toContain('tag=citrus');
		spy.mockRestore();
	});

	it('createCocktail delegates to POST', async () => {
		const spy = vi
			.spyOn(apiService, 'post')
			.mockResolvedValueOnce({ success: true, id: '1' });
		await apiService.createCocktail({ name: 'Test' });
		expect(spy).toHaveBeenCalledWith('/cocktails', { name: 'Test' });
		spy.mockRestore();
	});
});
