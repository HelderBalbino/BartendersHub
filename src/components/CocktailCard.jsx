import { useState, memo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import ArtDecoCorners from './ui/ArtDecoCorners';
import apiService from '../services/api';

const CocktailCard = memo(
	({ cocktailData, size = 'medium', onCardClick, className = '' }) => {
		const [isHovered, setIsHovered] = useState(false);
		const queryClient = useQueryClient();
		const [imageError, setImageError] = useState(false);

		// Prefetch function must be declared before handlers that reference it
		const prefetch = useCallback(() => {
			const id = cocktailData?.id || cocktailData?._id;
			if (!id) return;
			queryClient.prefetchQuery({
				queryKey: ['cocktail', id],
				queryFn: () =>
					apiService.getCocktail(id).then((d) => d.data || d),
				staleTime: 5 * 60 * 1000,
			});
		}, [cocktailData, queryClient]);

		// Memoized handlers to prevent unnecessary re-renders
		const handleMouseEnter = useCallback(() => {
			setIsHovered(true);
			prefetch();
		}, [prefetch]);
		const handleMouseLeave = useCallback(() => setIsHovered(false), []);
		const handleImageError = useCallback(() => setImageError(true), []);

		const handleCardClick = useCallback(() => {
			onCardClick?.(cocktailData);
		}, [onCardClick, cocktailData]);

		const getCategoryLabel = useCallback((category) => {
			if (!category) return 'Signature';
			return category.replace(/-/g, ' ');
		}, []);

		const getSizeClasses = useCallback(() => {
			switch (size) {
				case 'small':
					return 'w-full max-w-64 sm:w-72';
				case 'large':
					return 'w-full max-w-80 sm:w-96';
				default:
					return 'w-full max-w-72 sm:w-80';
			}
		}, [size]);

		if (!cocktailData) {
			return null;
		}

		return (
			<div
				className={`${getSizeClasses()} mx-auto bg-black border border-yellow-400 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/30 cursor-pointer group touch-manipulation ${className}`}
				onClick={handleCardClick}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onFocus={prefetch}
				tabIndex={0}
			>
				{/* Optimized corner decorations */}
				<ArtDecoCorners size={size === 'large' ? 'large' : 'medium'} />

				{/* Golden Line Accent */}
				<div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent'></div>

				{/* Image Section with optimized loading */}
				<div className='relative h-48 sm:h-56 overflow-hidden'>
					{!imageError ? (
						<img
							src={cocktailData.image}
							alt={cocktailData.name}
							loading='lazy'
							decoding='async'
							className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110'
							onError={handleImageError}
						/>
					) : (
						<div className='w-full h-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/30 flex items-center justify-center'>
							<span className='text-6xl'>🍸</span>
						</div>
					)}

					{/* Overlay with better performance */}
					<div
						className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
							isHovered ? 'opacity-0' : 'opacity-20'
						}`}
					></div>

					{/* Category Badge */}
					{cocktailData.category && (
						<div className='absolute top-3 left-3 bg-black/60 text-yellow-400 px-3 py-1 text-[10px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-sm border border-yellow-400/30'>
							{getCategoryLabel(cocktailData.category)}
						</div>
					)}

					{/* Action Button with improved animations */}
					<div
						className={`absolute inset-x-0 bottom-0 bg-yellow-400 text-black text-center py-3 font-bold tracking-widest uppercase transition-all duration-300 btn-touch ${
							isHovered
								? 'translate-y-0 opacity-100'
								: 'sm:translate-y-full sm:opacity-0 translate-y-0 opacity-90'
						}`}
					>
						<span className='flex items-center justify-center gap-2'>
							<span className='hidden sm:inline'>
								View Recipe
							</span>
							<span className='sm:hidden text-sm'>
								Tap for Recipe
							</span>
							<span className='text-sm'>👁️</span>
						</span>
					</div>
				</div>

				{/* Content Section */}
				<div className='p-4 sm:p-5'>
					<h3 className='text-yellow-400 text-lg sm:text-xl font-bold mb-2 text-center tracking-wide'>
						{cocktailData.name}
					</h3>

					<p className='text-gray-300 text-sm sm:text-base mb-4 text-center leading-relaxed line-clamp-2'>
						{cocktailData.description}
					</p>

					{/* Metadata with better organization */}
					<div className='grid grid-cols-2 gap-3 text-xs sm:text-sm text-gray-400'>
						<div className='text-center'>
							<span className='block text-yellow-400 font-semibold'>
								Prep Time
							</span>
							<span>{cocktailData.prepTime || 5} min</span>
						</div>
						<div className='text-center'>
							<span className='block text-yellow-400 font-semibold'>
								Category
							</span>
							<span className='capitalize'>
								{getCategoryLabel(cocktailData.category)}
							</span>
						</div>
					</div>

					{/* Tags with improved display */}
					{cocktailData.tags && cocktailData.tags.length > 0 && (
						<div className='mt-4 flex flex-wrap gap-1 justify-center'>
							{cocktailData.tags.slice(0, 3).map((tag, index) => (
								<span
									key={index}
									className='px-2 py-1 bg-yellow-400/10 text-yellow-400 text-xs rounded border border-yellow-400/30'
								>
									{tag}
								</span>
							))}
							{cocktailData.tags.length > 3 && (
								<span className='px-2 py-1 text-gray-400 text-xs'>
									+{cocktailData.tags.length - 3}
								</span>
							)}
						</div>
					)}
				</div>

				{/* Decorative Pattern Overlay */}
				<div className='absolute inset-0 pointer-events-none'>
					<div className='absolute top-8 left-8 w-2 h-2 border border-yellow-400/20 rotate-45'></div>
					<div className='absolute top-12 right-12 w-1 h-1 border border-yellow-400/20 rotate-45'></div>
					<div className='absolute bottom-16 left-16 w-1 h-1 border border-yellow-400/20 rotate-45'></div>
				</div>
			</div>
		);
	},
);

CocktailCard.displayName = 'CocktailCard';

CocktailCard.propTypes = {
	cocktailData: PropTypes.shape({
		name: PropTypes.string.isRequired,
		description: PropTypes.string,
		image: PropTypes.string,
		category: PropTypes.string,
		prepTime: PropTypes.number,
		tags: PropTypes.arrayOf(PropTypes.string),
	}).isRequired,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	onCardClick: PropTypes.func,
	className: PropTypes.string,
};

export default CocktailCard;
