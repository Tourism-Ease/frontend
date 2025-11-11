import { Navigate } from "react-router";
import { USER_ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";

type Props = { children: React.ReactNode };

export default function GuestOnly({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={USER_ROUTES.ROOT} replace />;
  }

  return <>{children}</>;
}
