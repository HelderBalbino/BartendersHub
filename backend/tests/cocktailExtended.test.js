import request from 'supertest';
import { jest } from '@jest/globals';
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

jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

async function authUser(idx = 1) {
	const email = `c${idx}@example.com`;
	await User.create({
		name: `U${idx}`,
		email,
		password: await hashPassword('Password1!'),
		username: `user${idx}`,
		isVerified: true,
	});
	const login = await request(app)
		.post('/api/auth/login')
		.send({ email, password: 'Password1!' });
	return login.body.token;
}

const basePayload = () => ({
	name: 'Test Cocktail',
	description: 'Desc',
	ingredients: [{ name: 'Gin', amount: '50', unit: 'ml' }],
	instructions: [{ step: 1, description: 'Mix' }],
	prepTime: 2,
	servings: 1,
	glassType: 'Highball',
	isApproved: true,
});

describe('Cocktail extended flows', () => {
	test('create, update, view increment, comment, delete', async () => {
		const token = await authUser();
		const create = await request(app)
			.post('/api/cocktails')
			.set('Authorization', `Bearer ${token}`)
			.field('name', 'Test Cocktail')
			.field('description', 'Desc')
			.field(
				'ingredients',
				JSON.stringify([{ name: 'Gin', amount: '50', unit: 'ml' }]),
			)
			.field(
				'instructions',
				JSON.stringify([{ step: 1, description: 'Mix' }]),
			)
			.field('prepTime', 2)
			.field('servings', 1)
			.field('glassType', 'Highball');
		expect(create.status).toBe(201);
		const id = create.body.data._id;
		const get1 = await request(app).get(`/api/cocktails/${id}`);
		const views1 = get1.body.data.views;
		const get2 = await request(app).get(`/api/cocktails/${id}`);
		expect(get2.body.data.views).toBe(views1 + 1);
		const comment = await request(app)
			.post(`/api/cocktails/${id}/comments`)
			.set('Authorization', `Bearer ${token}`)
			.send({ text: 'Nice!' });
		expect(comment.status).toBe(201);
		const update = await request(app)
			.put(`/api/cocktails/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ garnish: 'Lime' });
		expect(update.status).toBe(200);
		const del = await request(app)
			.delete(`/api/cocktails/${id}`)
			.set('Authorization', `Bearer ${token}`);
		expect(del.status).toBe(200);
	});

	test('cursor pagination + sorting variants', async () => {
		await authUser();
		// seed 15 cocktails with varied likes/ratings
		const user = await User.findOne({ username: 'user1' });
		for (let i = 0; i < 15; i++) {
			const c = await Cocktail.create({
				...basePayload(),
				name: `C${i}`,
				createdBy: user._id,
				likes: i % 3 === 0 ? [{ user: user._id }] : [],
				ratings:
					i % 4 === 0
						? [{ user: user._id, rating: (i % 5) + 1 }]
						: [],
			});
			await c.save();
		}
		const firstPage = await request(app).get('/api/cocktails?limit=5');
		expect(firstPage.body.count).toBe(5);
		const cursor = firstPage.body.cursor;
		const secondPage = await request(app).get(
			`/api/cocktails?limit=5&cursor=${cursor}`,
		);
		expect(secondPage.body.count).toBe(5);
		// sorting checks
		const byViews = await request(app).get('/api/cocktails?sortBy=views');
		expect(byViews.status).toBe(200);
		const byRating = await request(app).get('/api/cocktails?sortBy=rating');
		expect(byRating.status).toBe(200);
		const byLikes = await request(app).get('/api/cocktails?sortBy=likes');
		expect(byLikes.status).toBe(200);
	});
});
