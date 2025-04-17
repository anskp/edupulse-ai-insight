
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@/store/auth-store';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  // Mock login function - would connect to backend in a real app
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, we would make an API call here
      setTimeout(() => {
        // Mock successful login
        const user = {
          id: '1',
          name: role === 'admin' ? 'Admin User' : role === 'teacher' ? 'Ms. Priya' : 'Riya Student',
          email,
          role,
          avatar: '',
        };
        
        const token = 'mock-jwt-token';
        
        login(user, token);
        
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user.name}!`,
        });
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'teacher') {
          navigate('/teacher');
        } else {
          navigate('/student');
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="px-4 sm:px-0 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Edu</span>
            <span className="text-secondary">Pulse</span>
          </h1>
          <p className="text-muted-foreground">Educational Analytics Platform</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Login As</Label>
                <Select value={role || 'student'} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  For demo purposes, you can select any role.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Demo Version 1.0 © 2025 EduPulse</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
