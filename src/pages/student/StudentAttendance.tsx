
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
import { AttendanceSummaryCard } from '@/components/attendance/AttendanceSummary';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { AttendanceRecord } from '@/types/chart';

// Sample data
const sampleRecords: AttendanceRecord[] = [
  { id: '1', date: '2025-04-15', course_code: 'CS-101', status: 'present', reason: null },
  { id: '2', date: '2025-04-14', course_code: 'MTH-201', status: 'present', reason: null },
  { id: '3', date: '2025-04-13', course_code: 'PHY-101', status: 'absent', reason: 'Medical leave' },
  { id: '4', date: '2025-04-12', course_code: 'CS-102', status: 'late', reason: 'Traffic delay' },
  { id: '5', date: '2025-04-11', course_code: 'ENG-101', status: 'present', reason: null },
  { id: '6', date: '2025-04-10', course_code: 'CS-101', status: 'present', reason: null },
  { id: '7', date: '2025-04-09', course_code: 'MTH-201', status: 'excused', reason: 'College event' },
];

const sampleSummary = {
  course_code: 'Engineering',
  semester: 4,
  total_classes: 90,
  present_count: 78,
  absent_count: 5,
  late_count: 7,
  excused_count: 0,
  attendance_percentage: 87
};

const StudentAttendance = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Attendance</h1>
            <p className="text-muted-foreground">
              View your attendance records and summary
            </p>
          </div>
          <ThemeSwitcher />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="overview">Attendance Overview</TabsTrigger>
            <TabsTrigger value="details">Attendance Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <AttendanceSummaryCard summary={sampleSummary} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Attendance</CardTitle>
                  <CardDescription>
                    Your attendance in the last 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AttendanceTable records={sampleRecords.slice(0, 5)} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>
                  View your detailed attendance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTable records={sampleRecords} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Attendance</CardTitle>
            <CardDescription>
              View today's attendance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceMarking readOnly={true} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
