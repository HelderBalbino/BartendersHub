import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB } from './helpers/database.js';
import User from '../src/models/User.js';
import { hashPassword } from '../src/utils/auth.js';

let token;

beforeAll(async () => {
	await connectDB();
	await User.create({
		name: 'Creator',
		email: 'creator@example.com',
		password: await hashPassword('Password1!'),
		username: 'creator1',
		isVerified: true,
	});
	// login to get token
	const res = await request(app)
		.post('/api/auth/login')
		.send({ email: 'creator@example.com', password: 'Password1!' });
	token = res.body.token;
});

afterEach(async () => {
	await clearDB();
});

afterAll(async () => {
	await closeDB();
});

describe('Cocktail create/update validation', () => {
	test('rejects missing ingredients array', async () => {
		const res = await request(app)
			.post('/api/cocktails')
			.set('Authorization', `Bearer ${token}`)
			.field('name', 'Bad')
			.field('description', 'Missing ingredients')
			.field('prepTime', 2)
			.field('servings', 1)
			.field('glassType', 'Glass')
			.field(
				'instructions',
				JSON.stringify([{ step: 1, description: 'Do' }]),
			)
			.attach('file', Buffer.from('fake'), { filename: 'fake.jpg' });
		expect(res.status).toBeGreaterThanOrEqual(400);
	});

	test('rejects invalid instruction structure', async () => {
		const res = await request(app)
			.post('/api/cocktails')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Bad2',
				description: 'Bad inst',
				ingredients: [{ name: 'Gin', amount: '1', unit: 'oz' }],
				instructions: [{ noStep: 1 }],
				prepTime: 2,
				servings: 1,
				glassType: 'Glass',
				image: { url: 'x', publicId: 'x' },
			});
		expect(res.status).toBeGreaterThanOrEqual(400);
	});
});
