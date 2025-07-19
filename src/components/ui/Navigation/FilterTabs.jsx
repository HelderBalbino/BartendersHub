import PropTypes from 'prop-types';

const FilterTabs = ({ filters, activeFilter, onChange, className = '' }) => {
	return (
		<div
			className={`flex flex-wrap justify-center gap-4 mb-12 ${className}`}
		>
			{filters.map((filter) => (
				<button
					key={filter.id}
					onClick={() => onChange(filter.id)}
					className={`px-6 py-3 text-sm font-light tracking-wide uppercase transition-all duration-300 border ${
						activeFilter === filter.id
							? 'bg-yellow-400 text-black border-yellow-400'
							: 'bg-transparent text-yellow-400 border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10'
					}`}
				>
					{filter.emoji && (
						<span className='mr-2'>{filter.emoji}</span>
					)}
					{filter.name}
					{filter.count !== undefined && (
						<span className='ml-2 text-xs opacity-75'>
							({filter.count})
						</span>
					)}
				</button>
			))}
		</div>
	);
};

FilterTabs.propTypes = {
	filters: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			emoji: PropTypes.string,
			count: PropTypes.number,
		}),
	).isRequired,
	activeFilter: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
};

export default FilterTabs;
