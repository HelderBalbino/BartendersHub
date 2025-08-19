import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB } from './helpers/database.js';
import { getCacheMetrics } from '../src/middleware/cache.js';

beforeAll(async () => {
	await connectDB();
});
afterEach(async () => {
	await clearDB();
});
afterAll(async () => {
	await closeDB();
});

// Redis disabled in test env so middleware is no-op; emulate metrics manually by temporarily enabling? Not feasible without Redis.
// Instead we assert that no caching side-effects occur and ETag absent (since redis disabled), covering miss path increments bypassed.

describe('Cache middleware behavior in test (redis disabled)', () => {
	test('express default ETag may exist but redis metrics stay unchanged', async () => {
		const before = getCacheMetrics();
		const res1 = await request(app).get('/api/cocktails');
		expect(res1.status).toBe(200);
		// Express core may still set a weak ETag; ensure header (if present) is not our custom base64 pattern length 8
		if (res1.headers.etag) {
			// custom cache layer builds pattern W/"<size>-<base648>" where second segment length == 8
			const match = /W"(\d+)-([A-Za-z0-9+/=]{8})"/.exec(
				res1.headers.etag,
			);
			// If it matches our custom pattern the redis layer would have been active (should not in test env)
			expect(match).toBeNull();
		}
		const res2 = await request(app).get('/api/cocktails');
		expect(res2.status).toBe(200);
		const after = getCacheMetrics();
		expect(after.hits).toBe(before.hits); // unchanged due to disabled redis
		expect(after.misses).toBe(before.misses);
	});
});
