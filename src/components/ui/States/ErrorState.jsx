import PropTypes from 'prop-types';

const ErrorState = ({
	title = 'Something went wrong',
	message = 'Please try again later',
	onRetry,
	retryText = 'Try Again',
	emoji = '⚠️',
	fullScreen = false,
	className = '',
}) => {
	const containerClasses = fullScreen
		? 'relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black'
		: 'section';

	return (
		<section className={`${containerClasses} py-20 ${className}`}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
				<div className='text-6xl text-red-400 mb-6'>{emoji}</div>
				<h2 className='text-2xl text-white font-light tracking-wide uppercase mb-4'>
					{title}
				</h2>
				<p className='text-gray-400 mb-8'>{message}</p>
				{onRetry && (
					<button
						onClick={onRetry}
						className='bg-yellow-400 text-black px-6 py-3 border border-yellow-400 hover:bg-black hover:text-yellow-400 transition-all duration-300 tracking-wide uppercase text-sm'
					>
						{retryText}
					</button>
				)}
			</div>
		</section>
	);
};

ErrorState.propTypes = {
	title: PropTypes.string,
	message: PropTypes.string,
	onRetry: PropTypes.func,
	retryText: PropTypes.string,
	emoji: PropTypes.string,
	fullScreen: PropTypes.bool,
	className: PropTypes.string,
};

export default ErrorState;
