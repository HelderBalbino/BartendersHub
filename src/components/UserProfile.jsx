import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
	useUserProfileById,
	useUserCocktails,
	useUserFavorites,
	useUserFollowers,
	useUserFollowing,
} from '../hooks/useProfile';
import { useFollowUser } from '../hooks/useCommunity';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import CocktailCard from './CocktailCard';
import ArtDecoSection from './ui/ArtDecoSection';
import ArtDecoButton from './ui/ArtDecoButton';

const UserProfile = ({ userId }) => {
	const { user: currentUser } = useAuth();
	const [activeTab, setActiveTab] = useState('cocktails');

	// Determine if this is the current user's profile
	const isOwnProfile = currentUser?.id === userId;

	// Fetch user data
	const {
		data: userProfile,
		isLoading: profileLoading,
		error: profileError,
	} = useUserProfileById(userId);
	const {
		data: userCocktails,
		isLoading: cocktailsLoading,
		error: cocktailsError,
	} = useUserCocktails(userId, { limit: 12 });
	const {
		data: userFavorites,
		isLoading: favoritesLoading,
		error: favoritesError,
	} = useUserFavorites(userId, { limit: 12 });
	const { data: followers, error: followersError } = useUserFollowers(
		userId,
		{ limit: 100 },
	);
	const { data: following, error: followingError } = useUserFollowing(
		userId,
		{ limit: 100 },
	);

	// Handle errors with toast notifications
	useEffect(() => {
		if (profileError) {
			toast.error('Failed to load user profile');
		}
		if (cocktailsError) {
			toast.error('Failed to load user cocktails');
		}
		if (followersError) {
			toast.error('Failed to load followers');
		}
		if (followingError) {
			toast.error('Failed to load following list');
		}
		// Don't show error for favorites since that endpoint might not exist yet
		if (favoritesError && !favoritesError.message?.includes('404')) {
			console.warn('Favorites error:', favoritesError);
		}
	}, [
		profileError,
		cocktailsError,
		favoritesError,
		followersError,
		followingError,
	]);

	// Follow/unfollow functionality
	const {
		followUser,
		unfollowUser,
		isLoading: followLoading,
	} = useFollowUser();

	// Early return if no userId is provided (after all hooks)
	if (!userId) {
		return (
			<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
				<div className='text-center text-white'>
					<h2 className='text-2xl mb-4'>No user specified</h2>
					<p className='text-gray-400'>
						Please provide a user ID to view the profile
					</p>
				</div>
			</section>
		);
	}

	// Show loading state
	if (profileLoading) {
		return (
			<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
				<LoadingSpinner />
			</section>
		);
	}

	// Show error state
	if (profileError) {
		return (
			<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
				<div className='text-center text-white'>
					<h2 className='text-2xl mb-4'>User not found</h2>
					<p className='text-gray-400'>
						The user you're looking for doesn't exist
					</p>
				</div>
			</section>
		);
	}

	const handleFollowToggle = () => {
		if (!userProfile) return;

		// Check if currently following (this would need to be determined from backend data)
		const isFollowing = false; // You'll need to implement this logic based on your data structure

		if (isFollowing) {
			unfollowUser(userId);
		} else {
			followUser(userId);
		}
	};

	const tabs = [
		{
			id: 'cocktails',
			label: 'Cocktails',
			count: userCocktails?.count || 0,
		},
		{
			id: 'favorites',
			label: 'Favorites',
			count: userFavorites?.count || 0,
		},
		{ id: 'followers', label: 'Followers', count: followers?.count || 0 },
		{ id: 'following', label: 'Following', count: following?.count || 0 },
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case 'cocktails': {
				if (cocktailsLoading) return <LoadingSpinner size='sm' />;

				const cocktails =
					userCocktails?.cocktails || userCocktails?.data || [];

				if (cocktails.length === 0) {
					return (
						<div className='text-center py-12'>
							<p className='text-gray-400 text-lg'>
								{isOwnProfile
									? "You haven't"
									: `${userProfile.name} hasn't`}{' '}
								submitted any cocktails yet
							</p>
						</div>
					);
				}

				return (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{cocktails.map((cocktail) => (
							<CocktailCard
								key={cocktail._id || cocktail.id}
								cocktail={cocktail}
							/>
						))}
					</div>
				);
			}

			case 'favorites': {
				if (favoritesLoading) return <LoadingSpinner size='sm' />;

				const favorites =
					userFavorites?.favorites || userFavorites?.data || [];

				if (favorites.length === 0) {
					return (
						<div className='text-center py-12'>
							<p className='text-gray-400 text-lg'>
								{isOwnProfile
									? "You haven't"
									: `${userProfile.name} hasn't`}{' '}
								favorited any cocktails yet
							</p>
						</div>
					);
				}

				return (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{favorites.map((favorite) => (
							<CocktailCard
								key={favorite._id || favorite.id}
								cocktail={favorite.cocktail || favorite}
							/>
						))}
					</div>
				);
			}

			case 'followers': {
				const followersList =
					followers?.followers || followers?.data || [];

				if (followersList.length === 0) {
					return (
						<div className='text-center py-12'>
							<p className='text-gray-400 text-lg'>
								{isOwnProfile
									? "You don't"
									: `${userProfile.name} doesn't`}{' '}
								have any followers yet
							</p>
						</div>
					);
				}

				return (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{followersList.map((follower) => (
							<div
								key={follower._id || follower.id}
								className='bg-gray-800 p-4 rounded border border-yellow-500/20'
							>
								<div className='flex items-center space-x-3'>
									<img
										src={
											follower.avatar ||
											'/default-avatar.jpg'
										}
										alt={follower.name}
										className='w-12 h-12 rounded-full object-cover'
									/>
									<div>
										<h3 className='text-white font-semibold'>
											{follower.name}
										</h3>
										<p className='text-gray-400 text-sm'>
											@{follower.username}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				);
			}

			case 'following': {
				const followingList =
					following?.following || following?.data || [];

				if (followingList.length === 0) {
					return (
						<div className='text-center py-12'>
							<p className='text-gray-400 text-lg'>
								{isOwnProfile
									? "You're not"
									: `${userProfile.name} isn't`}{' '}
								following anyone yet
							</p>
						</div>
					);
				}

				return (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{followingList.map((user) => (
							<div
								key={user._id || user.id}
								className='bg-gray-800 p-4 rounded border border-yellow-500/20'
							>
								<div className='flex items-center space-x-3'>
									<img
										src={
											user.avatar || '/default-avatar.jpg'
										}
										alt={user.name}
										className='w-12 h-12 rounded-full object-cover'
									/>
									<div>
										<h3 className='text-white font-semibold'>
											{user.name}
										</h3>
										<p className='text-gray-400 text-sm'>
											@{user.username}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				);
			}

			default:
				return null;
		}
	};

	if (!userProfile) return null;

	return (
		<ArtDecoSection>
			<div className='container mx-auto px-4 py-12'>
				{/* Profile Header */}
				<div className='bg-black/50 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-8 mb-8'>
					<div className='flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8'>
						{/* Avatar */}
						<div className='relative'>
							<img
								src={
									userProfile.avatar ||
									'https://res.cloudinary.com/bartendershub/image/upload/v1/default-avatar.jpg'
								}
								alt={userProfile.name}
								className='w-32 h-32 rounded-full object-cover border-4 border-yellow-500/50'
							/>
							{userProfile.isVerified && (
								<div className='absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-2'>
									<svg
										className='w-4 h-4 text-black'
										fill='currentColor'
										viewBox='0 0 20 20'
									>
										<path
											fillRule='evenodd'
											d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
											clipRule='evenodd'
										/>
									</svg>
								</div>
							)}
						</div>

						{/* User Info */}
						<div className='flex-1 text-center md:text-left'>
							<div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
								<div>
									<h1 className='text-3xl font-bold text-white mb-2'>
										{userProfile.name}
									</h1>
									<p className='text-yellow-500 text-lg'>
										@{userProfile.username}
									</p>
									{userProfile.bio && (
										<p className='text-gray-300 mt-2 max-w-2xl'>
											{userProfile.bio}
										</p>
									)}
								</div>

								{/* Follow Button (only show for other users) */}
								{!isOwnProfile && currentUser && (
									<ArtDecoButton
										onClick={handleFollowToggle}
										disabled={followLoading}
										className='mt-4 md:mt-0'
									>
										{followLoading
											? 'Loading...'
											: 'Follow'}
									</ArtDecoButton>
								)}
							</div>

							{/* Stats */}
							<div className='flex justify-center md:justify-start space-x-8 text-center'>
								<div>
									<div className='text-2xl font-bold text-yellow-500'>
										{userProfile.cocktailsCount || 0}
									</div>
									<div className='text-gray-400 text-sm'>
										Cocktails
									</div>
								</div>
								<div>
									<div className='text-2xl font-bold text-yellow-500'>
										{userProfile.followersCount || 0}
									</div>
									<div className='text-gray-400 text-sm'>
										Followers
									</div>
								</div>
								<div>
									<div className='text-2xl font-bold text-yellow-500'>
										{userProfile.followingCount || 0}
									</div>
									<div className='text-gray-400 text-sm'>
										Following
									</div>
								</div>
							</div>

							{/* Badges */}
							{userProfile.badges &&
								userProfile.badges.length > 0 && (
									<div className='flex flex-wrap justify-center md:justify-start gap-2 mt-4'>
										{userProfile.badges.map(
											(badge, index) => (
												<span
													key={index}
													className='bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-sm border border-yellow-500/30'
												>
													{badge}
												</span>
											),
										)}
									</div>
								)}

							{/* Join Date */}
							<div className='text-gray-400 text-sm mt-4'>
								Member since{' '}
								{new Date(
									userProfile.joinDate ||
										userProfile.createdAt,
								).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</div>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className='border-b border-yellow-500/20 mb-8'>
					<nav className='flex space-x-8'>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
									activeTab === tab.id
										? 'border-yellow-500 text-yellow-500'
										: 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
								}`}
							>
								{tab.label} ({tab.count})
							</button>
						))}
					</nav>
				</div>

				{/* Tab Content */}
				<div className='min-h-96'>{renderTabContent()}</div>
			</div>
		</ArtDecoSection>
	);
};

export default UserProfile;
