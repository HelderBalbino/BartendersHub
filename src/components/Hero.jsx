import { useState, useEffect } from 'react';
import HeroBackground from './hero/HeroBackground';
import HeroHeader from './hero/HeroHeader';
import HeroContentFrame from './hero/HeroContentFrame';
import HeroSubtitle from './hero/HeroSubtitle';
import HeroButtons from './hero/HeroButtons';
import HeroFooter from './hero/HeroFooter';

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
			<HeroBackground />

			{/* Main content - Mobile-First Responsive Design */}
			<div
				className={`relative z-10 text-center px-4 sm:px-6 md:px-8 lg:px-8 max-w-7xl mx-auto transition-all duration-1500 ${
					isVisible
						? 'opacity-100 translate-y-0'
						: 'opacity-0 translate-y-10'
				}`}
			>
				{/* Enhanced top decorative section - Mobile optimized */}
				<HeroHeader />
				{/* Enhanced main frame with mobile-first styling */}
				<HeroContentFrame
					speakeasyQuotes={speakeasyQuotes}
					currentQuote={currentQuote}
				/>
				{/* Enhanced subtitle with better spacing - Mobile optimized */}
				{/* Enhanced subtitle with better spacing - Mobile optimized */}
				<HeroSubtitle />
				{/* Enhanced Art Deco styled CTA Buttons - Mobile Optimized */}
				<HeroButtons />
				{/* Enhanced bottom decorative element - Mobile optimized */}
				<HeroFooter />{' '}
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
