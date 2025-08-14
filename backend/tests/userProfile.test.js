import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import User from '../src/models/User.js';

// Lightweight integration-ish test ensuring GET /api/users/:id returns expected shape
// Assumes an in-memory or test Mongo instance is configured externally (if not, the test will skip).

describe('GET /api/users/:id', () => {
	let user;
	beforeAll(async () => {
		if (!process.env.MONGODB_URI) {
			console.warn('Skipping userProfile.test.js (no MONGODB_URI set)');
			return;
		}
		await mongoose.connect(process.env.MONGODB_URI, {
			dbName: 'bartendershub_test',
		});
		user = await User.create({
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'hashedpassword',
		});
	});

	afterAll(async () => {
		if (mongoose.connection.readyState === 1) {
			await User.deleteMany({ email: 'test@example.com' });
			await mongoose.connection.close();
		}
	});

	it('returns user and cocktails array (even if empty)', async () => {
		if (!user) return; // skipped due to missing DB
		const res = await request(app).get(`/api/users/${user._id}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body).toHaveProperty('user');
		expect(res.body).toHaveProperty('cocktails');
		expect(Array.isArray(res.body.cocktails)).toBe(true);
	});
});
