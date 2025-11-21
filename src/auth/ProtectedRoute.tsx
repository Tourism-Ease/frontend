import { type ReactNode, useEffect } from "react";
import { useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "user" | "admin" | "employee";
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = "/",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, openAuthModal, isAccountActive } =
    useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, open auth modal
      if (!isAuthenticated) {
        openAuthModal("login", location.pathname);
      }
      // If account is deactivated, open reactivation modal
      else if (!isAccountActive) {
        openAuthModal("reactivate-account", location.pathname);
      }
      // If role doesn't match, redirect to fallback
      else if (
        requiredRole &&
        user?.role !== requiredRole &&
        user?.role !== "admin"
      ) {
        window.location.href = fallbackPath;
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    isAccountActive,
    user,
    requiredRole,
    location.pathname,
    openAuthModal,
    fallbackPath,
  ]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Don't render if not authenticated or account inactive
  if (!isAuthenticated || !isAccountActive) {
    return null;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole && user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
