
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart2, Download } from 'lucide-react';
import { generateRandomStudentData } from '@/lib/supabase-helpers';
import { StudentInfoCard } from '@/components/students/StudentInfoCard';
import { StudentPerformanceCharts } from '@/components/students/StudentPerformanceCharts';
import { StudentAssessmentTable } from '@/components/students/StudentAssessmentTable';
import { StudentRiskAnalysis } from '@/components/students/StudentRiskAnalysis';
import { ChartData } from '@/types/chart';

interface StudentDetail {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNumber: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  parentName: string;
  parentContact: string;
  attendance: string;
  status: string;
  subjectPerformance: {
    subject: string;
    internal1: number;
    internal2: number;
    midTerm: number;
    preFinal: number;
    predicted: number;
  }[];
  risk: string;
  riskFactors: string[];
}

const TeacherStudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const students = generateRandomStudentData(20);
        const studentIndex = parseInt(id || '1', 10) % students.length;
        const studentData = students[studentIndex];
        
        setTimeout(() => {
          setStudent(studentData as unknown as StudentDetail);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching student:', error);
        toast({
          title: "Error",
          description: "Failed to load student data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchStudent();
  }, [id, toast]);

  const handleGoBack = () => {
    navigate('/teacher/students');
  };

  const handleRunPrediction = () => {
    toast({
      title: "Running Prediction",
      description: "Analyzing student data to generate prediction...",
    });
    
    setTimeout(() => {
      toast({
        title: "Prediction Complete",
        description: "The student's predicted marks have been updated.",
      });
      
      if (student) {
        const updatedStudent = { ...student };
        updatedStudent.subjectPerformance = student.subjectPerformance.map(subject => ({
          ...subject,
          predicted: Math.min(100, Math.floor(subject.predicted * 1.02)),
        }));
        setStudent(updatedStudent);
      }
    }, 2000);
  };

  const handleDownloadReport = () => {
    toast({
      title: "Generating Report",
      description: "Preparing comprehensive student report...",
    });
    
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Student report has been downloaded successfully.",
      });
    }, 1500);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">Loading student data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-lg text-muted-foreground">Student not found</p>
          <Button onClick={handleGoBack}>Go Back to Students</Button>
        </div>
      </DashboardLayout>
    );
  }

  const subjectPerformanceData: ChartData[] = student.subjectPerformance.map(subject => ({
    name: subject.subject,
    actual: (subject.internal1 + subject.internal2 + subject.midTerm + subject.preFinal) / 4,
    predicted: subject.predicted
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Student Profile</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StudentInfoCard student={student} />

          <Card className="md:col-span-2">
            <CardHeader className="pb-0">
              <Tabs defaultValue="performance">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="performance" className="space-y-4 pt-4">
                  <StudentPerformanceCharts subjectPerformanceData={subjectPerformanceData} />
                </TabsContent>
                
                <TabsContent value="assessment" className="space-y-4 pt-4">
                  <StudentAssessmentTable subjectPerformance={student.subjectPerformance} />
                </TabsContent>
                
                <TabsContent value="risk" className="space-y-4 pt-4">
                  <StudentRiskAnalysis risk={student.risk} riskFactors={student.riskFactors} />
                </TabsContent>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mt-4">
                <Button onClick={handleRunPrediction} className="bg-edu-secondary hover:bg-edu-secondary/90">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Run AI Prediction
                </Button>
                <Button variant="outline" onClick={handleDownloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudentDetail;
