import { useState } from 'react';

const CocktailCard = ({
	cocktail,
	size = 'medium',
	onCardClick,
	className = '',
}) => {
	const [imageError, setImageError] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	// Default cocktail structure if not provided
	const defaultCocktail = {
		id: 1,
		name: 'Classic Martini',
		image: 'src/assets/images/cocktailsImages/dirtyMartini.png',
		imageAlt: 'Classic Martini with olives',
		difficulty: 'Intermediate',
		prepTime: '3 min',
		description: 'The quintessential gin cocktail, crisp and clean',
		rating: 4.8,
	};

	const cocktailData = cocktail || defaultCocktail;

	const getDifficultyIcon = (difficulty) => {
		switch (difficulty) {
			case 'Beginner':
				return '◆';
			case 'Intermediate':
				return '◆◆';
			case 'Advanced':
				return '◆◆◆';
			case 'Expert':
				return '◆◆◆◆';
			default:
				return '◆';
		}
	};

	const getSizeClasses = () => {
		switch (size) {
			case 'small':
				return 'w-72';
			case 'large':
				return 'w-96';
			default:
				return 'w-80';
		}
	};

	return (
		<div
			className={`${getSizeClasses()} mx-auto bg-black border border-yellow-400 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/30 cursor-pointer group ${className}`}
			onClick={() => onCardClick && onCardClick(cocktailData)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Art Deco Corner Decorations */}
			<div className='absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-yellow-400'></div>
			<div className='absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-yellow-400'></div>
			<div className='absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-yellow-400'></div>
			<div className='absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-yellow-400'></div>

			{/* Golden Line Accent */}
			<div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent'></div>

			{/* Image Section */}
			<div className='relative h-56 overflow-hidden'>
				{!imageError ? (
					<img
						src={cocktailData.image}
						alt={cocktailData.imageAlt || cocktailData.name}
						className={`w-full h-full object-cover transition-all duration-700 ${
							isHovered
								? 'scale-110 opacity-90'
								: 'scale-100 opacity-100'
						}`}
						onError={() => setImageError(true)}
					/>
				) : (
					<div className='w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center'>
						<div className='text-center'>
							<div className='text-6xl text-yellow-400 mb-2'>
								🍸
							</div>
							<div className='text-yellow-400 text-sm font-light tracking-wider'>
								NO IMAGE
							</div>
						</div>
					</div>
				)}

				{/* Elegant Overlay */}
				<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent'></div>

				{/* Rating Badge */}
				<div className='absolute top-4 right-4'>
					<div className='bg-black/70 backdrop-blur-sm border border-yellow-400/50 px-3 py-1'>
						<div className='flex items-center gap-1'>
							<span className='text-yellow-400 text-sm'>★</span>
							<span className='text-white text-sm font-light'>
								{cocktailData.rating}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className='p-6 bg-black relative'>
				{/* Decorative Line */}
				<div className='w-12 h-0.5 bg-yellow-400 mb-4 mx-auto'></div>

				{/* Title */}
				<h3 className='text-center text-white text-xl font-light tracking-widest mb-2 uppercase'>
					{cocktailData.name}
				</h3>

				{/* Difficulty Diamonds */}
				<div className='text-center mb-4'>
					<span className='text-yellow-400 text-lg tracking-wider'>
						{getDifficultyIcon(cocktailData.difficulty)}
					</span>
				</div>

				{/* Description */}
				<p className='text-gray-400 text-center text-sm font-light leading-relaxed mb-6 italic'>
					"{cocktailData.description}"
				</p>

				{/* Bottom Info */}
				<div className='flex justify-between items-center pt-4 border-t border-yellow-400/30'>
					<div className='text-center'>
						<div className='text-yellow-400 text-xs uppercase tracking-wide'>
							Time
						</div>
						<div className='text-white text-sm font-light'>
							{cocktailData.prepTime}
						</div>
					</div>

					<div className='w-px h-8 bg-yellow-400/30'></div>

					<div className='text-center'>
						<div className='text-yellow-400 text-xs uppercase tracking-wide'>
							Level
						</div>
						<div className='text-white text-sm font-light'>
							{cocktailData.difficulty}
						</div>
					</div>
				</div>

				{/* Hover Effect - View Recipe Button */}
				<div
					className={`absolute inset-x-0 bottom-0 bg-yellow-400 text-black text-center py-3 font-bold tracking-widest uppercase transition-all duration-300 ${
						isHovered
							? 'translate-y-0 opacity-100'
							: 'translate-y-full opacity-0'
					}`}
				>
					View Recipe
				</div>
			</div>

			{/* Art Deco Pattern Overlay */}
			<div className='absolute inset-0 pointer-events-none'>
				<div className='absolute top-8 left-8 w-2 h-2 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-8 right-8 w-2 h-2 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-20 left-8 w-2 h-2 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-20 right-8 w-2 h-2 border border-yellow-400/20 rotate-45'></div>
			</div>
		</div>
	);
};

export default CocktailCard;
