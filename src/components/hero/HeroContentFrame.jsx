import PropTypes from 'prop-types';

const HeroContentFrame = ({ speakeasyQuotes, currentQuote }) => {
	return (
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
	);
};

HeroContentFrame.propTypes = {
	speakeasyQuotes: PropTypes.arrayOf(PropTypes.string).isRequired,
	currentQuote: PropTypes.number.isRequired,
};

export default HeroContentFrame;
