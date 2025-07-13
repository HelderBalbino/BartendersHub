import React from 'react';

/**
 * Reusable Art Deco Corner Decorations Component
 * @param {Object} props
 * @param {string} props.size - 'small' | 'medium' | 'large'
 * @param {string} props.color - CSS color class (default: 'border-yellow-400')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.animated - Whether to include hover animations
 */
const ArtDecoCorners = ({
	size = 'medium',
	color = 'border-yellow-400',
	className = '',
	animated = false,
}) => {
	const sizeClasses = {
		small: 'w-2 h-2',
		medium: 'w-3 h-3',
		large: 'w-4 h-4',
	};

	const cornerClass = `absolute ${sizeClasses[size]} ${color} ${
		animated
			? 'group-hover:border-yellow-400 transition-colors duration-500'
			: ''
	} ${className}`;

	return (
		<>
			<div
				className={`${cornerClass} top-0 left-0 border-l border-t`}
			></div>
			<div
				className={`${cornerClass} top-0 right-0 border-r border-t`}
			></div>
			<div
				className={`${cornerClass} bottom-0 left-0 border-l border-b`}
			></div>
			<div
				className={`${cornerClass} bottom-0 right-0 border-r border-b`}
			></div>
		</>
	);
};

export default ArtDecoCorners;
