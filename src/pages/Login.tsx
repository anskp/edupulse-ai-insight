
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap, Info, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Demo credentials
const demoCredentials = {
  admin: {
    email: 'admin@edupulse.com',
    password: 'admin123!',
  },
  teacher: {
    email: 'teacher@edupulse.com',
    password: 'teacher123!',
  },
  student: {
    email: 'student@edupulse.com',
    password: 'student123!',
  },
};

const Login = () => {
  const { isAuthenticated, role, login } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('login');

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'teacher') return <Navigate to="/teacher" replace />;
    if (role === 'student') return <Navigate to="/student" replace />;
  }

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // For a real app, this would authenticate with Supabase
      // const { data: authData, error } = await supabase.auth.signInWithPassword({
      //   email: data.email,
      //   password: data.password,
      // });
      
      // For now, let's simulate login based on email domain or predefined credentials
      let userRole: 'admin' | 'teacher' | 'student' | null = null;
      
      // Check demo credentials
      if (data.email === demoCredentials.admin.email && data.password === demoCredentials.admin.password) {
        userRole = 'admin';
      } else if (data.email === demoCredentials.teacher.email && data.password === demoCredentials.teacher.password) {
        userRole = 'teacher';
      } else if (data.email === demoCredentials.student.email && data.password === demoCredentials.student.password) {
        userRole = 'student';
      } else if (data.email.includes('admin')) {
        userRole = 'admin';
      } else if (data.email.includes('teacher')) {
        userRole = 'teacher';
      } else if (data.email.includes('student')) {
        userRole = 'student';
      } else {
        // Default to student for demo purposes
        userRole = 'student';
      }
      
      // Create a simulated user object
      const user = {
        id: '123456789',
        name: userRole === 'admin' 
          ? 'Admin User' 
          : userRole === 'teacher' 
            ? 'Teacher User' 
            : 'Student User',
        email: data.email,
        role: userRole,
      };
      
      // Simulate a token
      const token = 'simulated_jwt_token';
      
      // Login the user
      login(user, token);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
      });
      
      // Redirect based on role
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDemoCredentials = (role: 'admin' | 'teacher' | 'student') => {
    form.setValue('email', demoCredentials[role].email);
    form.setValue('password', demoCredentials[role].password);
    
    // Submit the form
    form.handleSubmit(onLoginSubmit)();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container flex flex-col items-center justify-center flex-1 max-w-md px-4 py-8">
        <div className="flex items-center mb-6 text-2xl font-bold">
          <GraduationCap className="h-8 w-8 mr-2 text-primary" />
          <span className="text-primary">Edu</span>
          <span className="text-secondary">Pulse</span>
        </div>
        
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl md:text-2xl">Welcome to EduPulse</CardTitle>
            <CardDescription>
              AI-powered learning platform for schools and colleges
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <CardContent className="space-y-4">
                    <Alert className="bg-muted/50">
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Use demo credentials below or any email with admin/teacher/student in it.
                      </AlertDescription>
                    </Alert>
                  
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => loginWithDemoCredentials('admin')}
                      >
                        Admin Demo
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => loginWithDemoCredentials('teacher')}
                      >
                        Teacher Demo
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => loginWithDemoCredentials('student')}
                      >
                        Student Demo
                      </Button>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        'Login'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>© 2025 EduPulse Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
