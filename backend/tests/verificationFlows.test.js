import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB } from './helpers/database.js';

beforeAll(async () => {
	await connectDB();
});
afterEach(async () => {
	await clearDB();
});
afterAll(async () => {
	await closeDB();
});

describe('Email verification flow', () => {
	test('verify with invalid token param fails', async () => {
		const res = await request(app).get('/api/auth/verify/badtoken');
		expect([400, 404]).toContain(res.status);
	});
});
