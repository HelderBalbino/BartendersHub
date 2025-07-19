import PropTypes from 'prop-types';

const ArtDecoHeader = ({
	title,
	subtitle,
	emoji,
	size = 'medium',
	className = '',
}) => {
	const sizeClasses = {
		small: {
			title: 'text-2xl md:text-3xl',
			emoji: 'text-4xl md:text-5xl',
		},
		medium: {
			title: 'text-3xl md:text-4xl lg:text-5xl',
			emoji: 'text-6xl md:text-7xl',
		},
		large: {
			title: 'text-4xl md:text-5xl lg:text-6xl',
			emoji: 'text-7xl md:text-8xl',
		},
	};

	return (
		<div className={`text-center mb-12 ${className}`}>
			{/* Decorative Header */}
			<div className='mb-8 md:mb-12'>
				<div className='w-24 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-4'></div>
				{subtitle && (
					<>
						<div className='flex items-center justify-center gap-3 md:gap-4 mb-4'>
							<div className='w-2 h-2 md:w-3 md:h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
							<div className='text-yellow-400 text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] font-light'>
								{subtitle}
							</div>
							<div className='w-2 h-2 md:w-3 md:h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
						</div>
						<div className='w-16 md:w-24 h-0.5 bg-yellow-400 mx-auto'></div>
					</>
				)}
			</div>

			{/* Emoji */}
			{emoji && (
				<div className='flex items-center justify-center mb-6'>
					<div
						className={`${sizeClasses[size].emoji} text-yellow-400 mb-3 filter drop-shadow-lg`}
					>
						{emoji}
					</div>
				</div>
			)}

			{/* Title */}
			<h1
				className={`${sizeClasses[size].title} font-light text-white mb-4 tracking-[0.2em] uppercase`}
			>
				{title}
			</h1>

			{/* Separator */}
			<div className='w-20 h-0.5 bg-yellow-400 mx-auto mb-4'></div>
		</div>
	);
};

ArtDecoHeader.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string,
	emoji: PropTypes.string,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	className: PropTypes.string,
};

export default ArtDecoHeader;
