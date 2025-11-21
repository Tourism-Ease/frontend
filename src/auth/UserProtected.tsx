import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

interface UserProtectedProps {
  children: React.ReactNode;
}

export default function UserProtected({ children }: UserProtectedProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!user || (user.role !== 'user' && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  // Render children if user is authenticated
  return <>{children}</>;
}