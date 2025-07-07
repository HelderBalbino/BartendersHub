import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [currentQuote, setCurrentQuote] = useState(0);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	// Sophisticated cocktail quotes for the speakeasy atmosphere
	const speakeasyQuotes = [
		'Where sophistication meets artistry',
		'Crafting liquid poetry since 1925',
		'Every cocktail tells a story',
		'The art of fine mixology',
		'Excellence in every drop',
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentQuote((prev) => (prev + 1) % speakeasyQuotes.length);
		}, 4000);
		return () => clearInterval(interval);
	}, [speakeasyQuotes.length]);

	return (
		<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden py-8'>
			{/* Enhanced Art Deco Background Pattern - Mobile Optimized */}
			<div className='absolute inset-0 opacity-8'>
				{/* Golden gradient overlay */}
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/15 via-transparent to-yellow-400/5'></div>

				{/* Geometric Art Deco elements - Better mobile responsive sizing */}
				<div className='absolute top-4 left-2 sm:top-8 sm:left-4 md:top-16 md:left-16 w-20 sm:w-32 md:w-48 h-20 sm:h-32 md:h-48 border border-yellow-400/25 rotate-45'></div>
				<div className='absolute bottom-4 right-2 sm:bottom-8 sm:right-4 md:bottom-16 md:right-16 w-16 sm:w-24 md:w-40 h-16 sm:h-24 md:h-40 border border-yellow-400/25 rotate-45'></div>
				<div className='absolute top-1/2 left-1 sm:left-2 md:left-8 w-12 sm:w-20 md:w-32 h-12 sm:h-20 md:h-32 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/4 right-1 sm:right-2 md:right-8 w-14 sm:w-24 md:w-36 h-14 sm:h-24 md:h-36 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-1/4 left-1/4 w-10 sm:w-16 md:w-28 h-10 sm:h-16 md:h-28 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-3/4 right-1/3 w-8 sm:w-12 md:w-24 h-8 sm:h-12 md:h-24 border border-yellow-400/20 rotate-45'></div>

				{/* Sophisticated radiating lines pattern - Mobile responsive */}
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent rotate-15'></div>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent rotate-30'></div>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent rotate-45'></div>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent -rotate-15'></div>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent -rotate-30'></div>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent -rotate-45'></div>
				</div>

				{/* Additional decorative elements - Mobile responsive */}
				<div className='absolute top-8 sm:top-12 md:top-20 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 md:w-64 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent'></div>
				<div className='absolute bottom-8 sm:bottom-12 md:bottom-20 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 md:w-64 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent'></div>
			</div>

			{/* Main content - Mobile-First Responsive Design */}
			<div
				className={`relative z-10 text-center px-4 sm:px-6 md:px-8 lg:px-8 max-w-7xl mx-auto transition-all duration-1500 ${
					isVisible
						? 'opacity-100 translate-y-0'
						: 'opacity-0 translate-y-10'
				}`}
			>
				{/* Enhanced top decorative section - Mobile optimized */}
				<div className='mb-6 sm:mb-8 md:mb-12 pt-16 sm:pt-20'>
					<div className='w-20 sm:w-24 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-2 sm:mb-3 md:mb-4'></div>
					<div className='flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4'>
						<div className='w-2 h-2 sm:w-3 sm:h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
						<div className='text-yellow-400 text-xs sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] font-light px-2'>
							Premium Mixology Experience
						</div>
						<div className='w-2 h-2 sm:w-3 sm:h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
					</div>
					<div className='w-12 sm:w-16 md:w-24 h-0.5 bg-yellow-400 mx-auto'></div>
				</div>

				{/* Enhanced main frame with mobile-first styling */}
				<div className='relative border border-yellow-400/40 sm:border-yellow-400/40 md:border-2 p-6 sm:p-8 md:p-10 lg:p-16 mb-8 sm:mb-12 md:mb-16 bg-black/20 backdrop-blur-sm'>
					{/* Enhanced Art Deco corner decorations - Mobile responsive */}
					<div className='absolute -top-1 -left-1 sm:-top-1 sm:-left-1 md:-top-1 md:-left-1 w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 border-l-2 border-t-2 sm:border-l-3 sm:border-t-3 md:border-l-4 md:border-t-4 border-yellow-400'></div>
					<div className='absolute -top-1 -right-1 sm:-top-1 sm:-right-1 md:-top-1 md:-right-1 w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 border-r-2 border-t-2 sm:border-r-3 sm:border-t-3 md:border-r-4 md:border-t-4 border-yellow-400'></div>
					<div className='absolute -bottom-1 -left-1 sm:-bottom-1 sm:-left-1 md:-bottom-1 md:-left-1 w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 border-l-2 border-b-2 sm:border-l-3 sm:border-b-3 md:border-l-4 md:border-b-4 border-yellow-400'></div>
					<div className='absolute -bottom-1 -right-1 sm:-bottom-1 sm:-right-1 md:-bottom-1 md:-right-1 w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 border-r-2 border-b-2 sm:border-r-3 sm:border-b-3 md:border-r-4 md:border-b-4 border-yellow-400'></div>

					{/* Inner decorative frame - Mobile responsive */}
					<div className='absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 border-l border-t sm:border-l-2 sm:border-t-2 border-yellow-400/60'></div>
					<div className='absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 border-r border-t sm:border-r-2 sm:border-t-2 border-yellow-400/60'></div>
					<div className='absolute bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4 w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 border-l border-b sm:border-l-2 sm:border-b-2 border-yellow-400/60'></div>
					<div className='absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 border-r border-b sm:border-r-2 sm:border-b-2 border-yellow-400/60'></div>

					{/* Sophisticated cocktail emblem */}
					<div className='mb-6 sm:mb-8 relative'>
						<div className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-yellow-400 mb-3 sm:mb-4 filter drop-shadow-lg'>
							🥃
						</div>
						<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 border border-yellow-400/30 rotate-45'></div>
					</div>

					{/* Enhanced main headline with luxury typography - Better mobile scaling */}
					<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl 2xl:text-9xl font-extralight text-white mb-6 sm:mb-8 leading-none tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase'>
						<span className='block mb-2 sm:mb-3 text-shadow-lg'>
							Bartenders'
						</span>
						<span className='text-yellow-400 font-thin tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] filter drop-shadow-md'>
							Hub
						</span>
					</h1>

					{/* Elegant decorative separator with Art Deco pattern - Mobile optimized */}
					<div className='flex items-center justify-center mb-6 sm:mb-8'>
						<div className='w-12 sm:w-16 md:w-20 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
						<div className='flex items-center mx-4 sm:mx-6'>
							<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-1 sm:mx-2'></div>
							<div className='w-3 sm:w-4 h-3 sm:h-4 border border-yellow-400 rotate-45 mx-1 sm:mx-2'></div>
							<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-1 sm:mx-2'></div>
						</div>
						<div className='w-12 sm:w-16 md:w-20 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
					</div>

					{/* Enhanced rotating quotes with sophisticated styling - Mobile optimized */}
					<div className='mb-6 sm:mb-8 min-h-[4rem] sm:min-h-[5rem] md:h-16 flex items-center justify-center'>
						<p className='text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300 font-light italic tracking-wide sm:tracking-wider transition-all duration-1000 max-w-xs sm:max-w-sm md:max-w-4xl leading-relaxed px-2'>
							<span className='text-yellow-400 text-lg sm:text-xl md:text-2xl'>
								"
							</span>
							{speakeasyQuotes[currentQuote]}
							<span className='text-yellow-400 text-lg sm:text-xl md:text-2xl'>
								"
							</span>
						</p>
					</div>
				</div>

				{/* Enhanced subtitle with better spacing - Mobile optimized */}
				<div className='mb-10 sm:mb-12 md:mb-16 max-w-xs sm:max-w-lg md:max-w-4xl mx-auto'>
					<p className='text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-400 leading-relaxed font-light tracking-wide px-4 sm:px-2'>
						Step into the golden age of cocktails. Where master
						mixologists craft liquid poetry and every drink is a
						work of art. Welcome to the most exclusive bartending
						experience.
					</p>

					{/* Subtitle decorative element */}
					<div className='mt-6 sm:mt-8 flex items-center justify-center'>
						<div className='w-12 sm:w-16 h-0.5 bg-yellow-400/50'></div>
						<div className='w-2 h-2 border border-yellow-400/50 rotate-45 mx-3 sm:mx-4'></div>
						<div className='w-12 sm:w-16 h-0.5 bg-yellow-400/50'></div>
					</div>
				</div>

				{/* Enhanced Art Deco styled CTA Buttons - Mobile Optimized */}
				<div className='flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8 justify-center items-center mb-10 sm:mb-12 md:mb-16 lg:mb-20 px-4 sm:px-6 pb-40 button-stack-mobile'>
					<button className='group relative w-full max-w-xs sm:max-w-sm md:max-w-md bg-yellow-400 text-black font-light py-4 sm:py-4 md:py-5 px-6 sm:px-8 md:px-12 border border-yellow-400 sm:border-2 transition-all duration-700 hover:bg-black hover:text-yellow-400 tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase text-xs sm:text-sm shadow-2xl touch-manipulation btn-touch tap-feedback block text-center'>
						<Link to='/cocktails'>
							{/* Enhanced Art Deco corners - Mobile responsive */}
							<div className='absolute -top-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-l border-t sm:border-l-2 sm:border-t-2 border-yellow-400'></div>
							<div className='absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-r border-t sm:border-r-2 sm:border-t-2 border-yellow-400'></div>
							<div className='absolute -bottom-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-l border-b sm:border-l-2 sm:border-b-2 border-yellow-400'></div>
							<div className='absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-r border-b sm:border-r-2 sm:border-b-2 border-yellow-400'></div>

							{/* Inner decorative elements - Mobile responsive */}
							<div className='absolute top-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l border-t border-black group-hover:border-yellow-400 transition-colors duration-700'></div>
							<div className='absolute top-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-r border-t border-black group-hover:border-yellow-400 transition-colors duration-700'></div>
							<div className='absolute bottom-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l border-b border-black group-hover:border-yellow-400 transition-colors duration-700'></div>
							<div className='absolute bottom-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-r border-b border-black group-hover:border-yellow-400 transition-colors duration-700'></div>

							<span className='relative z-10 flex items-center justify-center gap-2 sm:gap-3'>
								<span>Explore Collection</span>
								<span className='text-sm sm:text-base md:text-lg group-hover:translate-x-1 transition-transform duration-300'>
									→
								</span>
							</span>
						</Link>
					</button>

					<Link
						to='/login?mode=login'
						className='group relative w-full max-w-xs sm:max-w-sm md:max-w-md bg-yellow-400/10 text-yellow-400 font-light py-4 sm:py-4 md:py-5 px-6 sm:px-8 md:px-12 border-2 border-yellow-400 transition-all duration-700 hover:bg-yellow-400 hover:text-black hover:shadow-2xl tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase text-xs sm:text-sm touch-manipulation btn-touch tap-feedback focus-mobile block text-center'
					>
						{/* Enhanced Art Deco corners - Mobile responsive */}
						<div className='absolute -top-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-l border-t sm:border-l-2 sm:border-t-2 border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-r border-t sm:border-r-2 sm:border-t-2 border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -bottom-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-l border-b sm:border-l-2 sm:border-b-2 border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-r border-b sm:border-r-2 sm:border-b-2 border-yellow-400 transition-colors duration-700'></div>

						{/* Inner decorative elements - Mobile responsive */}
						<div className='absolute top-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l border-t border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute top-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-r border-t border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute bottom-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l border-b border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute bottom-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-r border-b border-yellow-400 transition-colors duration-700'></div>

						<span className='relative z-10 flex items-center justify-center gap-2 sm:gap-3'>
							<span>🔓</span>
							<span>Login</span>
						</span>
					</Link>

					<Link
						to='/login?mode=register'
						className='group relative w-full max-w-xs sm:max-w-sm md:max-w-md bg-transparent text-yellow-400 font-light py-4 sm:py-4 md:py-5 px-6 sm:px-8 md:px-12 border border-yellow-400/60 sm:border-2 transition-all duration-700 hover:border-yellow-400 hover:bg-yellow-400/10 hover:shadow-2xl tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase text-xs sm:text-sm touch-manipulation btn-touch tap-feedback focus-mobile block text-center'
					>
						{/* Enhanced Art Deco corners - Mobile responsive */}
						<div className='absolute -top-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-l border-t sm:border-l-2 sm:border-t-2 border-yellow-400/60 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-r border-t sm:border-r-2 sm:border-t-2 border-yellow-400/60 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -bottom-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-l border-b sm:border-l-2 sm:border-b-2 border-yellow-400/60 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-r border-b sm:border-r-2 sm:border-b-2 border-yellow-400/60 group-hover:border-yellow-400 transition-colors duration-700'></div>

						{/* Inner decorative elements - Mobile responsive */}
						<div className='absolute top-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute top-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-r border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute bottom-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute bottom-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-r border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>

						<span className='relative z-10 flex items-center justify-center gap-2 sm:gap-3'>
							<span>🚀</span>
							<span>Join the Hub</span>
						</span>
					</Link>

					<Link
						to='/addCocktail'
						className='group relative w-full max-w-xs sm:max-w-sm md:max-w-md bg-transparent text-yellow-400 font-light py-4 sm:py-4 md:py-5 px-6 sm:px-8 md:px-12 border border-yellow-400/30 sm:border-2 transition-all duration-700 hover:border-yellow-400 hover:bg-yellow-400/5 hover:shadow-xl tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase text-xs sm:text-sm touch-manipulation btn-touch tap-feedback focus-mobile block text-center'
					>
						{/* Enhanced Art Deco corners - Mobile responsive */}
						<div className='absolute -top-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-l border-t sm:border-l-2 sm:border-t-2 border-yellow-400/30 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-r border-t sm:border-r-2 sm:border-t-2 border-yellow-400/30 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -bottom-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-l border-b sm:border-l-2 sm:border-b-2 border-yellow-400/30 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-r border-b sm:border-r-2 sm:border-b-2 border-yellow-400/30 group-hover:border-yellow-400 transition-colors duration-700'></div>

						{/* Inner decorative elements - Mobile responsive */}
						<div className='absolute top-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l border-t border-yellow-400/20 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute top-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-r border-t border-yellow-400/20 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute bottom-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l border-b border-yellow-400/20 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute bottom-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-r border-b border-yellow-400/20 group-hover:border-yellow-400 transition-colors duration-700'></div>

						<span className='relative z-10 flex items-center justify-center gap-2 sm:gap-3'>
							<span>🍸</span>
							<span>Add Your Cocktail</span>
						</span>
					</Link>
				</div>

				{/* Enhanced bottom decorative element - Mobile optimized */}
				<div className='mt-12 sm:mt-16 md:mt-20'>
					{/* Sophisticated divider pattern */}
					<div className='flex items-center justify-center mb-6 sm:mb-8'>
						<div className='w-16 sm:w-20 md:w-24 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
						<div className='flex items-center mx-4 sm:mx-6 md:mx-8'>
							<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-1 sm:mx-2'></div>
							<div className='text-yellow-400 text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-light mx-2 sm:mx-4'>
								Est. 2025
							</div>
							<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-1 sm:mx-2'></div>
						</div>
						<div className='w-16 sm:w-20 md:w-24 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
					</div>

					{/* Premium tagline - Mobile optimized */}
					<div className='text-center px-4'>
						<p className='text-gray-500 text-xs sm:text-sm font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-3 sm:mb-4 leading-relaxed'>
							Crafted with Excellence • Served with Passion
						</p>

						{/* Final decorative element */}
						<div className='flex items-center justify-center'>
							<div className='w-2 sm:w-3 h-2 sm:h-3 border border-yellow-400/50 rotate-45 mx-1 sm:mx-2'></div>
							<div className='w-4 sm:w-6 h-0.5 bg-yellow-400/50'></div>
							<div className='w-1 h-1 bg-yellow-400 rounded-full mx-2 sm:mx-3'></div>
							<div className='w-4 sm:w-6 h-0.5 bg-yellow-400/50'></div>
							<div className='w-2 sm:w-3 h-2 sm:h-3 border border-yellow-400/50 rotate-45 mx-1 sm:mx-2'></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
