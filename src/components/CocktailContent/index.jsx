import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Components
import SectionHeader from './CocktailHeader/SectionHeader';
import CategoryFilter from './CocktailHeader/CategoryFilter';
// import CarouselContainer from './CocktailCarousel/CarouselContainer'; // Replaced by grid view with pagination
import CocktailCard from '../CocktailCard';
import LoadingState from '../ui/States/LoadingState';
import ErrorState from '../ui/States/ErrorState';
import EmptyState from '../ui/States/EmptyState';
import ArtDecoSeparator from '../ui/ArtDeco/ArtDecoSeparator';

// Hooks
import { useCocktails } from '../../hooks/useCocktails';
import { useAuth } from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';

const CocktailContent = () => {
	const navigate = useNavigate();
	const [activeCategory, setActiveCategory] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState('newest');
	const [page, setPage] = useState(1);
	const [cocktailsList, setCocktailsList] = useState([]);
	const debouncedSearch = useDebounce(searchTerm, 400);
	const { user, isAuthenticated } = useAuth();

	// New simplified filters
	const baseCategories = [
		{ id: 'all', name: 'All', emoji: '🍸' },
		{ id: 'classics', name: 'Classics', emoji: '📜' },
	];
	const categories = isAuthenticated
		? [...baseCategories, { id: 'mine', name: 'My Cocktails', emoji: '⭐' }]
		: baseCategories;

	// Fetch cocktails from API
	const {
		data: cocktailsData,
		isLoading,
		isFetching,
		error,
	} = useCocktails({
		category: activeCategory === 'classics' ? 'classics' : undefined,
		createdBy:
			activeCategory === 'mine' && isAuthenticated
				? user?.id || user?._id
				: undefined,
		search: debouncedSearch || undefined,
		sortBy: sortBy !== 'newest' ? sortBy : undefined,
		page,
		limit: 12,
	});

	const currentPageCocktails = useMemo(
		() =>
			cocktailsData?.data ||
			cocktailsData?.cocktails ||
			cocktailsData?.results ||
			[],
		[cocktailsData],
	);

	// Reset list when filters/search/sort change
	useEffect(() => {
		setCocktailsList([]);
		setPage(1);
	}, [activeCategory, debouncedSearch, sortBy]);

	// Append new page cocktails
	useEffect(() => {
		if (currentPageCocktails?.length) {
			setCocktailsList((prev) => {
				// Avoid duplicates when page resets
				const ids = new Set(prev.map((c) => c._id || c.id));
				const fresh = currentPageCocktails.filter(
					(c) => !ids.has(c._id || c.id),
				);
				return [...prev, ...fresh];
			});
		}
	}, [currentPageCocktails, page]);

	const total =
		cocktailsData?.total ?? cocktailsData?.count ?? cocktailsList.length;
	const hasNext = Boolean(
		cocktailsData?.pagination?.hasNext ||
			page <
				(cocktailsData?.pages || cocktailsData?.pagination?.total || 1),
	);

	const loadMore = () => {
		if (hasNext && !isFetching) setPage((p) => p + 1);
	};

	const handleCardClick = (cocktail) => {
		if (!cocktail) return;
		const id = cocktail.id || cocktail._id;
		if (id) navigate(`/cocktails/${id}`);
	};

	const handleRetry = () => {
		window.location.reload();
	};

	const handleShowAll = () => {
		setActiveCategory('all');
		setSearchTerm('');
		setSortBy('newest');
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
					<div className='flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-6'>
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
						<div className='flex items-center gap-3'>
							<label className='text-yellow-400 text-xs tracking-widest uppercase'>
								Sort
							</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className='bg-black/30 border border-yellow-400/30 focus:border-yellow-400 text-white px-3 py-2 text-sm outline-none'
							>
								<option value='newest'>Newest</option>
								<option value='rating'>Top Rated</option>
								<option value='views'>Most Viewed</option>
								<option value='likes'>Most Liked</option>
							</select>
						</div>
						<div className='text-yellow-400 text-sm font-light tracking-wide'>
							{isLoading && page === 1
								? 'Loading...'
								: `${total} result${total === 1 ? '' : 's'}`}
						</div>
					</div>
				</div>

				{/* Loading State */}
				{isLoading && (
					<LoadingState size='large' text='Loading cocktails...' />
				)}

				{/* Cocktails Grid */}
				{cocktailsList.length > 0 && (
					<div className='mt-8 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
						{cocktailsList.map((cocktail) => (
							<CocktailCard
								key={cocktail._id || cocktail.id}
								cocktailData={{
									id: cocktail._id || cocktail.id,
									name: cocktail.name,
									image:
										cocktail.image?.url ||
										cocktail.image ||
										cocktail.imageUrl,
									imageAlt: `${cocktail.name} cocktail`,
									category: cocktail.category,
									prepTime: cocktail.prepTime,
									description: cocktail.description,
									rating: cocktail.averageRating,
									tags: cocktail.tags,
								}}
								onCardClick={handleCardClick}
							/>
						))}
					</div>
				)}

				{/* Load More */}
				{cocktailsList.length > 0 && hasNext && (
					<div className='mt-10 flex justify-center'>
						<button
							onClick={loadMore}
							disabled={isFetching}
							className='px-8 py-3 border border-yellow-400/50 text-yellow-400 uppercase tracking-wider text-sm hover:bg-yellow-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{isFetching ? 'Loading...' : 'Load More'}
						</button>
					</div>
				)}

				{/* Empty State */}
				{!isLoading && cocktailsList.length === 0 && (
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
