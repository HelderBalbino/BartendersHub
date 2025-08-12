import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/UserProfile';

const ProfilePage = () => {
	const { userId } = useParams();
	const { user: currentUser } = useAuth();

	// If no userId in params, show current user's profile
	const profileUserId = userId || currentUser?.id;

	return (
		<>
			<UserProfile userId={profileUserId} />
		</>
	);
};

export default ProfilePage;
