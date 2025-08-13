import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserProfile from '../components/UserProfile';

const ProfilePage = () => {
	const { userId } = useParams();
	const { user: currentUser } = useAuth();

	// If no userId in params, use current user's ID
	const profileUserId = userId || currentUser?.id;

	return (
		<>
			<UserProfile userId={profileUserId} />
		</>
	);
};

export default ProfilePage;
