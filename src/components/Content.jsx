import { useState, useEffect, useMemo } from 'react';

const Content = () => {
	const [activeTab, setActiveTab] = useState('trending');
	const [currentFeatured, setCurrentFeatured] = useState(0);

	// Sample cocktail data - you can replace with API calls later
	const cocktailData = useMemo(
		() => ({
			trending: [
				{
					id: 1,
					name: 'Smoky Gold Rush',
					image: '🥃',
					difficulty: 'Advanced',
					prepTime: '5 min',
					description:
						'A modern twist on the classic Gold Rush with a smoky mezcal base',
					ingredients: [
						'2 oz Mezcal',
						'0.75 oz Fresh lemon juice',
						'0.75 oz Honey syrup',
						'2 dashes Angostura bitters',
						'Lemon wheel for garnish',
					],
					instructions: [
						'Add mezcal, lemon juice, and honey syrup to a shaker',
						'Fill with ice and shake vigorously for 15 seconds',
						'Double strain into a rocks glass over fresh ice',
						'Add 2 dashes of bitters on top',
						'Garnish with a lemon wheel',
					],
					bartenderNotes:
						'The key is using a good quality mezcal - the smokiness should complement, not overpower the honey sweetness.',
					tags: ['Smoky', 'Sweet', 'Modern'],
				},
				{
					id: 2,
					name: 'Golden Sunset',
					image: '🍹',
					difficulty: 'Intermediate',
					prepTime: '3 min',
					description:
						'A vibrant tropical cocktail perfect for summer evenings',
					ingredients: [
						'2 oz White rum',
						'1 oz Mango puree',
						'0.5 oz Lime juice',
						'0.5 oz Simple syrup',
						'Splash of grenadine',
						'Mint sprig for garnish',
					],
					instructions: [
						'Combine rum, mango puree, lime juice, and simple syrup in shaker',
						'Shake with ice for 10 seconds',
						'Strain into a hurricane glass filled with crushed ice',
						'Slowly pour grenadine to create sunset effect',
						'Garnish with fresh mint',
					],
					bartenderNotes:
						'Pour the grenadine slowly over the back of a spoon to achieve the perfect sunset layering effect.',
					tags: ['Tropical', 'Fruity', 'Summer'],
				},
				{
					id: 3,
					name: 'Black Gold Martini',
					image: '🍸',
					difficulty: 'Expert',
					prepTime: '4 min',
					description:
						'An elegant martini with activated charcoal and gold leaf',
					ingredients: [
						'2.5 oz Premium vodka',
						'0.5 oz Dry vermouth',
						'1 pinch Activated charcoal powder',
						'Edible gold leaf',
						'Lemon twist',
					],
					instructions: [
						'Chill martini glass in freezer',
						'Add vodka, vermouth, and charcoal to mixing glass',
						'Stir with ice for 30 seconds',
						'Double strain into chilled glass',
						'Garnish with gold leaf and lemon twist',
					],
					bartenderNotes:
						'Use food-grade activated charcoal sparingly - a tiny pinch creates the dramatic black color without affecting taste.',
					tags: ['Elegant', 'Visual', 'Premium'],
				},
			],
			seasonal: [
				{
					id: 4,
					name: 'Winter Spice Old Fashioned',
					image: '🥃',
					difficulty: 'Intermediate',
					prepTime: '4 min',
					description:
						'A warming winter cocktail with cinnamon and star anise',
					ingredients: [
						'2 oz Bourbon',
						'0.25 oz Cinnamon syrup',
						'2 dashes Orange bitters',
						'1 Star anise pod',
						'Orange peel',
						'Cinnamon stick',
					],
					instructions: [
						'Muddle star anise gently in mixing glass',
						'Add bourbon, cinnamon syrup, and bitters',
						'Stir with ice for 45 seconds',
						'Strain over large ice cube',
						'Express orange peel oils and garnish with cinnamon stick',
					],
					bartenderNotes:
						"Don't over-muddle the star anise - you want subtle spice notes, not overpowering licorice flavors.",
					tags: ['Warming', 'Spiced', 'Winter'],
				},
				{
					id: 5,
					name: 'Summer Cucumber Cooler',
					image: '🥒',
					difficulty: 'Beginner',
					prepTime: '3 min',
					description:
						'Refreshing cucumber-based cocktail perfect for hot days',
					ingredients: [
						'2 oz Gin',
						'4 Cucumber slices',
						'1 oz Lime juice',
						'0.75 oz Simple syrup',
						'Club soda',
						'Cucumber ribbon',
					],
					instructions: [
						'Muddle 3 cucumber slices in shaker',
						'Add gin, lime juice, and simple syrup',
						'Shake with ice vigorously',
						'Fine strain into collins glass with ice',
						'Top with club soda and garnish with cucumber ribbon',
					],
					bartenderNotes:
						'Use a vegetable peeler to create long, elegant cucumber ribbons for the perfect garnish.',
					tags: ['Refreshing', 'Light', 'Summer'],
				},
			],
			classic: [
				{
					id: 6,
					name: 'Perfect Manhattan',
					image: '🍷',
					difficulty: 'Intermediate',
					prepTime: '3 min',
					description:
						'The quintessential whiskey cocktail, perfectly balanced',
					ingredients: [
						'2 oz Rye whiskey',
						'0.5 oz Sweet vermouth',
						'0.5 oz Dry vermouth',
						'2 dashes Angostura bitters',
						'Maraschino cherry',
					],
					instructions: [
						'Add all ingredients to mixing glass',
						'Fill with ice and stir for 30 seconds',
						'Strain into chilled coupe glass',
						'Garnish with maraschino cherry',
					],
					bartenderNotes:
						"The 'perfect' refers to using both sweet and dry vermouth - this creates a more complex, balanced flavor profile.",
					tags: ['Classic', 'Whiskey', 'Timeless'],
				},
			],
		}),
		[],
	);

	const tabs = [
		{ id: 'trending', label: 'Trending Now', icon: '🔥' },
		{ id: 'seasonal', label: 'Seasonal', icon: '🍂' },
		{ id: 'classic', label: 'Classics', icon: '👑' },
	];

	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case 'Beginner':
				return 'text-green-400 bg-green-400 bg-opacity-20';
			case 'Intermediate':
				return 'text-yellow-400 bg-yellow-400 bg-opacity-20';
			case 'Advanced':
				return 'text-orange-400 bg-orange-400 bg-opacity-20';
			case 'Expert':
				return 'text-red-400 bg-red-400 bg-opacity-20';
			default:
				return 'text-gray-400 bg-gray-400 bg-opacity-20';
		}
	};

	// Auto-rotate featured cocktail every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			const currentCocktails = cocktailData[activeTab];
			setCurrentFeatured((prev) => (prev + 1) % currentCocktails.length);
		}, 5000);
		return () => clearInterval(interval);
	}, [activeTab, cocktailData]);

	const currentCocktails = cocktailData[activeTab];
	const featuredCocktail = currentCocktails[currentFeatured];

	return (
		<section className='bg-gradient-to-br from-black via-gray-900 to-black py-12 lg:py-20'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Section Header */}
				<div className='text-center mb-12'>
					<h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4'>
						Featured{' '}
						<span className='text-yellow-400'>Cocktails</span>
					</h2>
					<p className='text-gray-400 text-lg max-w-2xl mx-auto'>
						Discover trending recipes, seasonal favorites, and
						timeless classics crafted by master bartenders
					</p>
				</div>

				{/* Tab Navigation */}
				<div className='flex flex-wrap justify-center gap-2 sm:gap-4 mb-8'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => {
								setActiveTab(tab.id);
								setCurrentFeatured(0);
							}}
							className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
								activeTab === tab.id
									? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
									: 'bg-black bg-opacity-50 text-gray-400 hover:text-white border border-yellow-400 border-opacity-30 hover:border-opacity-60'
							}`}
						>
							<span className='text-lg'>{tab.icon}</span>
							<span className='text-sm sm:text-base'>
								{tab.label}
							</span>
						</button>
					))}
				</div>

				{/* Featured Cocktail Spotlight */}
				<div className='bg-black bg-opacity-40 rounded-2xl border border-yellow-400 border-opacity-30 p-6 sm:p-8 mb-12 backdrop-blur-sm'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
						{/* Cocktail Info */}
						<div>
							<div className='flex items-center gap-3 mb-4'>
								<span className='text-4xl sm:text-6xl'>
									{featuredCocktail.image}
								</span>
								<div>
									<h3 className='text-2xl sm:text-3xl font-bold text-white'>
										{featuredCocktail.name}
									</h3>
									<div className='flex items-center gap-3 mt-2'>
										<span
											className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
												featuredCocktail.difficulty,
											)}`}
										>
											{featuredCocktail.difficulty}
										</span>
										<span className='text-gray-400 text-sm'>
											⏱️ {featuredCocktail.prepTime}
										</span>
									</div>
								</div>
							</div>

							<p className='text-gray-300 mb-6 leading-relaxed'>
								{featuredCocktail.description}
							</p>

							{/* Tags */}
							<div className='flex flex-wrap gap-2 mb-6'>
								{featuredCocktail.tags.map((tag) => (
									<span
										key={tag}
										className='px-3 py-1 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-full text-xs'
									>
										#{tag}
									</span>
								))}
							</div>

							{/* Bartender Notes */}
							<div className='bg-yellow-400 bg-opacity-10 border-l-4 border-yellow-400 p-4 rounded-r-lg'>
								<h4 className='text-yellow-400 font-semibold mb-2 flex items-center gap-2'>
									💡 Bartender's Notes
								</h4>
								<p className='text-gray-300 text-sm italic'>
									{featuredCocktail.bartenderNotes}
								</p>
							</div>
						</div>

						{/* Recipe Details */}
						<div className='space-y-6'>
							{/* Ingredients */}
							<div className='bg-gray-900 bg-opacity-50 rounded-xl p-6'>
								<h4 className='text-yellow-400 font-semibold text-lg mb-4 flex items-center gap-2'>
									🧪 Ingredients
								</h4>
								<ul className='space-y-2'>
									{featuredCocktail.ingredients.map(
										(ingredient, index) => (
											<li
												key={index}
												className='text-gray-300 flex items-center gap-3'
											>
												<span className='w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0'></span>
												{ingredient}
											</li>
										),
									)}
								</ul>
							</div>

							{/* Instructions */}
							<div className='bg-gray-900 bg-opacity-50 rounded-xl p-6'>
								<h4 className='text-yellow-400 font-semibold text-lg mb-4 flex items-center gap-2'>
									📋 Instructions
								</h4>
								<ol className='space-y-3'>
									{featuredCocktail.instructions.map(
										(step, index) => (
											<li
												key={index}
												className='text-gray-300 flex gap-3'
											>
												<span className='w-6 h-6 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0'>
													{index + 1}
												</span>
												<span className='pt-0.5'>
													{step}
												</span>
											</li>
										),
									)}
								</ol>
							</div>
						</div>
					</div>

					{/* Rotation Indicators */}
					<div className='flex justify-center gap-2 mt-8'>
						{currentCocktails.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentFeatured(index)}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${
									index === currentFeatured
										? 'bg-yellow-400'
										: 'bg-gray-600 hover:bg-gray-500'
								}`}
							/>
						))}
					</div>
				</div>

				{/* All Cocktails Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{currentCocktails.map((cocktail) => (
						<div
							key={cocktail.id}
							className='bg-black bg-opacity-50 rounded-xl border border-yellow-400 border-opacity-20 hover:border-opacity-50 p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer'
						>
							<div className='text-center mb-4'>
								<span className='text-4xl mb-3 block'>
									{cocktail.image}
								</span>
								<h3 className='text-xl font-bold text-white mb-2'>
									{cocktail.name}
								</h3>
								<div className='flex items-center justify-center gap-3'>
									<span
										className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
											cocktail.difficulty,
										)}`}
									>
										{cocktail.difficulty}
									</span>
									<span className='text-gray-400 text-sm'>
										⏱️ {cocktail.prepTime}
									</span>
								</div>
							</div>

							<p className='text-gray-400 text-sm text-center mb-4 line-clamp-2'>
								{cocktail.description}
							</p>

							<div className='flex flex-wrap justify-center gap-1'>
								{cocktail.tags.map((tag) => (
									<span
										key={tag}
										className='px-2 py-1 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-full text-xs'
									>
										#{tag}
									</span>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Call to Action */}
				<div className='text-center mt-12'>
					<button className='bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-8 rounded-full text-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-400/25'>
						View All Recipes
					</button>
				</div>
			</div>
		</section>
	);
};

export default Content;
