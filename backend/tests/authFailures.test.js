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

describe('Auth failure scenarios', () => {
	test('login blocked if email not verified', async () => {
		await User.create({
			name: 'U',
			email: 'noverify@example.com',
			password: await hashPassword('Password1!'),
			username: 'noverify',
			isVerified: false,
		});
		const res = await request(app)
			.post('/api/auth/login')
			.send({ email: 'noverify@example.com', password: 'Password1!' });
		// depending on env AUTO_VERIFY, we expect 403 or success. If auto verify on, skip assertion.
		if (process.env.AUTO_VERIFY_USERS === 'true') return; // test environment auto verifying
		expect(res.status).toBe(403);
		expect(res.body.needVerification).toBe(true);
	});

	test('update password fails with wrong current password', async () => {
		const uRes = await request(app)
			.post('/api/auth/register')
			.send({
				name: 'U2',
				email: 'u2@example.com',
				password: 'Password1!',
				username: 'u2',
			});
		const token = uRes.body.token;
		const res = await request(app)
			.put('/api/auth/updatepassword')
			.set('Authorization', `Bearer ${token}`)
			.send({ currentPassword: 'Wrong1!', newPassword: 'Password2!' });
		expect(res.status).toBe(401);
	});
});
