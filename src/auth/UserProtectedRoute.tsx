import { type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";
import { Navigate, useLocation } from "react-router";

interface UserProtectedRouteProps {
  children: ReactNode;
}

export default function UserProtectedRoute({ children }: UserProtectedRouteProps) {
  const { isAuthenticated, isLoading, isAdmin, isAccountActive } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // If not authenticated, redirect to home with auth modal
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If account is deactivated, redirect to home with reactivation modal
  if (!isAccountActive) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If admin trying to access user routes, redirect to admin
  if (isAdmin && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}