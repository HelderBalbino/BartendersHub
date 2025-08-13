import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserProfile from '../components/UserProfile';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
	const { userId } = useParams();
	const { user: currentUser } = useAuth();

	// If no userId in params, use current user's ID
	// Since this is a protected route, currentUser should be available
	const profileUserId = userId || currentUser?.id;

	// If we still don't have a profileUserId, show loading
	// This handles the brief moment when auth context is still initializing
	if (!profileUserId) {
		return (
			<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
				<LoadingSpinner />
			</section>
		);
	}

	return (
		<>
			<UserProfile userId={profileUserId} />
		</>
	);
};

export default ProfilePage;
