
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from '@/components/ui/use-toast';
import { Download } from 'lucide-react';
import { Mark, AttendanceRecord, AttendanceSummary } from '@/types/chart';
import { AttendanceSummaryCard } from '@/components/attendance/AttendanceSummary';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { PerformanceOverview } from '@/components/performance/PerformanceOverview';
import { AchievementsList } from '@/components/performance/AchievementsList';

interface Badge {
  id: string;
  student_id: string;
  name: string;
  description: string;
  achieved_at: string;
  image_url: string | null;
}

const StudentPerformance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [marks, setMarks] = useState<Mark[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchMarks(user.id);
      fetchBadges(user.id);
      fetchAttendance(user.id);
    }
  }, [user]);

  const fetchMarks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('marks')
        .select('*')
        .eq('student_id', userId);

      if (error) throw error;
      setMarks(data || []);
    } catch (error) {
      console.error("Error fetching marks:", error);
      toast({
        title: "Failed to fetch marks",
        description: "Unexpected error occurred while fetching your marks",
        variant: "destructive"
      });
    }
  };

  const fetchBadges = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('student_id', userId);

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error("Error fetching badges:", error);
      toast({
        title: "Error",
        description: "Failed to fetch achievements",
        variant: "destructive"
      });
    }
  };

  const fetchAttendance = async (userId: string) => {
    try {
      const { data: records, error: recordsError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', userId)
        .order('date', { ascending: false });

      if (recordsError) throw recordsError;
      setAttendanceRecords(records as AttendanceRecord[]);

      const { data: summary, error: summaryError } = await supabase
        .from('attendance_summary')
        .select('*')
        .eq('student_id', userId);

      if (summaryError) throw summaryError;
      setAttendanceSummary(summary || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance data",
        variant: "destructive"
      });
    }
  };

  const insertSampleData = async () => {
    if (!user) return;
    
    const sampleBadges = [
      {
        student_id: user.id,
        name: 'Perfect Attendance',
        description: 'Achieved 100% attendance for the term',
        achieved_at: new Date().toISOString(),
        image_url: null
      },
      {
        student_id: user.id,
        name: 'Math Wizard',
        description: 'Top performer in Mathematics',
        achieved_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        image_url: null
      },
      {
        student_id: user.id,
        name: 'Science Star',
        description: 'Excellence in Science projects',
        achieved_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        image_url: null
      }
    ];

    try {
      const { error: badgesError } = await supabase
        .from('badges')
        .insert(sampleBadges);

      if (badgesError) throw badgesError;
      
      await fetchBadges(user.id);
      
      toast({
        title: "Sample data added",
        description: "Sample achievements have been added to your profile.",
      });
    } catch (error) {
      console.error("Error inserting sample data:", error);
      toast({
        title: "Error",
        description: "Failed to insert sample data",
        variant: "destructive"
      });
    }
  };

  const downloadPerformanceReport = () => {
    toast({
      title: "Download Started",
      description: "Preparing your performance report..."
    });
    
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your performance report has been downloaded."
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Performance</h1>
            <p className="text-muted-foreground">
              Track your academic progress and achievements
            </p>
          </div>
          <div className="flex gap-2">
            {marks.length === 0 && badges.length === 0 && (
              <Button variant="outline" onClick={insertSampleData}>
                Load Sample Data
              </Button>
            )}
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={downloadPerformanceReport}
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <PerformanceOverview marks={marks} onInsertSampleData={insertSampleData} />
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {attendanceSummary.map((summary) => (
                <AttendanceSummaryCard key={summary.course_code} summary={summary} />
              ))}
            </div>
            <AttendanceTable records={attendanceRecords} />
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6">
            <AchievementsList badges={badges} onInsertSampleData={insertSampleData} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentPerformance;
