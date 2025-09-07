import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const RequireAdmin = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?mode=login&redirect=${encodeURIComponent(location.pathname)}`}
        state={{ from: location }}
        replace
      />
    );
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;

