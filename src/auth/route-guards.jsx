import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth-state";

function AuthLoading() {
  return <main className="auth-loading" aria-live="polite">Checking your account…</main>;
}

export function PublicOnly({ children }) {
  const { user, authLoading } = useAuth();
  const location = useLocation();
  if (authLoading) return <AuthLoading />;
  if (user) return <Navigate to="/application" state={{ from: location }} replace />;
  return children;
}

export function RequireAuth({ adminOnly = false }) {
  const { user, profile, authLoading, profileLoading } = useAuth();
  const location = useLocation();
  if (authLoading || (adminOnly && profileLoading)) return <AuthLoading />;
  if (!user) return <Navigate to="/" state={{ from: location }} replace />;
  if (adminOnly && !["admin", "super_admin"].includes(profile?.role)) return <Navigate to="/home" replace />;
  return <Outlet />;
}
