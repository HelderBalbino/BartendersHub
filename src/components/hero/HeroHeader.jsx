import PropTypes from 'prop-types';

const HeroHeader = () => {
	return (
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
	);
};

export default HeroHeader;
