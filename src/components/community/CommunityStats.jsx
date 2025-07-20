import PropTypes from 'prop-types';

const CommunityStats = ({ stats }) => {
	return (
		<div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-16'>
			{stats.map((stat, index) => (
				<div
					key={index}
					className='relative bg-black/30 border border-yellow-400/30 p-4 md:p-6 backdrop-blur-sm text-center group hover:border-yellow-400/60 transition-all duration-300'
				>
					{/* Small Art Deco corners */}
					<div className='absolute top-0 left-0 w-2 h-2 border-l border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-300'></div>
					<div className='absolute top-0 right-0 w-2 h-2 border-r border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-300'></div>
					<div className='absolute bottom-0 left-0 w-2 h-2 border-l border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-300'></div>
					<div className='absolute bottom-0 right-0 w-2 h-2 border-r border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-300'></div>

					<div className='text-2xl md:text-3xl font-light text-yellow-400 mb-2'>
						{stat.value}
					</div>
					<div className='text-xs md:text-sm text-gray-300 uppercase tracking-wide'>
						{stat.label}
					</div>
				</div>
			))}
		</div>
	);
};

CommunityStats.propTypes = {
	stats: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
				.isRequired,
			label: PropTypes.string.isRequired,
		}),
	).isRequired,
};

export default CommunityStats;
