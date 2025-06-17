import { useState, useEffect } from 'react';

const Hero = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	const cocktailEmojis = ['🍸', '🍹', '🥃', '🍷', '🍾', '🥂'];
	const [currentEmoji, setCurrentEmoji] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentEmoji((prev) => (prev + 1) % cocktailEmojis.length);
		}, 2000);
		return () => clearInterval(interval);
	}, [cocktailEmojis.length]);

	return (
		<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden'>
			{/* Animated background elements */}
			<div className='absolute inset-0'>
				{/* Floating cocktail icons */}
				<div className='absolute top-1/4 left-1/4 text-yellow-400 text-2xl md:text-4xl animate-pulse opacity-30'>
					🍸
				</div>
				<div className='absolute top-1/3 right-1/4 text-yellow-400 text-xl md:text-3xl animate-bounce opacity-20 animation-delay-1000'>
					🥃
				</div>
				<div className='absolute bottom-1/4 left-1/3 text-yellow-400 text-lg md:text-2xl animate-pulse opacity-25 animation-delay-2000'>
					🍹
				</div>
				<div className='absolute top-1/2 right-1/3 text-yellow-400 text-xl md:text-3xl animate-bounce opacity-20 animation-delay-3000'>
					🍷
				</div>

				{/* Gradient overlay */}
				<div className='absolute inset-0 bg-black bg-opacity-40'></div>
			</div>

			{/* Main content */}
			<div
				className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto transition-all duration-1000 ${
					isVisible
						? 'opacity-100 translate-y-0'
						: 'opacity-0 translate-y-10'
				}`}
			>
				{/* Animated cocktail emoji */}
				<div className='mb-4 sm:mb-6 text-4xl sm:text-6xl md:text-8xl animate-bounce'>
					{cocktailEmojis[currentEmoji]}
				</div>

				{/* Main headline */}
				<h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight'>
					<span className='block mb-1 sm:mb-2'>Bartenders</span>
					<span className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent'>
						Hub
					</span>
				</h1>

				{/* Slogan */}
				<p className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-3 sm:mb-4 font-light px-2'>
					Where Every Pour Tells a Story
				</p>

				{/* Sub-slogan */}
				<p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2'>
					Master the art of mixology. Discover recipes, perfect your
					craft, and connect with fellow bartenders in the ultimate
					hub for cocktail enthusiasts.
				</p>

				{/* CTA Buttons */}
				<div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4'>
					<button className='w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-400/25'>
						Explore Cocktails
					</button>
					<button className='w-full sm:w-auto border-2 border-yellow-400 text-yellow-400 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg hover:bg-yellow-400 hover:text-black transform hover:scale-105 transition-all duration-300'>
						Join the Community
					</button>
				</div>

				{/* Feature highlights */}
				<div className='mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2'>
					<div className='text-center p-3 sm:p-4 bg-black bg-opacity-30 rounded-lg border border-yellow-400 border-opacity-20 hover:border-opacity-50 transition-all duration-300'>
						<div className='text-2xl sm:text-3xl mb-2'>📚</div>
						<h3 className='text-yellow-400 font-semibold mb-2 text-sm sm:text-base'>
							Recipe Library
						</h3>
						<p className='text-gray-400 text-xs sm:text-sm'>
							Thousands of cocktail recipes from classic to modern
						</p>
					</div>
					<div className='text-center p-3 sm:p-4 bg-black bg-opacity-30 rounded-lg border border-yellow-400 border-opacity-20 hover:border-opacity-50 transition-all duration-300'>
						<div className='text-2xl sm:text-3xl mb-2'>🎯</div>
						<h3 className='text-yellow-400 font-semibold mb-2 text-sm sm:text-base'>
							Skill Building
						</h3>
						<p className='text-gray-400 text-xs sm:text-sm'>
							Master techniques and elevate your bartending skills
						</p>
					</div>
					<div className='text-center p-3 sm:p-4 bg-black bg-opacity-30 rounded-lg border border-yellow-400 border-opacity-20 hover:border-opacity-50 transition-all duration-300'>
						<div className='text-2xl sm:text-3xl mb-2'>🤝</div>
						<h3 className='text-yellow-400 font-semibold mb-2 text-sm sm:text-base'>
							Community
						</h3>
						<p className='text-gray-400 text-xs sm:text-sm'>
							Connect with bartenders and mixologists worldwide
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
