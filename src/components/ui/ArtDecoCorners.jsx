import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Optimized reusable Art Deco Corner Decorations Component
 * Memoized to prevent unnecessary re-renders
 */
const ArtDecoCorners = memo(
	({
		size = 'medium',
		color = 'border-yellow-400',
		className = '',
		animated = false,
	}) => {
		// Memoize size classes to prevent recalculation on every render
		const sizeClasses = useMemo(
			() => ({
				small: 'w-2 h-2',
				medium: 'w-3 h-3',
				large: 'w-4 h-4',
			}),
			[],
		);

		// Memoize corner class computation
		const cornerClass = useMemo(
			() =>
				`absolute ${sizeClasses[size]} ${color} ${
					animated
						? 'group-hover:border-yellow-400 transition-colors duration-500'
						: ''
				} ${className}`,
			[sizeClasses, size, color, animated, className],
		);

		return (
			<>
				<div
					className={`${cornerClass} -top-0.5 -left-0.5 border-l-2 border-t-2`}
				/>
				<div
					className={`${cornerClass} -top-0.5 -right-0.5 border-r-2 border-t-2`}
				/>
				<div
					className={`${cornerClass} -bottom-0.5 -left-0.5 border-l-2 border-b-2`}
				/>
				<div
					className={`${cornerClass} -bottom-0.5 -right-0.5 border-r-2 border-b-2`}
				/>
			</>
		);
	},
);

ArtDecoCorners.displayName = 'ArtDecoCorners';

ArtDecoCorners.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	color: PropTypes.string,
	className: PropTypes.string,
	animated: PropTypes.bool,
};

export default ArtDecoCorners;
