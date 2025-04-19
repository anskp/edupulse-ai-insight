
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Shield } from 'lucide-react';

const Unauthorized = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'guest';

  const getRedirectPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'teacher') return '/teacher';
    if (role === 'student') return '/student';
    return '/';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center max-w-md px-4">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
            <Shield className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex justify-center">
          <Button asChild>
            <Link to={getRedirectPath()}>Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
