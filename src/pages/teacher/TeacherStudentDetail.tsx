
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ArrowLeft, BarChart2, Calendar, Download, Mail, MapPin, Phone, User } from 'lucide-react';
import { generateRandomStudentData } from '@/lib/supabase-helpers';
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
    // Simulate fetching student data
    const fetchStudent = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, let's create a mock student based on the ID
        const students = generateRandomStudentData(20);
        const studentIndex = parseInt(id || '1', 10) % students.length;
        const studentData = students[studentIndex];
        
        // Simulate API delay
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

  // Prepare chart data from student's subject performance
  const subjectPerformanceData: ChartData[] = student?.subjectPerformance.map(subject => ({
    name: subject.subject,
    actual: (subject.internal1 + subject.internal2 + subject.midTerm + subject.preFinal) / 4,
    predicted: subject.predicted
  })) || [];

  // Attendance data for the past months (mock data)
  const attendanceData = [
    { name: 'Jan', attendance: 92 },
    { name: 'Feb', attendance: 88 },
    { name: 'Mar', attendance: 95 },
    { name: 'Apr', attendance: student?.attendance.replace('%', '') },
  ];

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
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-2 mb-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">{student.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{`Class ${student.grade}${student.section}`}</Badge>
                  <Badge variant="outline">Roll #{student.rollNumber}</Badge>
                </div>
                <Badge className={`${
                  student.status === 'active' 
                    ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                    : 'bg-red-100 text-red-800 hover:bg-red-100'
                }`}>
                  {student.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{student.phone || 'Not available'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{student.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined: {student.joinDate}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Parent/Guardian</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{student.parentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{student.parentContact}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Attendance</h3>
                <div className="flex items-center justify-between">
                  <span>Current Term</span>
                  <span className={`font-semibold ${
                    parseInt(student.attendance) >= 90 
                      ? 'text-green-600' 
                      : parseInt(student.attendance) >= 75 
                        ? 'text-amber-600' 
                        : 'text-red-600'
                  }`}>
                    {student.attendance}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 pt-4">
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

          <Card className="md:col-span-2">
            <CardHeader className="pb-0">
              <Tabs defaultValue="performance">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="performance" className="space-y-4 pt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={subjectPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="actual" name="Current Average" fill="#4F46E5" />
                        <Bar dataKey="predicted" name="Predicted Final" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Class Rank</p>
                      <p className="text-2xl font-semibold">5th</p>
                      <p className="text-xs text-muted-foreground">Top 15%</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Overall Average</p>
                      <p className="text-2xl font-semibold">
                        {Math.round(student.subjectPerformance.reduce((sum, subject) => 
                          sum + (subject.internal1 + subject.internal2 + subject.midTerm + subject.preFinal) / 4, 0
                        ) / student.subjectPerformance.length)}%
                      </p>
                      <p className="text-xs text-green-600">↑ 3% from last term</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Predicted Average</p>
                      <p className="text-2xl font-semibold">
                        {Math.round(student.subjectPerformance.reduce((sum, subject) => 
                          sum + subject.predicted, 0
                        ) / student.subjectPerformance.length)}%
                      </p>
                      <p className="text-xs text-green-600">↑ 5% from current</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="assessment" className="space-y-4 pt-4">
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Internal 1</TableHead>
                          <TableHead>Internal 2</TableHead>
                          <TableHead>Mid Term</TableHead>
                          <TableHead>Pre-Final</TableHead>
                          <TableHead>Current Avg</TableHead>
                          <TableHead>Predicted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {student.subjectPerformance.map((subject, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{subject.subject}</TableCell>
                            <TableCell>{subject.internal1}</TableCell>
                            <TableCell>{subject.internal2}</TableCell>
                            <TableCell>{subject.midTerm}</TableCell>
                            <TableCell>{subject.preFinal}</TableCell>
                            <TableCell>
                              {Math.round((subject.internal1 + subject.internal2 + subject.midTerm + subject.preFinal) / 4)}
                            </TableCell>
                            <TableCell className="font-semibold text-green-600">
                              {subject.predicted}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[50, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#4F46E5" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="risk" className="space-y-4 pt-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">Risk Assessment</h3>
                        <p className="text-sm text-muted-foreground">
                          Analysis of student's academic risk factors
                        </p>
                      </div>
                      <Badge className={`text-base py-1 ${
                        student.risk === 'Low' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                          : student.risk === 'Medium'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                            : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }`}>
                        {student.risk} Risk
                      </Badge>
                    </div>
                  </div>
                  
                  {student.riskFactors.length > 0 && student.riskFactors[0] !== 'None' ? (
                    <div className="space-y-3">
                      <h3 className="font-medium">Risk Factors:</h3>
                      {student.riskFactors.map((factor, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-start gap-2">
                            <div className="rounded-full bg-red-100 p-1 mt-0.5">
                              <AlertCircle className="h-3 w-3 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium">{factor}</p>
                              <p className="text-sm text-muted-foreground">
                                {factor.includes('attendance') 
                                  ? 'Poor attendance is correlated with lower academic performance. Consider discussing attendance improvement strategies.' 
                                  : factor.includes('internal') 
                                    ? 'Low internal marks indicate potential gaps in understanding core concepts. Consider additional support in these areas.'
                                    : 'Declining performance may indicate learning difficulties or external factors affecting studies. A personalized approach may be needed.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="p-4 border rounded-lg mt-4">
                        <h3 className="font-medium mb-2">Recommended Interventions:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-green-100 p-1 mt-0.5">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            </div>
                            <span>Schedule a parent-teacher meeting to discuss performance concerns.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-green-100 p-1 mt-0.5">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            </div>
                            <span>Provide additional resources for subjects with lower performance.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-green-100 p-1 mt-0.5">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            </div>
                            <span>Assign a peer mentor to support academic improvement.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-green-100 p-1 mt-0.5">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            </div>
                            <span>Weekly progress checks to monitor improvement.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border rounded-lg text-center">
                      <div className="rounded-full bg-green-100 p-3 mx-auto mb-3 w-fit">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">No Risk Factors Detected</h3>
                      <p className="text-muted-foreground">
                        This student is performing well across all academic indicators with no significant risk factors identified.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardHeader>
            <CardContent>
              {/* Additional content can be added here if needed */}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Add missing import
import { CheckCircle } from 'lucide-react';

export default TeacherStudentDetail;
