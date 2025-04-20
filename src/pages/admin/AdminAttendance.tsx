
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleBasedAttendance } from '@/components/attendance/RoleBasedAttendance';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Download } from 'lucide-react';

const AdminAttendance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const handleExportAttendance = () => {
    toast({
      title: "Exporting attendance",
      description: "Preparing attendance data for export...",
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Attendance data has been exported to CSV.",
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Attendance Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage attendance across all semesters and departments
            </p>
          </div>
          <div className="flex gap-2">
            <ThemeSwitcher />
            <Button variant="outline" onClick={handleExportAttendance}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[500px] grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="manage">Manage Attendance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Attendance Rate
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.4%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.3% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Students Below 75%
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    -3 from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Classes Conducted Today
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground">
                    All attendance marked
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Department-wise Attendance</CardTitle>
                <CardDescription>
                  Attendance percentages across different departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'].map(dept => {
                    const percentage = Math.floor(Math.random() * 15) + 80; // Random between 80-95%
                    
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{dept}</p>
                          <p className="text-sm text-muted-foreground">
                            {percentage}% attendance rate
                          </p>
                        </div>
                        <div className="w-[30%] h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              percentage >= 90 ? 'bg-green-500' : 
                              percentage >= 75 ? 'bg-blue-500' : 
                              'bg-amber-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage" className="mt-4">
            <RoleBasedAttendance />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
                <CardDescription>
                  Generate and download attendance reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="py-4">
                  Select criteria below to generate attendance reports for students, semesters, or departments.
                </p>
                <div className="flex justify-end">
                  <Button onClick={handleExportAttendance}>
                    Generate Report
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

export default AdminAttendance;
