import PropTypes from 'prop-types';

const ArtDecoCard = ({
	children,
	className = '',
	variant = 'default',
	showCorners = true,
}) => {
	const variantClasses = {
		default: 'border border-yellow-400/30 bg-black/20 backdrop-blur-sm',
		solid: 'border border-yellow-400/30 bg-black/40',
		transparent: 'border border-yellow-400/20 bg-transparent',
		highlighted:
			'border border-yellow-400 bg-yellow-400/5 backdrop-blur-sm',
	};

	return (
		<div className={`relative ${variantClasses[variant]} ${className}`}>
			{/* Art Deco corner decorations */}
			{showCorners && (
				<>
					<div className='absolute -top-1 -left-1 w-8 h-8 border-l-2 border-t-2 border-yellow-400'></div>
					<div className='absolute -top-1 -right-1 w-8 h-8 border-r-2 border-t-2 border-yellow-400'></div>
					<div className='absolute -bottom-1 -left-1 w-8 h-8 border-l-2 border-b-2 border-yellow-400'></div>
					<div className='absolute -bottom-1 -right-1 w-8 h-8 border-r-2 border-b-2 border-yellow-400'></div>
				</>
			)}

			{children}
		</div>
	);
};

ArtDecoCard.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	variant: PropTypes.oneOf([
		'default',
		'solid',
		'transparent',
		'highlighted',
	]),
	showCorners: PropTypes.bool,
};

export default ArtDecoCard;
