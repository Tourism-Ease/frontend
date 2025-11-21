// src/auth/ProtectedRoute.tsx
import { type ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  type?: "user" | "admin" | "public";
  requiredRole?: "user" | "admin" | "employee";
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  type = "user",
  requiredRole,
  fallbackPath = "/",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, openAuthModal, isAccountActive } =
    useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      const isAdmin = user.role === "admin";
      const isAdminRoute = location.pathname.startsWith("/admin");
      const isUserRoute = !isAdminRoute && location.pathname !== "/";

      // If not authenticated, open auth modal for protected routes
      if (!isAuthenticated && type !== "public") {
        openAuthModal("login", location.pathname);
        return;
      }

      // If account is deactivated, open reactivation modal
      if (!isAccountActive && type !== "public") {
        openAuthModal("reactivate-account", location.pathname);
        return;
      }

      // 🔒 STRICT ADMIN ROUTE PROTECTION
      if (isAdminRoute && !isAdmin) {
        // Non-admin users trying to access admin routes → redirect to home
        navigate("/", { replace: true });
        return;
      }

      // 🔒 STRICT USER ROUTE PROTECTION FOR ADMINS
      if (isUserRoute && isAdmin && type === "user") {
        // Admin users trying to access user-specific routes → redirect to admin dashboard
        navigate("/admin", { replace: true });
        return;
      }

      // Redirect admins trying to access user profile to admin dashboard
      if (isAdmin && location.pathname === "/profile") {
        navigate("/admin", { replace: true });
        return;
      }

      // Check if required role matches
      if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
        navigate(fallbackPath, { replace: true });
        return;
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
    navigate,
    fallbackPath,
    type,
  ]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // For public routes, always render children
  if (type === "public") {
    return <>{children}</>;
  }

  // Don't render if not authenticated or account inactive for protected routes
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
