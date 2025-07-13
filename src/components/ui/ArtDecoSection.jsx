import React from 'react';
import ArtDecoBackground from './ArtDecoBackground';

/**
 * Reusable Section Wrapper with consistent Art Deco styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fullHeight - Whether to use min-h-screen
 * @param {boolean} props.showBackground - Whether to show Art Deco background
 * @param {string} props.backgroundOpacity - Background opacity class
 * @param {string} props.padding - Padding classes
 */
const ArtDecoSection = ({
	children,
	className = '',
	fullHeight = true,
	showBackground = true,
	backgroundOpacity = 'opacity-8',
	padding = 'py-16 md:py-20',
}) => {
	const heightClass = fullHeight ? 'min-h-screen' : '';

	return (
		<section
			className={`relative ${heightClass} bg-gradient-to-br from-black via-gray-900 to-black ${padding} overflow-hidden ${className}`}
		>
			{showBackground && (
				<ArtDecoBackground
					opacity={backgroundOpacity}
					showGeometricShapes={true}
				/>
			)}

			{/* Content with proper z-index */}
			<div className='relative z-10'>{children}</div>
		</section>
	);
};

export default ArtDecoSection;
