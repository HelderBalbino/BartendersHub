import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ArtDecoButton = ({
	to,
	variant = 'primary',
	children,
	icon,
	className = '',
}) => {
	const baseClasses =
		'group relative w-full max-w-xs sm:max-w-sm md:max-w-md font-light py-4 sm:py-4 md:py-5 px-6 sm:px-8 md:px-12 border transition-all duration-700 tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase text-xs sm:text-sm touch-manipulation btn-touch tap-feedback block text-center';

	const variants = {
		primary:
			'bg-yellow-400 text-black border-yellow-400 sm:border-2 hover:bg-black hover:text-yellow-400 shadow-2xl',
		secondary:
			'bg-yellow-400/10 text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black hover:shadow-2xl',
		outline:
			'bg-transparent text-yellow-400 border border-yellow-400/60 sm:border-2 hover:border-yellow-400 hover:bg-yellow-400/10 hover:shadow-2xl',
		ghost: 'bg-transparent text-yellow-400 border border-yellow-400/30 sm:border-2 hover:border-yellow-400 hover:bg-yellow-400/5 hover:shadow-xl',
	};

	const cornerBorderColors = {
		primary: 'border-yellow-400',
		secondary: 'border-yellow-400',
		outline: 'border-yellow-400/60 group-hover:border-yellow-400',
		ghost: 'border-yellow-400/30 group-hover:border-yellow-400',
	};

	const innerDecoColors = {
		primary: 'border-black group-hover:border-yellow-400',
		secondary: 'border-yellow-400',
		outline: 'border-yellow-400/40 group-hover:border-yellow-400',
		ghost: 'border-yellow-400/20 group-hover:border-yellow-400',
	};

	return (
		<Link
			to={to}
			className={`${baseClasses} ${variants[variant]} ${className}`}
		>
			{/* Enhanced Art Deco corners - Mobile responsive */}
			<div
				className={`absolute -top-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-l border-t sm:border-l-2 sm:border-t-2 ${cornerBorderColors[variant]} transition-colors duration-700`}
			></div>
			<div
				className={`absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-r border-t sm:border-r-2 sm:border-t-2 ${cornerBorderColors[variant]} transition-colors duration-700`}
			></div>
			<div
				className={`absolute -bottom-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-l border-b sm:border-l-2 sm:border-b-2 ${cornerBorderColors[variant]} transition-colors duration-700`}
			></div>
			<div
				className={`absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-r border-b sm:border-r-2 sm:border-b-2 ${cornerBorderColors[variant]} transition-colors duration-700`}
			></div>

			{/* Inner decorative elements - Mobile responsive */}
			<div
				className={`absolute top-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l border-t ${innerDecoColors[variant]} transition-colors duration-700`}
			></div>
			<div
				className={`absolute top-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-r border-t ${innerDecoColors[variant]} transition-colors duration-700`}
			></div>
			<div
				className={`absolute bottom-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l border-b ${innerDecoColors[variant]} transition-colors duration-700`}
			></div>
			<div
				className={`absolute bottom-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 border-r border-b ${innerDecoColors[variant]} transition-colors duration-700`}
			></div>

			<span className='relative z-10 flex items-center justify-center gap-2 sm:gap-3'>
				{icon && <span>{icon}</span>}
				<span>{children}</span>
				{variant === 'primary' && (
					<span className='text-sm sm:text-base md:text-lg group-hover:translate-x-1 transition-transform duration-300'>
						→
					</span>
				)}
			</span>
		</Link>
	);
};

const HeroButtons = () => {
	return (
		<div className='flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8 justify-center items-center mb-10 sm:mb-12 md:mb-16 lg:mb-20 px-4 sm:px-6 pb-40 button-stack-mobile'>
			<ArtDecoButton to='/cocktails' variant='primary'>
				Explore Collection
			</ArtDecoButton>

			<ArtDecoButton to='/login?mode=login' variant='secondary' icon='🔓'>
				Login
			</ArtDecoButton>

			<ArtDecoButton
				to='/login?mode=register'
				variant='outline'
				icon='🚀'
			>
				Join the Hub
			</ArtDecoButton>

			<ArtDecoButton to='/addCocktail' variant='ghost' icon='🍸'>
				Add Your Cocktail
			</ArtDecoButton>
		</div>
	);
};

ArtDecoButton.propTypes = {
	to: PropTypes.string.isRequired,
	variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
	children: PropTypes.node.isRequired,
	icon: PropTypes.string,
	className: PropTypes.string,
};

export default HeroButtons;
