
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import type { UserRole } from '@/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'teacher', 'student'] 
}) => {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
