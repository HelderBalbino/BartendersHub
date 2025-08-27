import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import CocktailDetailSkeleton from '../components/ui/Skeletons/CocktailDetailSkeleton';
import {
	useCocktail,
	useToggleLike,
	useAddComment,
	useFavoriteCocktail,
} from '../hooks/useCocktails';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const CocktailDetailPage = () => {
	const { id } = useParams();
	const { data, isLoading, error } = useCocktail(id);
	const { user, isAuthenticated } = useAuth();
	const { toggleFavorite } = useFavoriteCocktail();
	const likeMutation = useToggleLike();
	const [commentText, setCommentText] = useState('');
	const addCommentMutation = useAddComment(id);
	const cocktail = data?.data || data; // backend returns { success, data }

	useEffect(() => {
		if (cocktail?.data?.name) {
			document.title = `${cocktail.data.name} | BartendersHub`;
			const meta = document.querySelector('meta[name="description"]');
			const desc =
				cocktail.data.description?.slice(0, 155) ||
				'Cocktail recipe on BartendersHub';
			if (meta) meta.setAttribute('content', desc);
			else {
				const m = document.createElement('meta');
				m.name = 'description';
				m.content = desc;
				document.head.appendChild(m);
			}
		}
	}, [cocktail]);

	if (isLoading) return <CocktailDetailSkeleton />;

	if (error || !cocktail) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-black via-gray-900 to-black px-4'>
				<h1 className='text-3xl font-bold text-yellow-400 mb-4'>
					Cocktail Not Found
				</h1>
				<p className='text-gray-400 mb-6'>
					The cocktail you are looking for does not exist or was
					removed.
				</p>
				<Link
					to='/cocktails'
					className='text-yellow-400 hover:underline'
				>
					Back to Cocktails
				</Link>
			</div>
		);
	}

	const ingredientList = cocktail.ingredients || [];
	const instructions = cocktail.instructions || [];
	const isLiked = cocktail.likes?.some(
		(l) => (l.user?._id || l.user) === (user?.id || user?._id),
	);
	const isFavorite = cocktail.isFavorite; // backend may embed; else compute from user favorites query on future enhancement

	const handleToggleLike = () => {
		if (!isAuthenticated) return toast.error('Login required');
		likeMutation.mutate(cocktail._id || cocktail.id);
	};

	const handleToggleFavorite = () => {
		if (!isAuthenticated) return toast.error('Login required');
		toggleFavorite.mutate({
			cocktailId: cocktail._id || cocktail.id,
			isFavorite,
		});
	};

	const handleAddComment = (e) => {
		e.preventDefault();
		if (!isAuthenticated) return toast.error('Login required');
		if (!commentText.trim()) return;
		addCommentMutation.mutate(commentText.trim(), {
			onSuccess: () => {
				setCommentText('');
				toast.success('Comment added');
			},
		});
	};

	return (
		<section className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-16 px-4'>
			<div className='max-w-5xl mx-auto'>
				<Link
					to='/cocktails'
					className='text-yellow-400 hover:underline text-sm tracking-wider'
				>
					← Back to Cocktails
				</Link>
				<div className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10'>
					<div className='relative border border-yellow-500/30 p-4'>
						<img
							src={
								cocktail.image?.url ||
								cocktail.image ||
								'/placeholder-cocktail.jpg'
							}
							alt={cocktail.name}
							className='w-full h-96 object-cover'
						/>
						<div className='absolute inset-0 pointer-events-none border border-yellow-500/20 m-2'></div>
					</div>
					<div>
						<h1 className='text-4xl font-bold text-yellow-400 mb-4 tracking-wide'>
							{cocktail.name}
						</h1>
						{cocktail.description && (
							<p className='text-gray-300 leading-relaxed mb-6'>
								{cocktail.description}
							</p>
						)}
						<div className='grid grid-cols-2 gap-6 mb-8 text-sm'>
							<div>
								<span className='block text-yellow-400 uppercase tracking-widest text-xs mb-1'>
									Category
								</span>
								<p className='text-gray-200 capitalize'>
									{cocktail.category || 'Signature'}
								</p>
							</div>
							<div>
								<span className='block text-yellow-400 uppercase tracking-widest text-xs mb-1'>
									Prep Time
								</span>
								<p className='text-gray-200'>
									{cocktail.prepTime || 5} min
								</p>
							</div>
							<div>
								<span className='block text-yellow-400 uppercase tracking-widest text-xs mb-1'>
									Views
								</span>
								<p className='text-gray-200'>
									{cocktail.views || 0}
								</p>
							</div>
							<div>
								<span className='block text-yellow-400 uppercase tracking-widest text-xs mb-1'>
									Rating
								</span>
								<p className='text-gray-200'>
									{cocktail.averageRating?.toFixed?.(1) ||
										'N/A'}
								</p>
							</div>
						</div>
						<div className='flex gap-4 mb-6'>
							<button
								onClick={handleToggleLike}
								disabled={likeMutation.isLoading}
								className='px-4 py-2 border border-yellow-500/40 text-yellow-400 text-sm uppercase tracking-wider hover:bg-yellow-500/10 transition disabled:opacity-50'
							>
								{likeMutation.isLoading
									? '...'
									: isLiked
									? 'Unlike'
									: 'Like'}{' '}
								{cocktail.likesCount != null
									? `(${cocktail.likesCount})`
									: ''}
							</button>
							<button
								onClick={handleToggleFavorite}
								disabled={
									toggleFavorite.isPending ||
									toggleFavorite.isLoading
								}
								className='px-4 py-2 border border-yellow-500/40 text-yellow-400 text-sm uppercase tracking-wider hover:bg-yellow-500/10 transition disabled:opacity-50'
							>
								{toggleFavorite.isLoading
									? '...'
									: isFavorite
									? 'Unfavorite'
									: 'Favorite'}
							</button>
						</div>
						{ingredientList.length > 0 && (
							<div className='mb-8'>
								<h2 className='text-2xl font-semibold text-yellow-400 mb-3 tracking-wide'>
									Ingredients
								</h2>
								<ul className='list-disc list-inside space-y-1 text-gray-300 text-sm'>
									{ingredientList.map((ing, idx) => (
										<li key={idx}>
											{typeof ing === 'string'
												? ing
												: ing.text ||
												  `${ing.amount || ''} ${
														ing.unit || ''
												  } ${ing.name || ''}`}
										</li>
									))}
								</ul>
							</div>
						)}
						{instructions.length > 0 && (
							<div className='mb-8'>
								<h2 className='text-2xl font-semibold text-yellow-400 mb-3 tracking-wide'>
									Instructions
								</h2>
								<ol className='list-decimal list-inside space-y-2 text-gray-300 text-sm'>
									{instructions.map((step, idx) => (
										<li key={idx}>
											{typeof step === 'string'
												? step
												: step.text}
										</li>
									))}
								</ol>
							</div>
						)}
						{cocktail.tags?.length > 0 && (
							<div className='mb-6 flex flex-wrap gap-2'>
								{cocktail.tags.map((tag) => (
									<span
										key={tag}
										className='px-2 py-1 bg-yellow-400/10 text-yellow-400 text-xs border border-yellow-400/30'
									>
										{tag}
									</span>
								))}
							</div>
						)}
						{/* Comments Section */}
						<div className='mt-10'>
							<h2 className='text-2xl font-semibold text-yellow-400 mb-4 tracking-wide'>
								Comments
							</h2>
							{cocktail.comments?.length ? (
								<ul className='space-y-4 mb-6'>
									{cocktail.comments.map((c) => (
										<li
											key={c._id}
											className='border border-yellow-500/20 p-3'
										>
											<div className='flex items-center gap-3 mb-1'>
												<img
													src={
														c.user?.avatar ||
														'/default-avatar.jpg'
													}
													alt={c.user?.name}
													className='w-8 h-8 rounded-full object-cover'
												/>
												<span className='text-yellow-400 text-sm font-semibold'>
													@
													{c.user?.username || 'user'}
												</span>
												<span className='text-gray-500 text-xs'>
													{new Date(
														c.createdAt ||
															Date.now(),
													).toLocaleDateString()}
												</span>
											</div>
											<p className='text-gray-300 text-sm leading-relaxed whitespace-pre-line'>
												{c.text}
											</p>
										</li>
									))}
								</ul>
							) : (
								<p className='text-gray-500 text-sm mb-6'>
									No comments yet.
								</p>
							)}
							<form
								onSubmit={handleAddComment}
								className='space-y-3'
							>
								<textarea
									value={commentText}
									onChange={(e) =>
										setCommentText(e.target.value)
									}
									placeholder={
										isAuthenticated
											? 'Add a comment...'
											: 'Login to comment'
									}
									className='w-full bg-black/40 border border-yellow-500/30 focus:border-yellow-500 outline-none text-sm text-white p-3 min-h-24 resize-vertical'
									disabled={
										!isAuthenticated ||
										addCommentMutation.isLoading
									}
								/>
								<div>
									<button
										type='submit'
										disabled={
											!isAuthenticated ||
											addCommentMutation.isLoading ||
											!commentText.trim()
										}
										className='px-5 py-2 border border-yellow-500/40 text-yellow-400 uppercase tracking-wider text-xs hover:bg-yellow-500/10 transition disabled:opacity-50'
									>
										{addCommentMutation.isLoading
											? 'Posting...'
											: 'Post Comment'}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CocktailDetailPage;
