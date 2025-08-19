import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB } from './helpers/database.js';
import User from '../src/models/User.js';
import Cocktail from '../src/models/Cocktail.js';
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

describe('Rating / Like edge cases', () => {
	let token;
	let cocktailId;
	let userId;
	beforeEach(async () => {
		const user = await User.create({
			name: 'Edge',
			email: 'edge@example.com',
			password: await hashPassword('Password1!'),
			username: 'edge',
			isVerified: true,
		});
		userId = user._id.toString();
		const login = await request(app)
			.post('/api/auth/login')
			.send({ email: 'edge@example.com', password: 'Password1!' });
		token = login.body.token;
		const cocktail = await Cocktail.create({
			name: 'Edge C',
			description: 'desc',
			createdBy: user._id,
			ingredients: [{ name: 'Gin', amount: '40', unit: 'ml' }],
			instructions: [{ step: 1, description: 'Mix' }],
			prepTime: 2,
			servings: 1,
			glassType: 'Highball',
			image: { url: 'http://example.com/img.jpg', publicId: 'img1' },
			isApproved: true,
		});
		cocktailId = cocktail._id.toString();
	});

	test('cannot rate with invalid value', async () => {
		const res = await request(app)
			.post(`/api/cocktails/${cocktailId}/rating`)
			.set('Authorization', `Bearer ${token}`)
			.send({ rating: 10 });
		expect(res.status).toBe(400);
	});

	test('duplicate rating updates average not duplicate entry', async () => {
		const first = await request(app)
			.post(`/api/cocktails/${cocktailId}/rating`)
			.set('Authorization', `Bearer ${token}`)
			.send({ rating: 4 });
		expect(first.status).toBe(200);
		const second = await request(app)
			.post(`/api/cocktails/${cocktailId}/rating`)
			.set('Authorization', `Bearer ${token}`)
			.send({ rating: 5 });
		expect(second.status).toBe(200);
		const updated = await Cocktail.findById(cocktailId).lean();
		const occurrences = updated.ratings.filter(
			(r) => r.user.toString() === userId,
		).length;
		expect(occurrences).toBe(1);
	});

	test('liking twice toggles like (count stable)', async () => {
		const like1 = await request(app)
			.put(`/api/cocktails/${cocktailId}/like`)
			.set('Authorization', `Bearer ${token}`);
		expect(like1.status).toBe(200);
		const like2 = await request(app)
			.put(`/api/cocktails/${cocktailId}/like`)
			.set('Authorization', `Bearer ${token}`);
		expect(like2.status).toBe(200);
		const updated = await Cocktail.findById(cocktailId).lean();
		const occurrences = updated.likes.filter(
			(l) => l.user.toString() === userId,
		).length;
		expect(occurrences).toBeLessThanOrEqual(1);
	});
});
