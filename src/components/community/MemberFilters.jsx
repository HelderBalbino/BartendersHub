import PropTypes from 'prop-types';

const MemberFilters = ({ filters, activeFilter, onFilterChange }) => {
	return (
		<div className='mb-8 md:mb-12'>
			<div className='flex flex-wrap justify-center gap-2 md:gap-4'>
				{filters.map((filter) => (
					<button
						key={filter.key}
						onClick={() => onFilterChange(filter.key)}
						className={`group relative px-4 md:px-6 py-2 md:py-3 border transition-all duration-300 tracking-[0.1em] uppercase text-xs md:text-sm font-light ${
							activeFilter === filter.key
								? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
								: 'border-yellow-400/30 text-gray-300 hover:border-yellow-400/60 hover:text-yellow-400'
						}`}
					>
						{/* Small Art Deco corners for active filter */}
						{activeFilter === filter.key && (
							<>
								<div className='absolute top-0 left-0 w-2 h-2 border-l border-t border-yellow-400'></div>
								<div className='absolute top-0 right-0 w-2 h-2 border-r border-t border-yellow-400'></div>
								<div className='absolute bottom-0 left-0 w-2 h-2 border-l border-b border-yellow-400'></div>
								<div className='absolute bottom-0 right-0 w-2 h-2 border-r border-b border-yellow-400'></div>
							</>
						)}

						<span className='relative z-10'>
							{filter.label}{' '}
							<span className='text-yellow-400/70'>
								({filter.count})
							</span>
						</span>
					</button>
				))}
			</div>
		</div>
	);
};

MemberFilters.propTypes = {
	filters: PropTypes.arrayOf(
		PropTypes.shape({
			key: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			count: PropTypes.number.isRequired,
		}),
	).isRequired,
	activeFilter: PropTypes.string.isRequired,
	onFilterChange: PropTypes.func.isRequired,
};

export default MemberFilters;
