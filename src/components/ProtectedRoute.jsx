import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, loading } = useAuth();
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

	return children;
};

export default ProtectedRoute;
