import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  AlertCircle,
  Clock,
  Download,
  Edit,
  LogOut,
  LucideProps,
  Mail,
  MoreVertical,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Trash,
  User,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Upload, Search } from 'lucide-react';

// Form schemas
const generalSettingsSchema = z.object({
  schoolName: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal('')),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  markSubmissions: z.boolean(),
  studentRegistrations: z.boolean(),
  systemUpdates: z.boolean(),
  loginAlerts: z.boolean(),
});

const securitySettingsSchema = z.object({
  twoFactorAuth: z.boolean(),
  passwordExpiry: z.string(),
  failedAttempts: z.string(),
  sessionTimeout: z.string(),
});

const dataExportSchema = z.object({
  exportType: z.string(),
  dateRange: z.string(),
  includeStudents: z.boolean(),
  includeTeachers: z.boolean(),
  includeMarks: z.boolean(),
  includeAttendance: z.boolean(),
});

const AdminSettings = () => {
  const { toast } = useToast();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // User activity logs (mock data)
  const activityLogs = [
    { id: 1, user: 'Admin User', action: 'Updated system settings', timestamp: '2025-04-18 14:30:00' },
    { id: 2, user: 'Principal', action: 'Added new teacher', timestamp: '2025-04-18 11:15:00' },
    { id: 3, user: 'Admin Assistant', action: 'Generated reports', timestamp: '2025-04-17 16:45:00' },
    { id: 4, user: 'System', action: 'Backup completed', timestamp: '2025-04-17 01:00:00' },
    { id: 5, user: 'Admin User', action: 'Modified user permissions', timestamp: '2025-04-16 10:20:00' },
  ];
  
  // API integrations (mock data)
  const apiIntegrations = [
    { id: 1, name: 'SMS Gateway', status: 'Active', lastSync: '2025-04-18 12:00:00' },
    { id: 2, name: 'Payment Processor', status: 'Active', lastSync: '2025-04-18 10:30:00' },
    { id: 3, name: 'Email Service', status: 'Active', lastSync: '2025-04-18 09:15:00' },
    { id: 4, name: 'Cloud Storage', status: 'Inactive', lastSync: '2025-04-15 16:45:00' },
    { id: 5, name: 'AI Prediction API', status: 'Active', lastSync: '2025-04-18 11:00:00' },
  ];
  
  // Database backup schedule (mock data)
  const backupSchedule = [
    { id: 1, type: 'Full Backup', frequency: 'Daily', time: '01:00 AM', lastRun: '2025-04-18 01:00:00', status: 'Success' },
    { id: 2, type: 'Incremental Backup', frequency: 'Every 6 hours', time: 'Multiple', lastRun: '2025-04-18 12:00:00', status: 'Success' },
    { id: 3, type: 'Cloud Backup', frequency: 'Weekly', time: 'Sunday, 02:00 AM', lastRun: '2025-04-14 02:00:00', status: 'Success' },
  ];

  // Form hooks
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      schoolName: "EduPulse Academy",
      address: "123 Education Street, Knowledge City",
      email: "admin@edupulse.academy",
      phone: "1234567890",
      website: "https://edupulse.academy",
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationSettingsSchema>>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      markSubmissions: true,
      studentRegistrations: true,
      systemUpdates: true,
      loginAlerts: false,
    },
  });

  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      twoFactorAuth: false,
      passwordExpiry: "90",
      failedAttempts: "5",
      sessionTimeout: "30",
    },
  });

  const dataExportForm = useForm<z.infer<typeof dataExportSchema>>({
    resolver: zodResolver(dataExportSchema),
    defaultValues: {
      exportType: "excel",
      dateRange: "current",
      includeStudents: true,
      includeTeachers: true,
      includeMarks: true,
      includeAttendance: true,
    },
  });

  // Form submission handlers
  const onGeneralSubmit = (values: z.infer<typeof generalSettingsSchema>) => {
    toast({
      title: "General settings updated",
      description: "Your changes have been saved successfully.",
    });
    console.log(values);
  };

  const onNotificationSubmit = (values: z.infer<typeof notificationSettingsSchema>) => {
    toast({
      title: "Notification settings updated",
      description: "Your preferences have been saved successfully.",
    });
    console.log(values);
  };

  const onSecuritySubmit = (values: z.infer<typeof securitySettingsSchema>) => {
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved successfully.",
    });
    console.log(values);
  };

  const onDataExportSubmit = (values: z.infer<typeof dataExportSchema>) => {
    toast({
      title: "Data export started",
      description: "Your export is being prepared and will be available shortly.",
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your data export has been completed successfully.",
      });
    }, 2000);
    
    console.log(values);
  };

  // Run backup handler
  const handleRunBackup = (backupId: number) => {
    toast({
      title: "Backup started",
      description: "Your backup is in progress. This might take a few minutes.",
    });
    
    setTimeout(() => {
      toast({
        title: "Backup complete",
        description: "Your backup has been completed successfully.",
      });
    }, 3000);
  };

  // Sync API integration handler
  const handleSyncIntegration = (integrationId: number) => {
    toast({
      title: "Sync started",
      description: "Synchronization in progress. This might take a moment.",
    });
    
    setTimeout(() => {
      toast({
        title: "Sync complete",
        description: "API synchronization has been completed successfully.",
      });
    }, 2000);
  };

  // Import data handler
  const handleImportData = () => {
    setIsImportDialogOpen(false);
    
    toast({
      title: "Import started",
      description: "Your data import is in progress. This might take a few minutes.",
    });
    
    setTimeout(() => {
      toast({
        title: "Import complete",
        description: "Your data has been imported successfully.",
      });
    }, 3000);
  };

  // Download template handlers
  const handleDownloadTemplate = (templateType: string) => {
    toast({
      title: "Download started",
      description: `Your ${templateType} template is being prepared for download.`,
    });
    
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `Your ${templateType} template has been downloaded successfully.`,
      });
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">
              Configure and manage your EduPulse platform settings
            </p>
          </div>
        </div>

        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your school's basic information and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-4">
                    <FormField
                      control={generalForm.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The official name of your educational institution
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormDescription>
                            The physical address of your institution
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={generalForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Primary contact email
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={generalForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Primary contact phone number
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={generalForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Your institution's website URL
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="mt-4">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure which events trigger notifications in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Enable all email notifications for the system
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
                      control={notificationForm.control}
                      name="markSubmissions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Mark Submissions</FormLabel>
                            <FormDescription>
                              Notify when teachers submit new marks
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
                      control={notificationForm.control}
                      name="studentRegistrations"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Student Registrations</FormLabel>
                            <FormDescription>
                              Notify when new students are registered
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
                      control={notificationForm.control}
                      name="systemUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">System Updates</FormLabel>
                            <FormDescription>
                              Notify about system maintenance and updates
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
                      control={notificationForm.control}
                      name="loginAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Login Alerts</FormLabel>
                            <FormDescription>
                              Notify on suspicious login attempts
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
                    <Button type="submit" className="mt-4">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security options and user access policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                    <FormField
                      control={securityForm.control}
                      name="twoFactorAuth"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                            <FormDescription>
                              Require two-factor authentication for all admin users
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
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={securityForm.control}
                        name="passwordExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password Expiry (days)</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select days" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="60">60 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="180">180 days</SelectItem>
                                <SelectItem value="365">365 days</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How often users must change passwords
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="failedAttempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Failed Login Attempts</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select attempts" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="3">3 attempts</SelectItem>
                                <SelectItem value="5">5 attempts</SelectItem>
                                <SelectItem value="10">10 attempts</SelectItem>
                                <SelectItem value="unlimited">Unlimited</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Maximum failed login attempts before lockout
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Timeout (minutes)</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timeout" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">60 minutes</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                                <SelectItem value="240">4 hours</SelectItem>
                                <SelectItem value="480">8 hours</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Inactive session timeout period
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="mt-4">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Data Export</CardTitle>
                  <CardDescription>
                    Export your school data for backup or reporting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...dataExportForm}>
                    <form onSubmit={dataExportForm.handleSubmit(onDataExportSubmit)} className="space-y-4">
                      <FormField
                        control={dataExportForm.control}
                        name="exportType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Export Format</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="json">JSON</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose the format for your exported data
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={dataExportForm.control}
                        name="dateRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Range</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select date range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="current">Current Term</SelectItem>
                                <SelectItem value="last">Last Term</SelectItem>
                                <SelectItem value="year">Current Year</SelectItem>
                                <SelectItem value="all">All Time</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select the time period for your data export
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Include Data
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={dataExportForm.control}
                            name="includeStudents"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">Students</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={dataExportForm.control}
                            name="includeTeachers"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">Teachers</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={dataExportForm.control}
                            name="includeMarks"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">Marks</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={dataExportForm.control}
                            name="includeAttendance"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">Attendance</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="mt-4">
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data Import</CardTitle>
                  <CardDescription>
                    Import data into your EduPulse system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Import Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Import Data</DialogTitle>
                        <DialogDescription>
                          Upload a file to import data into the system. Make sure your file follows the required format.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium leading-none">
                              Import Type
                            </label>
                            <Select defaultValue="students">
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="students">Students</SelectItem>
                                <SelectItem value="teachers">Teachers</SelectItem>
                                <SelectItem value="marks">Marks</SelectItem>
                                <SelectItem value="attendance">Attendance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium leading-none">
                              File Format
                            </label>
                            <Select defaultValue="excel">
                              <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none">
                            Upload File
                          </label>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Excel or CSV file (max. 10MB)
                                </p>
                              </div>
                              <input type="file" className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleImportData}>
                          Import
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium leading-none">
                      Download Import Templates
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Use these templates to ensure your data is in the correct format for import
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadTemplate("Students")}>
                        <Download className="mr-2 h-4 w-4" />
                        Students Template
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadTemplate("Teachers")}>
                        <Download className="mr-2 h-4 w-4" />
                        Teachers Template
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadTemplate("Marks")}>
                        <Download className="mr-2 h-4 w-4" />
                        Marks Template
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadTemplate("Attendance")}>
                        <Download className="mr-2 h-4 w-4" />
                        Attendance Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Backup & Restore</CardTitle>
                  <CardDescription>
                    Manage system backups and database restoration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">Scheduled Backups</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Last Run</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {backupSchedule.map((backup) => (
                            <TableRow key={backup.id}>
                              <TableCell className="font-medium">{backup.type}</TableCell>
                              <TableCell>{backup.frequency}</TableCell>
                              <TableCell>{backup.time}</TableCell>
                              <TableCell>{backup.lastRun}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                  {backup.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRunBackup(backup.id)}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                  <span className="sr-only">Run Now</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Manual Backup
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Restore from Backup
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Restoring from a backup will overwrite all current data. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground">
                              Yes, Restore
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>API Integrations</CardTitle>
                <CardDescription>
                  Manage connections with external systems and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Connected Services</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Integration</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Sync</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {apiIntegrations.map((integration) => (
                          <TableRow key={integration.id}>
                            <TableCell className="font-medium">{integration.name}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                integration.status === 'Active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {integration.status}
                              </span>
                            </TableCell>
                            <TableCell>{integration.lastSync}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleSyncIntegration(integration.id)}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Sync Now
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Configure
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Disconnect
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button className="flex-1">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Integration
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>
                  View system activity and user actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search logs..."
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Log type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Logs</SelectItem>
                        <SelectItem value="user">User Actions</SelectItem>
                        <SelectItem value="system">System Events</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.id}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">View Details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-center">
                    <Button variant="outline">
                      Load More Logs
                    </Button>
                  </div>
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
