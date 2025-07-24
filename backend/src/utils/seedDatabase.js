import dotenv from 'dotenv';
import process from 'process';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Cocktail from '../models/Cocktail.js';
import { hashPassword } from '../utils/auth.js';

/*
 * SECURITY WARNING: This file contains seed data for development purposes only.
 * All passwords used here are weak and should NEVER be used in production.
 * If running this seeder in production, ensure all passwords are changed immediately.
 */

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Sample data
const users = [
	{
		name: 'Marco Rossi',
		email: 'marco@bartendershub.com',
		username: 'marco_mixologist',
		password: 'password123',
		bio: 'Master mixologist with 15 years of experience in premium cocktail crafting.',
		speciality: 'Classic Cocktails',
		location: 'Milan, Italy',
		isVerified: true,
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
		badges: ['Master Mixologist', 'Founder'],
	},
	{
		name: 'Sophia Chen',
		email: 'sophia@bartendershub.com',
		username: 'cocktail_queen',
		password: 'password123',
		bio: 'Molecular mixology expert and cocktail innovator.',
		speciality: 'Molecular Mixology',
		location: 'London, UK',
		isVerified: true,
		avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
		badges: ['Innovation Leader', 'Top Contributor'],
	},
	{
		name: 'Diego Rodriguez',
		email: 'diego@bartendershub.com',
		username: 'tequila_diego',
		password: 'password123',
		bio: 'Tequila and mezcal specialist from Mexico.',
		speciality: 'Agave Spirits',
		location: 'Mexico City, Mexico',
		isVerified: true,
		avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
		badges: ['Agave Specialist', 'Cultural Ambassador'],
	},
];

const cocktails = [
	{
		name: 'Classic Martini',
		description:
			'The quintessential gin cocktail, crisp and clean with a perfect balance of gin and vermouth.',
		ingredients: [
			{ name: 'Gin', amount: '2.5', unit: 'oz' },
			{ name: 'Dry Vermouth', amount: '0.5', unit: 'oz' },
			{ name: 'Lemon Twist', amount: '1', unit: 'piece', optional: true },
			{ name: 'Olive', amount: '1', unit: 'piece', optional: true },
		],
		instructions: [
			{ step: 1, description: 'Chill a martini glass in the freezer' },
			{
				step: 2,
				description: 'Add gin and vermouth to a mixing glass with ice',
			},
			{ step: 3, description: 'Stir gently for 20-30 seconds' },
			{ step: 4, description: 'Strain into the chilled martini glass' },
			{ step: 5, description: 'Garnish with lemon twist or olive' },
		],
		difficulty: 'intermediate',
		prepTime: 3,
		servings: 1,
		glassType: 'Martini Glass',
		garnish: 'Lemon twist or olive',
		image: {
			url: 'https://res.cloudinary.com/bartendershub/image/upload/v1/cocktails/classic-martini.jpg',
			publicId: 'bartendershub/cocktails/classic-martini',
		},
		category: 'classics',
		tags: ['gin', 'vermouth', 'classic', 'dry'],
		alcoholContent: 'high',
		flavor: 'savory',
		isApproved: true,
		isFeatured: true,
	},
	{
		name: 'Negroni',
		description:
			'Perfect balance of gin, vermouth, and Campari - a bitter-sweet Italian classic.',
		ingredients: [
			{ name: 'Gin', amount: '1', unit: 'oz' },
			{ name: 'Sweet Vermouth', amount: '1', unit: 'oz' },
			{ name: 'Campari', amount: '1', unit: 'oz' },
			{ name: 'Orange Peel', amount: '1', unit: 'piece' },
		],
		instructions: [
			{
				step: 1,
				description:
					'Add gin, vermouth, and Campari to a rocks glass with ice',
			},
			{ step: 2, description: 'Stir gently to combine' },
			{ step: 3, description: 'Express orange peel oils over the drink' },
			{ step: 4, description: 'Garnish with orange peel' },
		],
		difficulty: 'beginner',
		prepTime: 2,
		servings: 1,
		glassType: 'Rocks Glass',
		garnish: 'Orange peel',
		image: {
			url: 'https://res.cloudinary.com/bartendershub/image/upload/v1/cocktails/negroni.jpg',
			publicId: 'bartendershub/cocktails/negroni',
		},
		category: 'classics',
		tags: ['gin', 'campari', 'vermouth', 'bitter'],
		alcoholContent: 'high',
		flavor: 'bitter',
		isApproved: true,
		isFeatured: true,
	},
	{
		name: 'Mojito',
		description:
			'Refreshing Cuban cocktail with mint, lime, and rum - perfect for summer.',
		ingredients: [
			{ name: 'White Rum', amount: '2', unit: 'oz' },
			{ name: 'Fresh Lime Juice', amount: '0.75', unit: 'oz' },
			{ name: 'Simple Syrup', amount: '0.5', unit: 'oz' },
			{ name: 'Fresh Mint Leaves', amount: '8', unit: 'leaves' },
			{ name: 'Soda Water', amount: '2', unit: 'oz' },
		],
		instructions: [
			{
				step: 1,
				description:
					'Muddle mint leaves gently in the bottom of a highball glass',
			},
			{ step: 2, description: 'Add lime juice and simple syrup' },
			{ step: 3, description: 'Fill glass with ice and add rum' },
			{ step: 4, description: 'Top with soda water and stir gently' },
			{ step: 5, description: 'Garnish with mint sprig and lime wheel' },
		],
		difficulty: 'intermediate',
		prepTime: 4,
		servings: 1,
		glassType: 'Highball Glass',
		garnish: 'Mint sprig and lime wheel',
		image: {
			url: 'https://res.cloudinary.com/bartendershub/image/upload/v1/cocktails/mojito.jpg',
			publicId: 'bartendershub/cocktails/mojito',
		},
		category: 'signature',
		tags: ['rum', 'mint', 'lime', 'refreshing'],
		alcoholContent: 'medium',
		flavor: 'fruity',
		isApproved: true,
		isFeatured: true,
	},
];

const seedDatabase = async () => {
	try {
		// Clear existing data
		await User.deleteMany({});
		await Cocktail.deleteMany({});

		console.log('Database cleared');

		// Create users
		const hashedUsers = await Promise.all(
			users.map(async (user) => ({
				...user,
				password: await hashPassword(user.password),
			})),
		);

		const createdUsers = await User.insertMany(hashedUsers);
		console.log(`${createdUsers.length} users created`);

		// Create cocktails with user references
		const cocktailsWithUsers = cocktails.map((cocktail, index) => ({
			...cocktail,
			createdBy: createdUsers[index % createdUsers.length]._id,
		}));

		const createdCocktails = await Cocktail.insertMany(cocktailsWithUsers);
		console.log(`${createdCocktails.length} cocktails created`);

		console.log('Database seeded successfully!');
		process.exit(0);
	} catch (error) {
		console.error('Error seeding database:', error);
		process.exit(1);
	}
};

seedDatabase();
