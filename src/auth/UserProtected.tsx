import { Navigate, useLocation } from 'react-router';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';

export default function UserProtected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'user') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}