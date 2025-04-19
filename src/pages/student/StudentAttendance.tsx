
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceMarking } from '@/components/attendance/AttendanceMarking';
import { AttendanceSummaryCard } from '@/components/attendance/AttendanceSummary';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { AttendanceRecord } from '@/types/chart';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useAuthStore } from '@/store/auth-store';

// Sample data
const sampleRecords: AttendanceRecord[] = [
  { id: '1', date: '2025-04-15', course_code: 'CS-101', status: 'present', reason: null, student_id: '1', semester: 1, academic_year: '2024-25' },
  { id: '2', date: '2025-04-14', course_code: 'MTH-201', status: 'present', reason: null, student_id: '1', semester: 1, academic_year: '2024-25' },
  { id: '3', date: '2025-04-13', course_code: 'PHY-101', status: 'absent', reason: 'Medical leave', student_id: '1', semester: 1, academic_year: '2024-25' },
  { id: '4', date: '2025-04-12', course_code: 'CS-102', status: 'late', reason: 'Traffic delay', student_id: '1', semester: 1, academic_year: '2024-25' },
  { id: '5', date: '2025-04-11', course_code: 'ENG-101', status: 'present', reason: null, student_id: '1', semester: 1, academic_year: '2024-25' },
  { id: '6', date: '2025-04-10', course_code: 'CS-101', status: 'present', reason: null, student_id: '1', semester: 1, academic_year: '2024-25' },
  { id: '7', date: '2025-04-09', course_code: 'MTH-201', status: 'excused', reason: 'College event', student_id: '1', semester: 1, academic_year: '2024-25' },
];

const sampleSummary = {
  course_code: 'Engineering',
  semester: 4,
  total_classes: 90,
  present_count: 78,
  absent_count: 5,
  late_count: 7,
  excused_count: 0,
  attendance_percentage: 87,
  student_id: '1',
  academic_year: '2024-25'
};

// Sample subjects for the current semester
const subjectsList = [
  { id: 'CS-101', name: 'Data Structures' },
  { id: 'MTH-201', name: 'Engineering Mathematics' },
  { id: 'PHY-101', name: 'Engineering Physics' },
  { id: 'CS-102', name: 'Computer Networks' },
  { id: 'ENG-101', name: 'Technical Writing' },
];

// Sample semester list
const semestersList = [
  { id: 1, name: '1st Semester' },
  { id: 2, name: '2nd Semester' },
  { id: 3, name: '3rd Semester' },
  { id: 4, name: '4th Semester' },
  { id: 5, name: '5th Semester' },
  { id: 6, name: '6th Semester' },
  { id: 7, name: '7th Semester' },
  { id: 8, name: '8th Semester' },
];

const StudentAttendance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('4');
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>(sampleRecords);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const { theme } = useAuthStore();

  useEffect(() => {
    // Filter records based on selected subject
    if (selectedSubject) {
      setFilteredRecords(sampleRecords.filter(record => record.course_code === selectedSubject));
    } else {
      setFilteredRecords(sampleRecords);
    }
  }, [selectedSubject]);

  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Present', value: sampleSummary.present_count, color: '#10b981' },
    { name: 'Absent', value: sampleSummary.absent_count, color: '#ef4444' },
    { name: 'Late', value: sampleSummary.late_count, color: '#f59e0b' },
    { name: 'Excused', value: sampleSummary.excused_count, color: '#6366f1' },
  ];

  // Theme-based styling for specific themes
  const getThemeStyles = () => {
    switch (theme) {
      case 'car':
        return {
          cardBg: 'bg-gradient-to-br from-blue-900 to-blue-800',
          textColor: 'text-white',
          chartColors: ['#34d399', '#f87171', '#fbbf24', '#93c5fd'],
        };
      case 'onepiece':
        return {
          cardBg: 'bg-gradient-to-br from-red-600 to-yellow-500',
          textColor: 'text-white',
          chartColors: ['#34d399', '#f87171', '#fbbf24', '#93c5fd'],
        };
      case 'robotic':
        return {
          cardBg: 'bg-gradient-to-br from-gray-900 to-gray-800',
          textColor: 'text-green-400',
          chartColors: ['#10b981', '#f43f5e', '#eab308', '#6366f1'],
        };
      case 'mathematics':
        return {
          cardBg: 'bg-gradient-to-br from-green-700 to-green-600',
          textColor: 'text-white',
          chartColors: ['#a3e635', '#f87171', '#fbbf24', '#93c5fd'],
        };
      case 'moana':
        return {
          cardBg: 'bg-gradient-to-br from-blue-500 to-cyan-400',
          textColor: 'text-white',
          chartColors: ['#06b6d4', '#f87171', '#fbbf24', '#93c5fd'],
        };
      case 'flower':
        return {
          cardBg: 'bg-gradient-to-br from-pink-500 to-rose-400',
          textColor: 'text-white',
          chartColors: ['#ec4899', '#f87171', '#fbbf24', '#93c5fd'],
        };
      default:
        return {
          cardBg: '',
          textColor: '',
          chartColors: ['#10b981', '#ef4444', '#f59e0b', '#6366f1'],
        };
    }
  };

  const themeStyles = getThemeStyles();

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

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-[200px]">
            <Select 
              value={selectedSemester} 
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semestersList.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id.toString()}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-[250px]">
            <Select 
              value={selectedSubject} 
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {subjectsList.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="overview">Attendance Overview</TabsTrigger>
            <TabsTrigger value="details">Attendance Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <AttendanceSummaryCard summary={sampleSummary} />
              
              <Card className={themeStyles.cardBg}>
                <CardHeader>
                  <CardTitle className={themeStyles.textColor}>Attendance Distribution</CardTitle>
                  <CardDescription className={`${themeStyles.textColor} opacity-80`}>
                    Your attendance breakdown by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={themeStyles.chartColors[index] || entry.color} 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Attendance</CardTitle>
                  <CardDescription>
                    Your attendance in the last 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AttendanceTable records={filteredRecords.slice(0, 5)} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Attendance</CardTitle>
                  <CardDescription>
                    Your attendance percentage by subject
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjectsList.map(subject => {
                      const subjectRecords = sampleRecords.filter(r => r.course_code === subject.id);
                      const totalClasses = subjectRecords.length;
                      const presentClasses = subjectRecords.filter(r => r.status === 'present').length;
                      const percentage = totalClasses ? Math.round((presentClasses / totalClasses) * 100) : 0;
                      
                      return (
                        <div key={subject.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-sm text-muted-foreground">{subject.id}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-[150px] h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  percentage >= 75 ? 'bg-green-500' : 
                                  percentage >= 60 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${
                              percentage >= 75 ? 'text-green-600' : 
                              percentage >= 60 ? 'text-yellow-600' : 
                              'text-red-600'
                            }`}>
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                  {selectedSubject && ` for ${subjectsList.find(s => s.id === selectedSubject)?.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTable records={filteredRecords} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
            <CardDescription>
              Mark your attendance for today's classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <DatePicker date={selectedDate} setDate={setSelectedDate} />
              <Select defaultValue={subjectsList[0].id}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectsList.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                className="ml-auto"
                onClick={() => {
                  toast({
                    title: "Attendance Recorded",
                    description: "Your attendance has been marked as present for today.",
                  });
                }}
              >
                View Status
              </Button>
            </div>
            <AttendanceMarking readOnly={true} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
