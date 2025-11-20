import { Routes, Route, Navigate } from "react-router";
import { PUBLIC_ROUTES } from "../constants/routes";
import { adminRoutes } from "../routes/admin.routes";
import { userRoutes } from "../routes/user.routes";
import ScrollToTop from "../components/ui/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {userRoutes}
        {adminRoutes}

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={<Navigate to={PUBLIC_ROUTES.HOME} replace />}
        />
      </Routes>
    </>
  );
}
