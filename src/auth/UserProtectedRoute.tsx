// src/auth/UserProtectedRoute.tsx
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

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Check if user is authenticated and account is active (any role except admin accessing admin routes)
  const isAuthorized = isAuthenticated && isAccountActive;

  // If not authorized (not logged in or inactive account), redirect to home
  if (!isAuthorized) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If user is admin trying to access user routes, redirect to admin
  if (isAdmin && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" replace />;
  }

  // If regular user trying to access admin routes, redirect to home
  if (isAdmin && location.pathname.startsWith('/admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}