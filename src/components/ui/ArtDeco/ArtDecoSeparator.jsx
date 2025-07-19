import PropTypes from 'prop-types';

const ArtDecoSeparator = ({
	variant = 'simple',
	size = 'medium',
	className = '',
}) => {
	const sizeClasses = {
		small: 'w-8 md:w-12',
		medium: 'w-16 md:w-24',
		large: 'w-24 md:w-32',
	};

	if (variant === 'simple') {
		return (
			<div
				className={`${sizeClasses[size]} h-0.5 bg-yellow-400 mx-auto ${className}`}
			></div>
		);
	}

	if (variant === 'gradient') {
		return (
			<div
				className={`${sizeClasses[size]} h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto ${className}`}
			></div>
		);
	}

	if (variant === 'diamond') {
		return (
			<div className={`flex items-center justify-center ${className}`}>
				<div
					className={`${sizeClasses[size]} h-0.5 bg-gradient-to-r from-transparent to-yellow-400`}
				></div>
				<div className='w-3 h-3 border border-yellow-400 rotate-45 bg-yellow-400/20 mx-4'></div>
				<div
					className={`${sizeClasses[size]} h-0.5 bg-gradient-to-l from-transparent to-yellow-400`}
				></div>
			</div>
		);
	}

	if (variant === 'complex') {
		return (
			<div
				className={`flex items-center justify-center gap-3 md:gap-4 ${className}`}
			>
				<div className='w-2 h-2 md:w-3 md:h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
				<div
					className={`${sizeClasses[size]} h-0.5 bg-yellow-400`}
				></div>
				<div className='w-2 h-2 md:w-3 md:h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
			</div>
		);
	}

	return null;
};

ArtDecoSeparator.propTypes = {
	variant: PropTypes.oneOf(['simple', 'gradient', 'diamond', 'complex']),
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	className: PropTypes.string,
};

export default ArtDecoSeparator;
