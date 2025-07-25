import PropTypes from 'prop-types';

const HeroSubtitle = () => {
	return (
		<div className='mb-10 sm:mb-12 md:mb-16 max-w-xs sm:max-w-lg md:max-w-4xl mx-auto'>
			<p className='text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-400 leading-relaxed font-light tracking-wide px-4 sm:px-2'>
				Step into the golden age of cocktails. Where mixologists craft
				liquid poetry and every drink is a work of art. Welcome to the
				most exclusive and bartending experience.
			</p>

			{/* Subtitle decorative element */}
			<div className='mt-6 sm:mt-8 flex items-center justify-center'>
				<div className='w-12 sm:w-16 h-0.5 bg-yellow-400/50'></div>
				<div className='w-2 h-2 border border-yellow-400/50 rotate-45 mx-3 sm:mx-4'></div>
				<div className='w-12 sm:w-16 h-0.5 bg-yellow-400/50'></div>
			</div>
		</div>
	);
};

export default HeroSubtitle;
