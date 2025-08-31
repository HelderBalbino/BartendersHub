import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireVerification = true }) => {
	const { isAuthenticated, loading, user } = useAuth();
	const location = useLocation();

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!isAuthenticated) {
		// Redirect to login with return url
		return (
			<Navigate
				to={`/login?mode=login&redirect=${encodeURIComponent(
					location.pathname,
				)}`}
				state={{ from: location }}
				replace
			/>
		);
	}

	// If authenticated but unverified and this route requires verification, redirect
	if (requireVerification && user && user.isVerified === false) {
		return (
			<Navigate
				to={`/verify-pending?email=${encodeURIComponent(
					user.email || '',
				)}&redirect=${encodeURIComponent(location.pathname)}`}
				replace
			/>
		);
	}

	return children;
};

export default ProtectedRoute;
