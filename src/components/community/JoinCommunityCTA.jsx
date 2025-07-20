import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const JoinCommunityCTA = () => {
	return (
		<div className='text-center mt-16 md:mt-20'>
			<div className='relative border border-yellow-400/40 p-8 md:p-12 bg-black/20 backdrop-blur-sm max-w-3xl mx-auto'>
				{/* Art Deco corners */}
				<div className='absolute -top-1 -left-1 w-6 md:w-8 h-6 md:h-8 border-l-2 border-t-2 border-yellow-400'></div>
				<div className='absolute -top-1 -right-1 w-6 md:w-8 h-6 md:h-8 border-r-2 border-t-2 border-yellow-400'></div>
				<div className='absolute -bottom-1 -left-1 w-6 md:w-8 h-6 md:h-8 border-l-2 border-b-2 border-yellow-400'></div>
				<div className='absolute -bottom-1 -right-1 w-6 md:w-8 h-6 md:h-8 border-r-2 border-b-2 border-yellow-400'></div>

				<h2 className='text-2xl md:text-3xl font-light text-white tracking-[0.15em] uppercase mb-6'>
					Join the Hub
				</h2>
				<p className='text-lg md:text-xl text-gray-300 font-light italic mb-8 leading-relaxed'>
					"Share your passion, learn, and become part of the greatest
					mixology community."
				</p>

				<div className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center'>
					<Link
						to='/login?mode=register'
						className='group relative bg-yellow-400 text-black font-light py-3 md:py-4 px-8 md:px-10 border-2 border-yellow-400 transition-all duration-500 hover:bg-black hover:text-yellow-400 tracking-[0.1em] uppercase text-sm block text-center'
					>
						{/* Art Deco corners */}
						<div className='absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-yellow-400'></div>
						<div className='absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-yellow-400'></div>
						<div className='absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-yellow-400'></div>
						<div className='absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-yellow-400'></div>

						<span className='relative z-10'>Join the Hub</span>
					</Link>

					<Link
						to='/addCocktail'
						className='group relative bg-transparent text-yellow-400 font-light py-3 md:py-4 px-8 md:px-10 border-2 border-yellow-400/60 transition-all duration-500 hover:border-yellow-400 hover:bg-yellow-400/10 tracking-[0.1em] uppercase text-sm block text-center'
					>
						<span className='relative z-10'>Add a Cocktail</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default JoinCommunityCTA;
