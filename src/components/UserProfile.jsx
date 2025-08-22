import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
	useUserProfileById,
	useUserCocktails,
	useUserFavorites,
	useUserFollowers,
	useUserFollowing,
} from '../hooks/useProfile';
import { useFollowUser } from '../hooks/useCommunity';
import LoadingSpinner from './LoadingSpinner';
import SkeletonGrid from './ui/SkeletonGrid';
import CocktailCard from './CocktailCard';
import ArtDecoSection from './ui/ArtDecoSection';
import ArtDecoButton from './ui/ArtDecoButton';
import ImageUpload from './ui/Forms/ImageUpload';
import { useUpdateProfile } from '../hooks/useProfile';
import { toast } from 'react-hot-toast';

const UserProfile = ({ userId }) => {
	const { user: currentUser } = useAuth();
	const [activeTab, setActiveTab] = useState('cocktails');
	// Settings modal state
	const [showSettings, setShowSettings] = useState(false);
	const [avatarFile, setAvatarFile] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState(null);
	const settingsRef = useRef(null);
	const { mutateAsync: updateProfile, isLoading: updatingProfile } =
		useUpdateProfile();

	// Close settings on outside click
	useEffect(() => {
		if (!showSettings) return;
		const handler = (e) => {
			if (
				settingsRef.current &&
				!settingsRef.current.contains(e.target)
			) {
				setShowSettings(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, [showSettings]);

	// Avatar file preview management
	useEffect(() => {
		if (!avatarFile) {
			setAvatarPreview(null);
			return;
		}
		const url = URL.createObjectURL(avatarFile);
		setAvatarPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [avatarFile]);

	const handleAvatarChange = async () => {
		if (!avatarFile) return toast.error('Please select an image first');
		try {
			await updateProfile({ avatar: avatarFile });
			toast.success('Avatar updated');
			setShowSettings(false);
		} catch (err) {
			toast.error(err.message || 'Failed to update avatar');
		}
	};

	const handleDeleteAccount = async () => {
		// Placeholder until backend endpoint exists
		toast.error('Account deletion not yet implemented');
	};

	// (Removed verbose debug logging)

	// Determine if this is the current user's profile
	const isOwnProfile = currentUser?.id === userId;

	// Fetch user data - disable queries if no userId
	const {
		data: userProfile,
		isLoading: profileLoading,
		error: profileError,
	} = useUserProfileById(userId, { enabled: !!userId });
	const {
		data: userCocktails,
		isLoading: cocktailsLoading,
		error: cocktailsError,
	} = useUserCocktails(userId, { limit: 12, enabled: !!userId });
	const {
		data: userFavorites,
		isLoading: favoritesLoading,
		error: favoritesError,
	} = useUserFavorites(userId, { limit: 12, enabled: !!userId });
	const { data: followers, error: followersError } = useUserFollowers(
		userId,
		{ limit: 100, enabled: !!userId },
	);
	const { data: following, error: followingError } = useUserFollowing(
		userId,
		{ limit: 100, enabled: !!userId },
	);

	// Minimal consolidated error logging (dev only)
	useEffect(() => {
		if (import.meta.env.DEV) {
			const firstError =
				profileError ||
				cocktailsError ||
				favoritesError ||
				followersError ||
				followingError;
			if (firstError) {
				console.error('UserProfile data fetch error:', firstError);
			}
		}
	}, [
		profileError,
		cocktailsError,
		favoritesError,
		followersError,
		followingError,
	]);

	// Follow/unfollow functionality
	const { followUser, isLoading: followLoading } = useFollowUser();

	const derivedIsFollowing = !!followers?.followers?.some(
		(f) => (f._id || f.id) === currentUser?.id,
	);
	const [optimisticFollowing, setOptimisticFollowing] =
		useState(derivedIsFollowing);
	// Keep optimistic state in sync when backend data changes
	useEffect(() => {
		if (!followLoading) setOptimisticFollowing(derivedIsFollowing);
	}, [derivedIsFollowing, followLoading]);

	const handleFollowToggle = () => {
		if (!userProfile || followLoading) return;
		setOptimisticFollowing((prev) => !prev);
		followUser(userId);
	};

	// Early returns (after all hooks & derived state)
	if (!userId) {
		return (
			<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
				<div className='text-center text-white'>
					<h2 className='text-2xl mb-4'>No User ID</h2>
					<p className='text-gray-400 mb-4'>
						Unable to load profile - missing user ID
					</p>
					<LoadingSpinner />
				</div>
			</section>
		);
	}

	if (profileLoading) {
		return (
			<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
				<LoadingSpinner />
			</section>
		);
	}

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
				if (cocktailsLoading) return <SkeletonGrid />;

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
				if (favoritesLoading) return <SkeletonGrid />;

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
				<div className='bg-black/50 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-8 mb-8 relative'>
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
											: optimisticFollowing
											? 'Unfollow'
											: 'Follow'}
									</ArtDecoButton>
								)}
								{/* Settings cog for own profile */}
								{isOwnProfile && (
									<button
										onClick={() =>
											setShowSettings((p) => !p)
										}
										className='absolute top-4 right-4 text-yellow-500 hover:text-yellow-300 transition'
										aria-label='Profile settings'
									>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-6 w-6'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
											strokeWidth={1.5}
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z'
											/>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
											/>
										</svg>
									</button>
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
				{/* Settings Modal */}
				{showSettings && (
					<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'>
						<div
							ref={settingsRef}
							className='bg-gray-900 border border-yellow-500/30 rounded-lg w-full max-w-lg p-6 relative'
						>
							<button
								onClick={() => setShowSettings(false)}
								className='absolute top-3 right-3 text-gray-400 hover:text-white'
								aria-label='Close settings'
							>
								✕
							</button>
							<h2 className='text-2xl font-semibold text-yellow-500 mb-4'>
								Profile Settings
							</h2>
							<div className='space-y-8 max-h-[70vh] overflow-y-auto pr-1'>
								<section>
									<h3 className='text-lg text-white mb-3'>
										Avatar
									</h3>
									<ImageUpload
										preview={
											avatarPreview || userProfile.avatar
										}
										onChange={(file) => setAvatarFile(file)}
										onRemove={() => setAvatarFile(null)}
										placeholder='Choose new avatar'
										maxSize={2 * 1024 * 1024}
									/>
									<div className='flex gap-4 mt-4'>
										<ArtDecoButton
											onClick={handleAvatarChange}
											disabled={
												updatingProfile || !avatarFile
											}
										>
											{updatingProfile
												? 'Updating...'
												: 'Save Avatar'}
										</ArtDecoButton>
										{avatarFile && (
											<button
												onClick={() =>
													setAvatarFile(null)
												}
												className='text-sm text-gray-400 hover:text-white'
											>
												Cancel
											</button>
										)}
									</div>
								</section>

								<section className='border-t border-yellow-500/20 pt-6'>
									<h3 className='text-lg text-white mb-2'>
										Danger Zone
									</h3>
									<p className='text-gray-400 text-sm mb-4'>
										Deleting your account is permanent and
										cannot be undone.
									</p>
									<button
										onClick={handleDeleteAccount}
										className='px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition rounded'
									>
										Delete Account
									</button>
								</section>
							</div>
						</div>
					</div>
				)}
			</div>
		</ArtDecoSection>
	);
};

export default UserProfile;
