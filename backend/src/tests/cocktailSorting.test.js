import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import Cocktail from '../src/models/Cocktail.js';
import User from '../src/models/User.js';
import { hashPassword } from '../src/utils/auth.js';
import dotenv from 'dotenv';

dotenv.config();

// NOTE: Assumes a test database via MONGODB_URI pointing to an isolated DB.

describe('Cocktail sorting API', () => {
	let userId;

	beforeAll(async () => {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(process.env.MONGODB_URI, {});
		}

		// Clear collections
		await Promise.all([Cocktail.deleteMany({}), User.deleteMany({})]);

		const user = await User.create({
			name: 'Sorter',
			email: 'sorter@example.com',
			password: await hashPassword('Password1!'),
			username: 'sorter_user',
		});
		userId = user._id;

		const base = {
			description: 'Test cocktail',
			ingredients: [{ name: 'Gin', amount: '1', unit: 'oz' }],
			instructions: [{ step: 1, description: 'Mix' }],
			prepTime: 2,
			servings: 1,
			glassType: 'Glass',
			image: {
				url: 'https://example.com/image.jpg',
				publicId: 'test/image',
			},
			category: 'classics',
			isApproved: true,
		};

		// Create cocktails with different ratings / likes / views order
		await Cocktail.insertMany([
			{
				...base,
				name: 'A',
				createdBy: userId,
				views: 5,
				likes: [{ user: userId }],
				ratings: [{ user: userId, rating: 5 }],
			},
			{
				...base,
				name: 'B',
				createdBy: userId,
				views: 10,
				likes: [],
				ratings: [{ user: userId, rating: 4 }],
			},
			{
				...base,
				name: 'C',
				createdBy: userId,
				views: 2,
				likes: [{ user: userId }, { user: userId }],
				ratings: [{ user: userId, rating: 3 }],
			},
		]);
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	test('sort by rating returns cocktails ordered by averageRating desc', async () => {
		const res = await request(app).get(
			'/api/cocktails?sortBy=rating&limit=5',
		);
		expect(res.status).toBe(200);
		const names = res.body.data.map((c) => c.name);
		// A (5), B (4), C (3)
		expect(names.slice(0, 3)).toEqual(['A', 'B', 'C']);
	});

	test('sort by likes returns cocktails ordered by likesCount desc then createdAt', async () => {
		const res = await request(app).get(
			'/api/cocktails?sortBy=likes&limit=5',
		);
		expect(res.status).toBe(200);
		const names = res.body.data.map((c) => c.name);
		// C has 2 likes, A has 1, B has 0
		expect(names.slice(0, 3)).toEqual(['C', 'A', 'B']);
	});
});
