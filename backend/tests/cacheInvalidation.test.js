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

// Redis is disabled in test via env so we just ensure responses change after mutation (simulated cache invalidation)

describe('Cocktail cache invalidation logic', () => {
	let token;
	beforeEach(async () => {
		await User.create({
			name: 'C',
			email: 'c@example.com',
			password: await hashPassword('Password1!'),
			username: 'creator',
			isVerified: true,
		});
		const login = await request(app)
			.post('/api/auth/login')
			.send({ email: 'c@example.com', password: 'Password1!' });
		token = login.body.token;
	});

	test('list response count increases after create cocktail', async () => {
		const first = await request(app).get('/api/cocktails');
		expect(first.status).toBe(200);
		const initialCount = first.body.count ?? first.body.total ?? 0;
		const create = await request(app)
			.post('/api/cocktails')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'New Cocktail',
				description: 'Test',
				ingredients: [{ name: 'Vodka', amount: '50', unit: 'ml' }],
				instructions: [{ step: 1, description: 'Mix' }],
				prepTime: 2,
				servings: 1,
				glassType: 'Highball',
				image: {
					url: 'http://example.com/img.png',
					publicId: 'img-test',
				},
				isApproved: true,
			});
		if (create.status !== 201) {
			console.log(
				'Create cocktail response (unexpected status):',
				create.status,
				create.body,
			);
		}
		expect([201]).toContain(create.status);
		const second = await request(app).get('/api/cocktails');
		expect(second.status).toBe(200);
		const newCount = second.body.count ?? second.body.total;
		expect(newCount).toBe(initialCount + 1);
	});
});
