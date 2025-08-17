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
import { useAuth } from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';

const CocktailContent = () => {
	const [activeCategory, setActiveCategory] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearch = useDebounce(searchTerm, 400);
	const { user, isAuthenticated } = useAuth();

	// New simplified filters
	const baseCategories = [
		{ id: 'all', name: 'All', emoji: '🍸' },
		{ id: 'classics', name: 'Classics', emoji: '�' },
	];
	const categories = isAuthenticated
		? [...baseCategories, { id: 'mine', name: 'My Cocktails', emoji: '⭐' }]
		: baseCategories;

	// Fetch cocktails from API
	const {
		data: cocktailsData,
		isLoading,
		error,
	} = useCocktails({
		category: activeCategory === 'classics' ? 'classics' : undefined,
		createdBy:
			activeCategory === 'mine' && isAuthenticated
				? user?.id || user?._id
				: undefined,
		search: debouncedSearch || undefined,
		limit: 12,
	});

	const cocktails = cocktailsData?.cocktails || [];

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
		setSearchTerm('');
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleClearSearch = () => setSearchTerm('');

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

				{/* Filters & Search */}
				<div className='space-y-6'>
					<CategoryFilter
						categories={categories}
						activeCategory={activeCategory}
						onCategoryChange={(id) => {
							setActiveCategory(id);
						}}
					/>
					<div className='flex justify-center'>
						<div className='relative w-full max-w-md'>
							<input
								type='text'
								value={searchTerm}
								onChange={handleSearchChange}
								placeholder='Search cocktails...'
								className='w-full bg-black/30 border border-yellow-400/30 focus:border-yellow-400 text-white px-4 py-3 pr-10 placeholder-gray-500 outline-none transition-colors'
							/>
							{searchTerm && (
								<button
									type='button'
									onClick={handleClearSearch}
									className='absolute top-1/2 right-3 -translate-y-1/2 text-yellow-400 hover:text-white transition-colors'
								>
									×
								</button>
							)}
						</div>
					</div>
				</div>

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
						message={(() => {
							if (searchTerm)
								return 'No cocktails match your search.';
							if (activeCategory === 'classics')
								return 'No classic cocktails found.';
							if (activeCategory === 'mine')
								return 'You have not added any cocktails yet.';
							return 'No cocktails available at the moment.';
						})()}
						actionText={
							activeCategory !== 'all' || searchTerm
								? 'Show All Cocktails'
								: undefined
						}
						onAction={
							activeCategory !== 'all' || searchTerm
								? handleShowAll
								: undefined
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
						cocktails
					</p>
				</div>
			</div>
		</section>
	);
};

CocktailContent.propTypes = {};

export default CocktailContent;
