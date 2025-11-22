import { type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";
import { Navigate, useLocation } from "react-router";

interface NotAdminProtectedProps {
  children: ReactNode;
}

export default function NotAdminProtected({
  children,
}: NotAdminProtectedProps) {
  const { isLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // If user is admin and trying to access non-admin routes, redirect to admin
  if (isAdmin && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}