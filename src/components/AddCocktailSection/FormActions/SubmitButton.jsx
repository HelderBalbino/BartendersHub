import PropTypes from 'prop-types';

const SubmitButton = ({
	isLoading = false,
	disabled = false,
	children = 'Submit Recipe',
	emoji = '🍸',
	loadingText = 'Creating...',
	className = '',
}) => {
	return (
		<button
			type='submit'
			disabled={isLoading || disabled}
			className={`group relative bg-yellow-400 text-black font-light py-4 px-12 border-2 border-yellow-400 transition-all duration-500 hover:bg-black hover:text-yellow-400 tracking-[0.15em] uppercase text-sm shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
		>
			{/* Art Deco corners */}
			<div className='absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-400'></div>
			<div className='absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-400'></div>
			<div className='absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-400'></div>
			<div className='absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-400'></div>

			<span className='relative z-10 flex items-center gap-3'>
				{isLoading ? (
					<>
						<div className='w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin'></div>
						<span>{loadingText}</span>
					</>
				) : (
					<>
						<span>{emoji}</span>
						<span>{children}</span>
					</>
				)}
			</span>
		</button>
	);
};

SubmitButton.propTypes = {
	isLoading: PropTypes.bool,
	disabled: PropTypes.bool,
	children: PropTypes.node,
	emoji: PropTypes.string,
	loadingText: PropTypes.string,
	className: PropTypes.string,
};

export default SubmitButton;
