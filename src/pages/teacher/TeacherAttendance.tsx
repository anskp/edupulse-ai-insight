
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
import { AttendanceMarking } from '@/components/attendance/AttendanceMarking';
import { RoleBasedAttendance } from '@/components/attendance/RoleBasedAttendance';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';

const TeacherAttendance = () => {
  const [activeTab, setActiveTab] = useState('mark');
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
            <h1 className="text-3xl font-bold">Student Attendance</h1>
            <p className="text-muted-foreground">
              Mark and manage student attendance records
            </p>
          </div>
          <div className="flex gap-2">
            <ThemeSwitcher />
            <Button variant="outline" onClick={handleExportAttendance}>
              <Download className="h-4 w-4 mr-2" />
              Export Attendance
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
            <TabsTrigger value="history">Attendance History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mark" className="mt-4">
            <RoleBasedAttendance />
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>
                  View and export past attendance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceMarking readOnly={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherAttendance;
