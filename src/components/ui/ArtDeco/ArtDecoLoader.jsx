import PropTypes from 'prop-types';
import LoadingSpinner from '../../LoadingSpinner';

const ArtDecoLoader = ({
	size = 'medium',
	text = 'Loading...',
	emoji = '🍸',
	className = '',
}) => {
	const sizeClasses = {
		small: {
			container: 'p-8',
			emoji: 'text-3xl',
			text: 'text-sm',
		},
		medium: {
			container: 'p-12',
			emoji: 'text-4xl',
			text: 'text-base',
		},
		large: {
			container: 'p-16',
			emoji: 'text-5xl',
			text: 'text-lg',
		},
	};

	return (
		<div
			className={`flex flex-col items-center justify-center text-center ${sizeClasses[size].container} ${className}`}
		>
			<div
				className={`${sizeClasses[size].emoji} text-yellow-400 mb-4 filter drop-shadow-lg animate-pulse`}
			>
				{emoji}
			</div>

			<LoadingSpinner size={size} />

			<p
				className={`text-yellow-400 font-light tracking-wide uppercase mt-4 ${sizeClasses[size].text}`}
			>
				{text}
			</p>

			{/* Decorative elements */}
			<div className='flex items-center justify-center mt-6 gap-2'>
				<div className='w-2 h-2 border border-yellow-400/50 rotate-45 bg-yellow-400/20'></div>
				<div className='w-8 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent'></div>
				<div className='w-2 h-2 border border-yellow-400/50 rotate-45 bg-yellow-400/20'></div>
			</div>
		</div>
	);
};

ArtDecoLoader.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	text: PropTypes.string,
	emoji: PropTypes.string,
	className: PropTypes.string,
};

export default ArtDecoLoader;
