import { useState } from 'react';
import PropTypes from 'prop-types';

// Components
import SectionHeader from './CocktailHeader/SectionHeader';
import CategoryFilter from './CocktailHeader/CategoryFilter';
import CarouselContainer from './CocktailCarousel/CarouselContainer';
import LoadingState from '../ui/States/LoadingState';
import ErrorState from '../ui/States/ErrorState';
import EmptyState from '../ui/States/EmptyState';
import ArtDecoSeparator from '../ui/ArtDeco/ArtDecoSeparator';

// Hooks
import { useCocktails } from '../../hooks/useCocktails';

const CocktailContent = () => {
	const [activeCategory, setActiveCategory] = useState('all');

	// Categories for filtering
	const categories = [
		{ id: 'all', name: 'All Cocktails', emoji: '🍸' },
		{ id: 'beginner', name: 'Beginner', emoji: '🟢' },
		{ id: 'intermediate', name: 'Intermediate', emoji: '🟡' },
		{ id: 'advanced', name: 'Advanced', emoji: '🟠' },
		{ id: 'expert', name: 'Expert', emoji: '🔴' },
	];

	// Fetch cocktails from API
	const {
		data: cocktailsData,
		isLoading,
		error,
	} = useCocktails({
		difficulty: activeCategory !== 'all' ? activeCategory : undefined,
		limit: 12,
	});

	const cocktails = cocktailsData?.cocktails || [];

	const handleCategoryChange = (category) => {
		setActiveCategory(category);
	};

	const handleCardClick = (cocktail) => {
		// Navigate to cocktail detail page or show modal
		console.log('Cocktail clicked:', cocktail);
		// TODO: Implement navigation to detail page
	};

	const handleRetry = () => {
		window.location.reload();
	};

	const handleShowAll = () => {
		setActiveCategory('all');
	};

	if (error) {
		return (
			<ErrorState
				title='Failed to Load Cocktails'
				message={
					error?.message ||
					'Something went wrong while fetching cocktails.'
				}
				onRetry={handleRetry}
				fullScreen
			/>
		);
	}

	return (
		<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-20'>
			{/* Background Elements */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute top-20 left-10 w-40 h-40 border border-yellow-400/30 rotate-45'></div>
				<div className='absolute bottom-20 right-10 w-32 h-32 border border-yellow-400/30 rotate-45'></div>
				<div className='absolute top-1/2 left-1/4 w-24 h-24 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/3 right-1/4 w-28 h-28 border border-yellow-400/20 rotate-45'></div>
			</div>

			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Header */}
				<SectionHeader />

				{/* Category Filter */}
				<CategoryFilter
					categories={categories}
					activeCategory={activeCategory}
					onCategoryChange={handleCategoryChange}
				/>

				{/* Loading State */}
				{isLoading && (
					<LoadingState size='large' text='Loading cocktails...' />
				)}

				{/* Cocktails Carousel */}
				{!isLoading && cocktails.length > 0 && (
					<CarouselContainer
						cocktails={cocktails}
						onCardClick={handleCardClick}
					/>
				)}

				{/* Empty State */}
				{!isLoading && cocktails.length === 0 && (
					<EmptyState
						title='No Cocktails Found'
						message={
							activeCategory === 'all'
								? 'No cocktails available at the moment.'
								: `No ${activeCategory} cocktails found. Try a different category.`
						}
						actionText={
							activeCategory !== 'all'
								? 'Show All Cocktails'
								: undefined
						}
						onAction={
							activeCategory !== 'all' ? handleShowAll : undefined
						}
					/>
				)}

				{/* Call to Action */}
				<div className='text-center mt-16'>
					<ArtDecoSeparator variant='diamond' className='mb-8' />
					<h3 className='text-xl md:text-2xl font-light text-white mb-4 tracking-wide uppercase'>
						Ready to Share Your Creation?
					</h3>
					<p className='text-gray-400 mb-8 max-w-md mx-auto'>
						Join our community of mixologists and share your
						signature cocktails
					</p>
				</div>
			</div>
		</section>
	);
};

CocktailContent.propTypes = {};

export default CocktailContent;
