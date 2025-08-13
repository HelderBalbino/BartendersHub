import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserProfile from '../components/UserProfile';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
	const { userId } = useParams();
	const { user: currentUser, loading } = useAuth();

	// If auth is loading and no userId from params, show loading
	if (loading && !userId) {
		return (
			<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
				<LoadingSpinner />
			</section>
		);
	}

	// If no userId in params, show current user's profile
	const profileUserId = userId || currentUser?.id;

	return (
		<>
			<UserProfile userId={profileUserId} />
		</>
	);
};

export default ProfilePage;
