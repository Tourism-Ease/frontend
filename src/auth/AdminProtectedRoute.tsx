// src/auth/AdminProtectedRoute.tsx
import { type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";
import { Navigate, useLocation } from "react-router";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export default function AdminProtectedRoute({
  children,
}: AdminProtectedRouteProps) {
  const { isLoading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAdmin && location.pathname.startsWith("/admin")) {
    return <>{children}</>;
  }
  
  if (isAdmin && !location.pathname.startsWith("/admin")) {
  return <Navigate to="/admin" replace state={{ from: location }} />;
  }


  return <Navigate to="/" replace state={{ from: location }} />;
}
