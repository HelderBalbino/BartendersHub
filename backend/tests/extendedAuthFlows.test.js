import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB } from './helpers/database.js';
import User from '../src/models/User.js';
import { hashPassword } from '../src/utils/auth.js';
import { createExpiringTokenPair, hashToken } from '../src/utils/token.js';

beforeAll(async () => {
	await connectDB();
});
afterEach(async () => {
	await clearDB();
});
afterAll(async () => {
	await closeDB();
});

// Silence console spam from email/websocket during these tests
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

// Helper to register unverified user (force AUTO_VERIFY off locally)
const registerUnverified = async () => {
	process.env.AUTO_VERIFY_USERS = 'false';
	const res = await request(app).post('/api/auth/register').send({
		name: 'T User',
		email: 'tu@example.com',
		password: 'Password1!',
		username: 'testuser',
	});
	return res.body.user;
};

describe('Auth extended flows', () => {
	test('forgot password returns generic success even if user unknown', async () => {
		const res = await request(app)
			.post('/api/auth/forgotpassword')
			.send({ email: 'nouser@example.com' });
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/reset link/i);
	});

	test('forgot + reset password success path', async () => {
		// create user
		const password = await hashPassword('Password1!');
		const user = await User.create({
			name: 'Reset',
			email: 'reset@example.com',
			password,
			username: 'resetu',
			isVerified: true,
		});
		// generate reset token manually like controller
		const { raw, hashed, expire } = createExpiringTokenPair(60 * 60 * 1000);
		user.resetPasswordToken = hashed;
		user.resetPasswordExpire = new Date(expire);
		await user.save();
		// perform reset
		const resetRes = await request(app)
			.post(`/api/auth/resetpassword/${raw}`)
			.send({ password: 'NewPassword1!' });
		expect(resetRes.status).toBe(200);
		// login with new password
		const login = await request(app)
			.post('/api/auth/login')
			.send({ email: 'reset@example.com', password: 'NewPassword1!' });
		expect(login.status).toBe(200);
	});

	test('resend verification issues new token for unverified user', async () => {
		const user = await registerUnverified();
		const before = await User.findById(user.id).lean();
		const firstToken = before.emailVerificationToken;
		const res = await request(app)
			.post('/api/auth/resend-verification')
			.send({ email: 'tu@example.com' });
		expect(res.status).toBe(200);
		const after = await User.findById(user.id).lean();
		expect(after.emailVerificationToken).toBeTruthy();
		if (firstToken)
			expect(after.emailVerificationToken).not.toBe(firstToken);
	});

	test('verify email success path', async () => {
		process.env.AUTO_VERIFY_USERS = 'false';
		await request(app)
			.post('/api/auth/register')
			.send({
				name: 'V',
				email: 'verifyme@example.com',
				password: 'Password1!',
				username: 'verifyme',
			});
		// If registration auto-verified (due to unexpected env), create manual unverified user fallback
		let dbUser = await User.findOne({ email: 'verifyme@example.com' });
		if (!dbUser) {
			dbUser = await User.create({
				name: 'V',
				email: 'verifyme@example.com',
				password: await hashPassword('Password1!'),
				username: 'verifyme2',
				isVerified: false,
			});
		}
		dbUser.isVerified = false; // force unverified state
		dbUser.emailVerificationToken = hashToken('knownraw');
		dbUser.emailVerificationExpire = new Date(Date.now() + 3600000);
		await dbUser.save();
		const verifyRes = await request(app).get('/api/auth/verify/knownraw');
		expect(verifyRes.status).toBe(200);
		const verified = await User.findById(dbUser._id);
		expect(verified.isVerified).toBe(true);
	});
});
