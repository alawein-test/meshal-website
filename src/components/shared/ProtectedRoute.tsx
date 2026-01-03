import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useGuestStore } from '@/stores/guestStore';

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthenticated: boolean;
  isLoading?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  isAuthenticated,
  isLoading = false,
  redirectTo = '/auth',
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isGuestMode } = useGuestStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Allow access if authenticated OR in guest mode
  if (!isAuthenticated && !isGuestMode) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
