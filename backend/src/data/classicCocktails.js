// Core classic cocktails seed data (minimal representative subset). Expand as needed.
// Do NOT include _id or createdBy; those are injected by the seed script.
// Image will be injected by script (placeholder) unless you add explicit image data.

export default [
	{
		name: 'Old Fashioned',
		description:
			'Whiskey, sugar, bitters. Late 19th-century classic emphasizing balance and aroma.',
		ingredients: [
			{ name: 'Bourbon or Rye Whiskey', amount: '2', unit: 'oz' },
			{ name: 'Simple Syrup (1:1)', amount: '0.25', unit: 'oz' },
			{ name: 'Angostura Bitters', amount: '2', unit: 'dashes' },
			{
				name: 'Orange Twist',
				amount: '1',
				unit: 'garnish',
				optional: true,
			},
		],
		instructions: [
			{
				step: 1,
				description: 'Add syrup and bitters to chilled mixing glass.',
			},
			{
				step: 2,
				description:
					'Add whiskey and ice, stir until chilled and properly diluted.',
			},
			{
				step: 3,
				description: 'Strain over large clear ice in a rocks glass.',
			},
			{
				step: 4,
				description: 'Express orange oils over the top and garnish.',
			},
		],
		prepTime: 3,
		servings: 1,
		glassType: 'rocks',
		garnish: 'Orange twist',
		category: 'classics',
		tags: ['iba', 'stirred', 'whiskey-forward'],
		alcoholContent: 'high',
		flavor: 'bitter',
		origin: 'United States',
		originYear: 1880,
		iba: true,
		aliases: ['Whiskey Cocktail'],
		defaultTechnique: 'Stirred',
	},
	{
		name: 'Negroni',
		description:
			'Equal parts gin, Campari, and sweet vermouth. Italian aperitivo balance of bitter and botanical.',
		ingredients: [
			{ name: 'Gin', amount: '1', unit: 'oz' },
			{ name: 'Campari', amount: '1', unit: 'oz' },
			{ name: 'Sweet Vermouth', amount: '1', unit: 'oz' },
			{
				name: 'Orange Peel',
				amount: '1',
				unit: 'garnish',
				optional: true,
			},
		],
		instructions: [
			{
				step: 1,
				description: 'Add all ingredients to a mixing glass with ice.',
			},
			{
				step: 2,
				description: 'Stir until chilled (around 20–25 seconds).',
			},
			{
				step: 3,
				description:
					'Strain over fresh large ice in a rocks glass or serve up.',
			},
			{
				step: 4,
				description: 'Express orange peel over the drink and garnish.',
			},
		],
		prepTime: 2,
		servings: 1,
		glassType: 'rocks',
		garnish: 'Orange peel',
		category: 'classics',
		tags: ['iba', 'bitter', 'aperitif'],
		alcoholContent: 'high',
		flavor: 'bitter',
		origin: 'Florence, Italy',
		originYear: 1919,
		iba: true,
		aliases: [],
		defaultTechnique: 'Stirred',
	},
	{
		name: 'Boulevardier',
		description: 'Bourbon take on a Negroni.',
		ingredients: [
			{ name: 'Bourbon', amount: '1.5', unit: 'oz' },
			{ name: 'Campari', amount: '1', unit: 'oz' },
			{ name: 'Sweet Vermouth', amount: '1', unit: 'oz' },
		],
		instructions: [
			{ step: 1, description: 'Add all ingredients to mixing glass with ice.' },
			{ step: 2, description: 'Stir until chilled.' },
			{ step: 3, description: 'Strain into a coupe or over a large cube.' },
		],
		prepTime: 2,
		servings: 1,
		glassType: 'coupe',
		tags: ['stirred', 'whiskey'],
		alcoholContent: 'high',
		flavor: 'bitter',
		category: 'classics',
		defaultTechnique: 'Stirred',
	},
	{
		name: 'Manhattan',
		description:
			'Rye (or bourbon), sweet vermouth, bitters. Iconic stirred whiskey classic.',
		ingredients: [
			{ name: 'Rye Whiskey', amount: '2', unit: 'oz' },
			{ name: 'Sweet Vermouth', amount: '1', unit: 'oz' },
			{ name: 'Angostura Bitters', amount: '2', unit: 'dashes' },
		],
		instructions: [
			{ step: 1, description: 'Add all ingredients to a mixing glass with ice.' },
			{ step: 2, description: 'Stir until very cold and properly diluted.' },
			{ step: 3, description: 'Strain into a chilled coupe; garnish with cherry or twist.' },
		],
		prepTime: 3,
		servings: 1,
		glassType: 'coupe',
		tags: ['stirred', 'whiskey', 'iba'],
		alcoholContent: 'high',
		flavor: 'bitter',
		category: 'classics',
		defaultTechnique: 'Stirred',
	},
	{
		name: 'Daiquiri',
		description:
			'Rum, lime, sugar. A study in balance; shaken citrus template.',
		ingredients: [
			{ name: 'White Rum', amount: '2', unit: 'oz' },
			{ name: 'Fresh Lime Juice', amount: '1', unit: 'oz' },
			{ name: 'Simple Syrup (1:1)', amount: '0.75', unit: 'oz' },
		],
		instructions: [
			{
				step: 1,
				description: 'Add all ingredients to a shaking tin with ice.',
			},
			{
				step: 2,
				description: 'Shake hard until well chilled and aerated.',
			},
			{ step: 3, description: 'Double strain into a chilled coupe.' },
		],
		prepTime: 2,
		servings: 1,
		glassType: 'coupe',
		garnish: 'None or lime twist',
		category: 'classics',
		tags: ['iba', 'sour', 'rum'],
		alcoholContent: 'medium',
		flavor: 'sour',
		origin: 'Cuba',
		originYear: 1898,
		iba: true,
		aliases: [],
		defaultTechnique: 'Shaken',
	},
	{
		name: 'Martini',
		description:
			'Gin and dry vermouth, iconic minimalist aperitif. Ratios and dilution define style.',
		ingredients: [
			{ name: 'Gin', amount: '2.5', unit: 'oz' },
			{ name: 'Dry Vermouth', amount: '0.5', unit: 'oz' },
			{
				name: 'Orange Bitters',
				amount: '1',
				unit: 'dash',
				optional: true,
			},
			{
				name: 'Lemon Twist or Olive',
				amount: '1',
				unit: 'garnish',
				optional: true,
			},
		],
		instructions: [
			{
				step: 1,
				description:
					'Add ingredients to a chilled mixing glass with quality ice.',
			},
			{
				step: 2,
				description: 'Stir until clear, cold and properly diluted.',
			},
			{
				step: 3,
				description: 'Strain into a chilled Nick & Nora or coupe.',
			},
			{
				step: 4,
				description:
					'Garnish with lemon twist (express oils) or olive.',
			},
		],
		prepTime: 3,
		servings: 1,
		glassType: 'nick-and-nora',
		garnish: 'Lemon twist or olive',
		category: 'classics',
		tags: ['iba', 'stirred', 'aperitif'],
		alcoholContent: 'high',
		flavor: 'bitter',
		origin: 'United States',
		originYear: 1900,
		iba: true,
		aliases: [],
		defaultTechnique: 'Stirred',
	},
];
