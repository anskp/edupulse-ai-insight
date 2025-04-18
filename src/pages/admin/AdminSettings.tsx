
import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Bell,
  BookOpen,
  Building,
  Calendar,
  Database,
  HardDrive,
  Key,
  Lock,
  Mail,
  Save,
  Server,
  Settings,
  Shield,
  Upload,
  UserCog,
  Zap,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form validation schemas
const schoolInfoSchema = z.object({
  schoolName: z.string().min(2, { message: "School name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Please enter a valid address" }),
  phone: z.string().min(5, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  website: z.string().url({ message: "Please enter a valid URL" }),
  principalName: z.string().min(2, { message: "Principal name must be at least 2 characters" }),
});

const academicYearSchema = z.object({
  currentYear: z.string().min(1, { message: "Please select current academic year" }),
  startDate: z.string().min(1, { message: "Please select a start date" }),
  endDate: z.string().min(1, { message: "Please select an end date" }),
  currentTerm: z.string().min(1, { message: "Please select current term" }),
});

const securitySettingsSchema = z.object({
  passwordPolicy: z.string().min(1, { message: "Please select a password policy" }),
  twoFactorAuth: z.boolean(),
  sessionTimeout: z.string().min(1, { message: "Please select a session timeout" }),
  loginAttempts: z.string().min(1, { message: "Please select login attempt limit" }),
});

const systemSettingsSchema = z.object({
  dataBackup: z.string().min(1, { message: "Please select a backup frequency" }),
  storageLimit: z.string().min(1, { message: "Please select a storage limit" }),
  aiPredictionFrequency: z.string().min(1, { message: "Please select an AI prediction frequency" }),
  debugMode: z.boolean(),
  maintenanceMode: z.boolean(),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  adminAlerts: z.boolean(),
  lowPerformanceAlerts: z.boolean(),
  attendanceAlerts: z.boolean(),
  systemUpdates: z.boolean(),
});

type SchoolInfoValues = z.infer<typeof schoolInfoSchema>;
type AcademicYearValues = z.infer<typeof academicYearSchema>;
type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;
type SystemSettingsValues = z.infer<typeof systemSettingsSchema>;
type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('school');
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const { toast } = useToast();

  // Initialize forms
  const schoolInfoForm = useForm<SchoolInfoValues>({
    resolver: zodResolver(schoolInfoSchema),
    defaultValues: {
      schoolName: 'EduPulse Academy',
      address: '123 Education Street, Knowledge City',
      phone: '+91 1234567890',
      email: 'info@edupulseacademy.com',
      website: 'https://edupulseacademy.com',
      principalName: 'Dr. Rajendra Kumar',
    },
  });

  const academicYearForm = useForm<AcademicYearValues>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      currentYear: '2024-2025',
      startDate: '2024-06-15',
      endDate: '2025-04-30',
      currentTerm: 'Spring 2025',
    },
  });

  const securitySettingsForm = useForm<SecuritySettingsValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      passwordPolicy: 'strong',
      twoFactorAuth: true,
      sessionTimeout: '30',
      loginAttempts: '5',
    },
  });

  const systemSettingsForm = useForm<SystemSettingsValues>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      dataBackup: 'daily',
      storageLimit: '50',
      aiPredictionFrequency: 'weekly',
      debugMode: false,
      maintenanceMode: false,
    },
  });

  const notificationSettingsForm = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      adminAlerts: true,
      lowPerformanceAlerts: true,
      attendanceAlerts: true,
      systemUpdates: true,
    },
  });

  // Form submission handlers
  const onSchoolInfoSubmit = (data: SchoolInfoValues) => {
    toast({
      title: "School information updated",
      description: "School information settings have been saved.",
    });
  };

  const onAcademicYearSubmit = (data: AcademicYearValues) => {
    toast({
      title: "Academic year updated",
      description: "Academic year settings have been saved.",
    });
  };

  const onSecuritySettingsSubmit = (data: SecuritySettingsValues) => {
    toast({
      title: "Security settings updated",
      description: "Security settings have been saved.",
    });
  };

  const onSystemSettingsSubmit = (data: SystemSettingsValues) => {
    toast({
      title: "System settings updated",
      description: "System settings have been saved.",
    });
  };

  const onNotificationSettingsSubmit = (data: NotificationSettingsValues) => {
    toast({
      title: "Notification settings updated",
      description: "Notification settings have been saved.",
    });
  };

  const handleCreateBackup = () => {
    setBackupInProgress(true);
    toast({
      title: "Backup started",
      description: "Creating system backup...",
    });
    
    setTimeout(() => {
      setBackupInProgress(false);
      toast({
        title: "Backup completed",
        description: "System backup created successfully.",
      });
    }, 3000);
  };

  const handleRestoreBackup = () => {
    setRestoreDialogOpen(false);
    toast({
      title: "Restore started",
      description: "Restoring system from backup...",
    });
    
    setTimeout(() => {
      toast({
        title: "Restore completed",
        description: "System has been restored from backup.",
      });
    }, 5000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Configure and manage system-wide settings for the EduPulse platform.
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="school">School</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="school" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  School Information
                </CardTitle>
                <CardDescription>
                  Manage your school's basic information and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...schoolInfoForm}>
                  <form onSubmit={schoolInfoForm.handleSubmit(onSchoolInfoSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={schoolInfoForm.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={schoolInfoForm.control}
                        name="principalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Principal Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={schoolInfoForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={schoolInfoForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={schoolInfoForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={schoolInfoForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full sm:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Save School Information
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  School Logo & Branding
                </CardTitle>
                <CardDescription>
                  Manage your school's logo and branding elements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-sm font-medium">School Logo</label>
                      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                        <div className="text-center">
                          <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Drag and drop a file or click to browse
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Upload Logo
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-sm font-medium">School Colors</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-muted-foreground w-24">Primary</label>
                          <div className="flex gap-2 items-center">
                            <div className="h-6 w-6 bg-edu-secondary rounded-full"></div>
                            <Input defaultValue="#4F46E5" className="w-32" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-muted-foreground w-24">Secondary</label>
                          <div className="flex gap-2 items-center">
                            <div className="h-6 w-6 bg-edu-primary rounded-full"></div>
                            <Input defaultValue="#10B981" className="w-32" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-muted-foreground w-24">Accent</label>
                          <div className="flex gap-2 items-center">
                            <div className="h-6 w-6 bg-amber-500 rounded-full"></div>
                            <Input defaultValue="#F59E0B" className="w-32" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Save Branding
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="academic" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Academic Year Settings
                </CardTitle>
                <CardDescription>
                  Configure the current academic year and related settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...academicYearForm}>
                  <form onSubmit={academicYearForm.handleSubmit(onAcademicYearSubmit)} className="space-y-6">
                    <FormField
                      control={academicYearForm.control}
                      name="currentYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Academic Year</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select academic year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2023-2024">2023-2024</SelectItem>
                              <SelectItem value="2024-2025">2024-2025</SelectItem>
                              <SelectItem value="2025-2026">2025-2026</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={academicYearForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Year Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={academicYearForm.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Year End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={academicYearForm.control}
                      name="currentTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Term</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select current term" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                              <SelectItem value="Winter 2024">Winter 2024</SelectItem>
                              <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                              <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full sm:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Save Academic Settings
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Grading System
                </CardTitle>
                <CardDescription>
                  Configure the grading system and passing criteria.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grading Scale</label>
                    <div className="border rounded-lg">
                      <div className="overflow-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="text-left p-2">Grade</th>
                              <th className="text-left p-2">Min Marks (%)</th>
                              <th className="text-left p-2">Max Marks (%)</th>
                              <th className="text-left p-2">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t">
                              <td className="p-2">A+</td>
                              <td className="p-2">90</td>
                              <td className="p-2">100</td>
                              <td className="p-2">Outstanding</td>
                            </tr>
                            <tr className="border-t">
                              <td className="p-2">A</td>
                              <td className="p-2">80</td>
                              <td className="p-2">89</td>
                              <td className="p-2">Excellent</td>
                            </tr>
                            <tr className="border-t">
                              <td className="p-2">B+</td>
                              <td className="p-2">70</td>
                              <td className="p-2">79</td>
                              <td className="p-2">Very Good</td>
                            </tr>
                            <tr className="border-t">
                              <td className="p-2">B</td>
                              <td className="p-2">60</td>
                              <td className="p-2">69</td>
                              <td className="p-2">Good</td>
                            </tr>
                            <tr className="border-t">
                              <td className="p-2">C</td>
                              <td className="p-2">50</td>
                              <td className="p-2">59</td>
                              <td className="p-2">Satisfactory</td>
                            </tr>
                            <tr className="border-t">
                              <td className="p-2">D</td>
                              <td className="p-2">40</td>
                              <td className="p-2">49</td>
                              <td className="p-2">Pass</td>
                            </tr>
                            <tr className="border-t">
                              <td className="p-2">F</td>
                              <td className="p-2">0</td>
                              <td className="p-2">39</td>
                              <td className="p-2">Fail</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Passing Marks (%)</label>
                      <Input type="number" defaultValue="40" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Distinction Marks (%)</label>
                      <Input type="number" defaultValue="75" />
                    </div>
                  </div>
                  
                  <Button className="w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Save Grading System
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure application security settings and password policies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securitySettingsForm}>
                  <form onSubmit={securitySettingsForm.handleSubmit(onSecuritySettingsSubmit)} className="space-y-6">
                    <FormField
                      control={securitySettingsForm.control}
                      name="passwordPolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Policy</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select password policy" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="basic">Basic (Min. 8 characters)</SelectItem>
                              <SelectItem value="medium">Medium (Min. 8 chars, 1 uppercase, 1 number)</SelectItem>
                              <SelectItem value="strong">Strong (Min. 8 chars, 1 uppercase, 1 number, 1 special char)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Sets the complexity requirements for user passwords.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securitySettingsForm.control}
                      name="twoFactorAuth"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                            <FormDescription>
                              Require 2FA for admin and teacher accounts
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={securitySettingsForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Timeout (minutes)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timeout period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">60 minutes</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                                <SelectItem value="0">Never</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Time after which inactive users are logged out.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securitySettingsForm.control}
                        name="loginAttempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Failed Login Attempts</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select attempt limit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="3">3 attempts</SelectItem>
                                <SelectItem value="5">5 attempts</SelectItem>
                                <SelectItem value="10">10 attempts</SelectItem>
                                <SelectItem value="0">No limit</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Number of failed attempts before account lockout.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full sm:w-auto">
                      <Lock className="mr-2 h-4 w-4" />
                      Save Security Settings
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="h-5 w-5" />
                  Access Control
                </CardTitle>
                <CardDescription>
                  Manage role permissions and access levels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-muted/50">
                      <h3 className="font-medium">Role Permissions</h3>
                    </div>
                    <div className="overflow-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Feature</th>
                            <th className="text-center p-3 font-medium">Admin</th>
                            <th className="text-center p-3 font-medium">Teacher</th>
                            <th className="text-center p-3 font-medium">Student</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">User Management</td>
                            <td className="text-center p-3">✅</td>
                            <td className="text-center p-3">❌</td>
                            <td className="text-center p-3">❌</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Marks Management</td>
                            <td className="text-center p-3">✅</td>
                            <td className="text-center p-3">✅</td>
                            <td className="text-center p-3">❌</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">View Reports</td>
                            <td className="text-center p-3">✅</td>
                            <td className="text-center p-3">✅</td>
                            <td className="text-center p-3">✅</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Run Predictions</td>
                            <td className="text-center p-3">✅</td>
                            <td className="text-center p-3">✅</td>
                            <td className="text-center p-3">❌</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">System Settings</td>
                            <td className="text-center p-3">✅</td>
                            <td className="text-center p-3">❌</td>
                            <td className="text-center p-3">❌</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <Button className="w-full sm:w-auto">
                    <Key className="mr-2 h-4 w-4" />
                    Update Permissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>
                  Configure system-level settings and maintenance options.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...systemSettingsForm}>
                  <form onSubmit={systemSettingsForm.handleSubmit(onSystemSettingsSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={systemSettingsForm.control}
                        name="dataBackup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Backup Frequency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select backup frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How often the system data should be backed up.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={systemSettingsForm.control}
                        name="storageLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Storage Limit (GB)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select storage limit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="10">10 GB</SelectItem>
                                <SelectItem value="50">50 GB</SelectItem>
                                <SelectItem value="100">100 GB</SelectItem>
                                <SelectItem value="250">250 GB</SelectItem>
                                <SelectItem value="500">500 GB</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Maximum storage space for files and data.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={systemSettingsForm.control}
                      name="aiPredictionFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Prediction Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select prediction frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Bi-weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="manual">Manual only</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How often the AI prediction model runs automatically.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={systemSettingsForm.control}
                        name="debugMode"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Debug Mode</FormLabel>
                              <FormDescription>
                                Enable detailed logging and debug information
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={systemSettingsForm.control}
                        name="maintenanceMode"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Maintenance Mode</FormLabel>
                              <FormDescription>
                                Put system in maintenance mode (users will see a maintenance page)
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full sm:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Save System Settings
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup & Restore
                </CardTitle>
                <CardDescription>
                  Manage system backups and restoration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Backup System</h3>
                      <p className="text-sm text-muted-foreground">
                        Create a complete backup of the system including all data, settings, and configurations.
                      </p>
                      <Button 
                        className="w-full"
                        onClick={handleCreateBackup}
                        disabled={backupInProgress}
                      >
                        {backupInProgress ? (
                          <>
                            <HardDrive className="mr-2 h-4 w-4 animate-pulse" />
                            Backing Up...
                          </>
                        ) : (
                          <>
                            <HardDrive className="mr-2 h-4 w-4" />
                            Create Backup
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Restore System</h3>
                      <p className="text-sm text-muted-foreground">
                        Restore the system from a previous backup. This will replace all current data.
                      </p>
                      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <Server className="mr-2 h-4 w-4" />
                            Restore from Backup
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm System Restore</DialogTitle>
                            <DialogDescription>
                              This will replace ALL current data with data from the selected backup.
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Select Backup</label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a backup" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="backup1">Backup - Apr 18, 2025 (Today)</SelectItem>
                                  <SelectItem value="backup2">Backup - Apr 17, 2025</SelectItem>
                                  <SelectItem value="backup3">Backup - Apr 16, 2025</SelectItem>
                                  <SelectItem value="backup4">Backup - Apr 15, 2025</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setRestoreDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={handleRestoreBackup}
                            >
                              Restore System
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg">
                    <div className="p-4 bg-muted/50">
                      <h3 className="font-medium">Recent Backups</h3>
                    </div>
                    <div className="overflow-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Backup Date</th>
                            <th className="text-left p-3 font-medium">Size</th>
                            <th className="text-left p-3 font-medium">Type</th>
                            <th className="text-left p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">Apr 18, 2025 (Today)</td>
                            <td className="p-3">1.2 GB</td>
                            <td className="p-3">Manual</td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Apr 17, 2025</td>
                            <td className="p-3">1.2 GB</td>
                            <td className="p-3">Automatic</td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Apr 16, 2025</td>
                            <td className="p-3">1.1 GB</td>
                            <td className="p-3">Automatic</td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3">Apr 15, 2025</td>
                            <td className="p-3">1.1 GB</td>
                            <td className="p-3">Automatic</td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure system-wide notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationSettingsForm}>
                  <form onSubmit={notificationSettingsForm.handleSubmit(onNotificationSettingsSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={notificationSettingsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Send system notifications via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationSettingsForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Push Notifications</FormLabel>
                              <FormDescription>
                                Send push notifications to browsers and mobile devices
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Notification Types</h3>
                      <div className="space-y-4">
                        <FormField
                          control={notificationSettingsForm.control}
                          name="adminAlerts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Admin Alerts</FormLabel>
                                <FormDescription>
                                  Important system notifications for administrators
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationSettingsForm.control}
                          name="lowPerformanceAlerts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Low Performance Alerts</FormLabel>
                                <FormDescription>
                                  Alert teachers about students with low performance
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationSettingsForm.control}
                          name="attendanceAlerts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Attendance Alerts</FormLabel>
                                <FormDescription>
                                  Alert teachers about students with low attendance
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationSettingsForm.control}
                          name="systemUpdates"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">System Updates</FormLabel>
                                <FormDescription>
                                  Notifications about system updates and maintenance
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full sm:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Save Notification Settings
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Templates
                </CardTitle>
                <CardDescription>
                  Customize email notification templates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template Type</label>
                    <Select defaultValue="welcome">
                      <SelectTrigger>
                        <SelectValue placeholder="Select template type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome Email</SelectItem>
                        <SelectItem value="password_reset">Password Reset</SelectItem>
                        <SelectItem value="mark_update">Mark Update</SelectItem>
                        <SelectItem value="attendance_alert">Attendance Alert</SelectItem>
                        <SelectItem value="system_notification">System Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input defaultValue="Welcome to EduPulse Learning Platform" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template Content</label>
                    <Textarea
                      rows={10}
                      defaultValue={`Dear {{NAME}},

Welcome to EduPulse Learning Platform! Your account has been successfully created.

Username: {{USERNAME}}
Temporary Password: {{PASSWORD}}

Please login and change your password on first login.

For any assistance, contact support@edupulseacademy.com

Best regards,
EduPulse Academy Team`}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {{NAME}}, {{USERNAME}}, {{PASSWORD}}, {{SCHOOL}}, {{DATE}}
                    </p>
                  </div>
                  
                  <Button className="w-full sm:w-auto">
                    <Zap className="mr-2 h-4 w-4" />
                    Test Template
                  </Button>
                  <Button className="w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Save Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
