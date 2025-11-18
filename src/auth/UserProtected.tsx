import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { Spinner } from "../components/ui/Spinner";
import { useAuthModalContext } from "../context/AuthModalContext";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function UserProtected({
  children,
  requiredRole = "user",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { openModal } = useAuthModalContext();
  const location = useLocation();
  const [isDelaying, setIsDelaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsDelaying(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isDelaying || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    openModal(); // Open the AuthModal automatically
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
