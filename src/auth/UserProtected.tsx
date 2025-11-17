import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router'; // Assuming you're using react-router-dom
import { Spinner } from '../components/ui/Spinner'; // You already have a spinner component
import { useAuth } from '../hooks/useAuth'; // Your custom useAuth hook

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Optional prop for role-based access (e.g., 'user', 'admin', etc.)
}

export default function ProtectedRoute({
  children,
  requiredRole = 'user', // Default to 'user' role, but this can be customized
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth(); // Getting the auth state
  const location = useLocation(); // To track the current location for redirection
  const [isDelaying, setIsDelaying] = useState(true);

  // Add a 1-second delay to wait for all data to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelaying(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  // Show a loading spinner while delaying or authentication is in progress
  if (isDelaying || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Redirect if the user role doesn't match the required role
  if (user?.role !== requiredRole) {
    return <Navigate to="/" replace />; // Redirect to home or a default page
  }

  // Render the children if the user is authenticated and has the correct role
  return <>{children}</>;
}
