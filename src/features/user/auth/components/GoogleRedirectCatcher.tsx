import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function GoogleRedirectCatcher() {
  const navigate = useNavigate();
  useEffect(() => {
    const qs = window.location.search || "";
    navigate("/auth/google/callback" + qs, { replace: true });
  }, [navigate]);
  return <div className="min-h-screen flex items-center justify-center p-4">Redirecting...</div>;
}
