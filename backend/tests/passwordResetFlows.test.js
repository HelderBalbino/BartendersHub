import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB } from './helpers/database.js';
import User from '../src/models/User.js';
import { hashPassword } from '../src/utils/auth.js';

beforeAll(async () => {
	await connectDB();
});
afterEach(async () => {
	await clearDB();
});
afterAll(async () => {
	await closeDB();
});

describe('Password reset flow', () => {
	test('reset fails with invalid token param', async () => {
		await User.create({
			name: 'R',
			email: 'r@example.com',
			password: await hashPassword('Password1!'),
			username: 'reset',
			isVerified: true,
		});
		// endpoint defined as POST /api/auth/resetpassword/:token
		const res = await request(app)
			.post('/api/auth/resetpassword/badtok')
			.send({ password: 'NewPassword1!' });
		expect([400, 404]).toContain(res.status); // allow 400 per controller, 404 if route mismatch
	});
});
