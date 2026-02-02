import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { canAccess } from "@/lib/roles";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, activeRole } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Role-based access: use active role (role swap) for permission check
  const roleToCheck = activeRole ?? user?.roles?.[0];
  if (user && roleToCheck && !canAccess(path, roleToCheck)) {
    return <Navigate to="/unauthorized" state={{ from: path }} replace />;
  }

  return <>{children}</>;
}
