
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';

const Index = () => {
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated) {
    // Redirect based on role
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (role === 'teacher') {
      return <Navigate to="/teacher" replace />;
    } else if (role === 'student') {
      return <Navigate to="/student" replace />;
    }
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" replace />;
};

export default Index;
