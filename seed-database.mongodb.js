/* global use, db */
// BartendersHub Database Seeding Playground
// Use this to seed your database with sample data

use('bartendershub');

// First, let's clear existing data (CAUTION: This deletes all data!)
// Uncomment the lines below if you want to start fresh
// db.users.deleteMany({});
// db.cocktails.deleteMany({});
// db.favorites.deleteMany({});
// db.follows.deleteMany({});

// Create sample users (passwords are hashed in the actual app)
const sampleUsers = [
	{
		name: 'John Bartender',
		email: 'john@example.com',
		username: 'john_bartender',
		bio: 'Professional bartender with 10 years experience',
		speciality: 'Classic Cocktails',
		location: 'New York, NY',
		isVerified: true,
		isAdmin: false,
		avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
		badges: ['Master Mixologist'],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		name: 'Sarah Mixologist',
		email: 'sarah@example.com',
		username: 'sarah_mix',
		bio: 'Cocktail innovator and recipe creator',
		speciality: 'Molecular Mixology',
		location: 'San Francisco, CA',
		isVerified: true,
		isAdmin: false,
		avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
		badges: ['Innovation Leader'],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

// Insert sample users
db.users.insertMany(sampleUsers);

// Create sample cocktails
const sampleCocktails = [
	{
		name: 'Classic Mojito',
		description: 'A refreshing Cuban cocktail with mint, lime, and rum',
		ingredients: [
			'2 oz White Rum',
			'1 oz Fresh Lime Juice',
			'2 tsp Sugar',
			'6-8 Fresh Mint Leaves',
			'4 oz Soda Water',
			'Ice cubes',
		],
		instructions: [
			'Muddle mint leaves and sugar in a glass',
			'Add lime juice and rum',
			'Fill with ice cubes',
			'Top with soda water',
			'Stir gently and garnish with mint sprig',
		],
		difficulty: 'beginner',
		prepTime: 5,
		servings: 1,
		glassType: 'Highball',
		garnish: 'Fresh mint sprig',
		tags: ['refreshing', 'mint', 'rum', 'summer'],
		image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop',
		likes: 15,
		rating: 4.5,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		name: 'Espresso Martini',
		description: 'A sophisticated coffee cocktail perfect for evening',
		ingredients: [
			'2 oz Vodka',
			'1 oz Fresh Espresso',
			'0.5 oz Coffee Liqueur',
			'0.5 oz Simple Syrup',
			'Ice cubes',
		],
		instructions: [
			'Add all ingredients to a shaker with ice',
			'Shake vigorously for 15 seconds',
			'Double strain into a chilled martini glass',
			'Garnish with 3 coffee beans',
		],
		difficulty: 'intermediate',
		prepTime: 3,
		servings: 1,
		glassType: 'Martini',
		garnish: '3 coffee beans',
		tags: ['coffee', 'vodka', 'evening', 'sophisticated'],
		image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&h=300&fit=crop',
		likes: 22,
		rating: 4.7,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		name: 'Aperol Spritz',
		description:
			'A light, bubbly Italian aperitif perfect for warm weather',
		ingredients: [
			'3 oz Prosecco',
			'2 oz Aperol',
			'1 oz Soda Water',
			'Orange slice',
			'Ice cubes',
		],
		instructions: [
			'Fill a wine glass with ice',
			'Add Aperol',
			'Top with Prosecco',
			'Add a splash of soda water',
			'Stir gently and garnish with orange slice',
		],
		difficulty: 'beginner',
		prepTime: 2,
		servings: 1,
		glassType: 'Wine Glass',
		garnish: 'Orange slice',
		tags: ['aperitif', 'bubbly', 'italian', 'light'],
		image: 'https://images.unsplash.com/photo-1544145684-7f6b0830a63b?w=400&h=300&fit=crop',
		likes: 18,
		rating: 4.3,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

// Insert sample cocktails
db.cocktails.insertMany(sampleCocktails);

// Check what we've created
console.log('Sample data inserted successfully!');
console.log('Users created:', db.users.countDocuments());
console.log('Cocktails created:', db.cocktails.countDocuments());

// Display the data
console.log('\n--- USERS ---');
db.users.find({}, { name: 1, username: 1, speciality: 1 }).forEach((user) => {
	console.log(`${user.name} (@${user.username}) - ${user.speciality}`);
});

console.log('\n--- COCKTAILS ---');
db.cocktails
	.find({}, { name: 1, difficulty: 1, prepTime: 1 })
	.forEach((cocktail) => {
		console.log(
			`${cocktail.name} - ${cocktail.difficulty} (${cocktail.prepTime} min)`,
		);
	});
