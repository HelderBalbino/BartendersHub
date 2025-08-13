import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserProfile from '../components/UserProfile';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
	const { userId } = useParams();
	const { user: currentUser, loading } = useAuth();

	// If no userId from URL and auth is still loading, show loading
	if (!userId && loading) {
		return (
			<div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black'>
				<LoadingSpinner />
			</div>
		);
	}

	// If no userId in params, use current user's ID
	// Try multiple possible ID fields
	const profileUserId =
		userId || currentUser?.id || currentUser?._id || currentUser?.userId;

	return (
		<>
			<UserProfile userId={profileUserId} />
		</>
	);
};

export default ProfilePage;
