import { Spinner } from "@/components/ui/Spinner";
import AuthModal from "@/features/user/auth/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { adminRoutes } from "@/routes/admin.routes";
import { userRoutes } from "@/routes/user.routes";
import { Routes, Route, Navigate } from "react-router";

function AppContent() {
  const { authModal, closeAuthModal, user, isAuthenticated, isLoading } =
    useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* User & Public Routes */}
        {userRoutes}

        {/* Admin Routes - Strictly Protected */}
        {adminRoutes}

        {/* Root redirect based on user role */}
        <Route
          path="/"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch all - redirect to appropriate dashboard */}
        <Route
          path="*"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        setIsOpen={(open) => !open && closeAuthModal()}
      />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
