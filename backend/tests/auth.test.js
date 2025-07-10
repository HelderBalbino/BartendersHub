import request from 'supertest';
import app from '../src/server.js';
import User from '../src/models/User.js';
import { connectDB, closeDB, clearDB } from './helpers/database.js';

describe('Auth Endpoints', () => {
	beforeAll(async () => {
		await connectDB();
	});

	afterEach(async () => {
		await clearDB();
	});

	afterAll(async () => {
		await closeDB();
	});

	describe('POST /api/auth/register', () => {
		it('should register a new user', async () => {
			const userData = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'password123',
				username: 'testuser',
			};

			const response = await request(app)
				.post('/api/auth/register')
				.send(userData)
				.expect(201);

			expect(response.body.success).toBe(true);
			expect(response.body.user.email).toBe(userData.email);
			expect(response.body.token).toBeDefined();
		});

		it('should not register user with existing email', async () => {
			const userData = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'password123',
				username: 'testuser',
			};

			// Create user first
			await User.create(userData);

			const response = await request(app)
				.post('/api/auth/register')
				.send(userData)
				.expect(400);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe('User already exists');
		});
	});

	describe('POST /api/auth/login', () => {
		it('should login with valid credentials', async () => {
			const userData = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'password123',
				username: 'testuser',
			};

			// Register user first
			await request(app).post('/api/auth/register').send(userData);

			const response = await request(app)
				.post('/api/auth/login')
				.send({
					email: userData.email,
					password: userData.password,
				})
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.token).toBeDefined();
		});

		it('should not login with invalid credentials', async () => {
			const response = await request(app)
				.post('/api/auth/login')
				.send({
					email: 'nonexistent@example.com',
					password: 'wrongpassword',
				})
				.expect(401);

			expect(response.body.success).toBe(false);
		});
	});
});
