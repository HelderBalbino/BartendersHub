import React from 'react';
import ArtDecoCorners from './ArtDecoCorners';

/**
 * Reusable Art Deco Button with consistent styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - 'primary' | 'secondary' | 'ghost'
 * @param {string} props.size - 'small' | 'medium' | 'large'
 * @param {boolean} props.fullWidth - Whether button should be full width
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.type - Button type (button, submit, etc.)
 */
const ArtDecoButton = ({
	children,
	variant = 'primary',
	size = 'medium',
	fullWidth = false,
	className = '',
	onClick,
	disabled = false,
	type = 'button',
	...props
}) => {
	const baseClasses =
		'group relative font-light transition-all duration-700 tracking-[0.1em] uppercase touch-manipulation btn-touch tap-feedback focus-mobile';

	const variantClasses = {
		primary:
			'bg-yellow-400 text-black border border-yellow-400 hover:bg-black hover:text-yellow-400',
		secondary:
			'bg-transparent text-yellow-400 border border-yellow-400/60 hover:border-yellow-400 hover:bg-yellow-400/10',
		ghost: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-black',
	};

	const sizeClasses = {
		small: 'py-2 px-4 text-xs',
		medium: 'py-3 px-6 text-sm',
		large: 'py-4 px-8 text-sm',
	};

	const widthClass = fullWidth ? 'w-full' : '';

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
			{...props}
		>
			{/* Art Deco corners */}
			<ArtDecoCorners
				size={size === 'large' ? 'large' : 'medium'}
				color={
					variant === 'primary'
						? 'border-yellow-400'
						: 'border-yellow-400/60 group-hover:border-yellow-400'
				}
				animated={true}
			/>

			{/* Button content */}
			<span className='relative z-10'>{children}</span>
		</button>
	);
};

export default ArtDecoButton;
