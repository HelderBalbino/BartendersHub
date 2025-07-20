import PropTypes from 'prop-types';

const HeroFooter = () => {
	return (
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
	);
};

export default HeroFooter;
