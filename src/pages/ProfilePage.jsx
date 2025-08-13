import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserProfile from '../components/UserProfile';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
	const { userId } = useParams();
	const { user: currentUser, loading, isAuthenticated } = useAuth();

	// Debug logging
	console.log('ProfilePage Debug:', {
		userId,
		currentUser,
		currentUserId: currentUser?.id,
		loading,
		isAuthenticated,
	});

	// If no userId from URL and auth is still loading, show loading
	if (!userId && loading) {
		return (
			<div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black'>
				<LoadingSpinner />
			</div>
		);
	}

	// If no userId in params, use current user's ID
	const profileUserId = userId || currentUser?.id;

	// If we still don't have a profileUserId and we're authenticated, wait a bit more
	if (!profileUserId && isAuthenticated) {
		return (
			<div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black'>
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<>
			<UserProfile userId={profileUserId} />
		</>
	);
};

export default ProfilePage;
