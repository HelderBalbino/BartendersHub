import PropTypes from 'prop-types';

const EmptyState = ({
	title = 'No items found',
	message = 'There are no items to display',
	actionText,
	onAction,
	emoji = '🍸',
	className = '',
}) => {
	return (
		<div className={`text-center py-20 ${className}`}>
			<div className='text-6xl text-gray-600 mb-6'>{emoji}</div>
			<h3 className='text-2xl text-white font-light tracking-wide uppercase mb-4'>
				{title}
			</h3>
			<p className='text-gray-400 mb-8'>{message}</p>
			{actionText && onAction && (
				<button
					onClick={onAction}
					className='bg-yellow-400 text-black px-6 py-3 border border-yellow-400 hover:bg-black hover:text-yellow-400 transition-all duration-300 tracking-wide uppercase text-sm'
				>
					{actionText}
				</button>
			)}
		</div>
	);
};

EmptyState.propTypes = {
	title: PropTypes.string,
	message: PropTypes.string,
	actionText: PropTypes.string,
	onAction: PropTypes.func,
	emoji: PropTypes.string,
	className: PropTypes.string,
};

export default EmptyState;
