import React from 'react';

/**
 * Reusable Art Deco Background Pattern Component
 * @param {Object} props
 * @param {boolean} props.showGeometricShapes - Show geometric decorative shapes
 * @param {string} props.opacity - Opacity class for the background
 * @param {string} props.className - Additional CSS classes
 */
const ArtDecoBackground = ({
	showGeometricShapes = true,
	opacity = 'opacity-8',
	className = '',
}) => {
	return (
		<div className={`absolute inset-0 ${opacity} ${className}`}>
			{/* Golden gradient overlay */}
			<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/15 via-transparent to-yellow-400/5'></div>

			{showGeometricShapes && (
				<>
					{/* Geometric Art Deco elements - Mobile responsive */}
					<div className='absolute top-4 left-2 sm:top-8 sm:left-4 md:top-16 md:left-16 w-20 sm:w-32 md:w-48 h-20 sm:h-32 md:h-48 border border-yellow-400/25 rotate-45'></div>
					<div className='absolute bottom-4 right-2 sm:bottom-8 sm:right-4 md:bottom-16 md:right-16 w-16 sm:w-24 md:w-40 h-16 sm:h-24 md:h-40 border border-yellow-400/25 rotate-45'></div>
					<div className='absolute top-1/2 left-1 sm:left-2 md:left-8 w-12 sm:w-20 md:w-32 h-12 sm:h-20 md:h-32 border border-yellow-400/20 rotate-45'></div>
					<div className='absolute top-1/4 right-1 sm:right-2 md:right-8 w-14 sm:w-24 md:w-36 h-14 sm:h-24 md:h-36 border border-yellow-400/20 rotate-45'></div>
					<div className='absolute bottom-1/4 left-1/4 w-10 sm:w-16 md:w-28 h-10 sm:h-16 md:h-28 border border-yellow-400/20 rotate-45'></div>
					<div className='absolute top-3/4 right-1/3 w-8 sm:w-12 md:w-24 h-8 sm:h-12 md:h-24 border border-yellow-400/20 rotate-45'></div>
				</>
			)}

			{/* Sophisticated radiating lines pattern - Mobile responsive */}
			<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
				<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent rotate-15'></div>
				<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent rotate-30'></div>
				<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent rotate-45'></div>
				<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent -rotate-15'></div>
				<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent -rotate-30'></div>
				<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent -rotate-45'></div>
			</div>

			{/* Additional decorative elements - Mobile responsive */}
			<div className='absolute top-8 sm:top-12 md:top-20 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 md:w-64 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent'></div>
			<div className='absolute bottom-8 sm:bottom-12 md:bottom-20 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 md:w-64 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent'></div>
		</div>
	);
};

export default ArtDecoBackground;
