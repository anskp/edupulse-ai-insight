
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChartCard from '@/components/dashboard/ChartCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Award,
  BarChart2,
  FileText,
  Mail,
  User,
} from 'lucide-react';

// Mock data
const studentData = {
  '1': {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@student.edu',
    attendance: '85%',
    grade: '10th',
    section: 'A',
    contact: '+91 9876543210',
    address: '123 Nehru Street, Delhi',
    parentName: 'Rajesh Sharma',
    parentContact: '+91 9876543211',
    joinedDate: '2023-06-15',
  },
  '2': {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@student.edu',
    attendance: '92%',
    grade: '11th',
    section: 'B',
    contact: '+91 9876543212',
    address: '456 Gandhi Road, Mumbai',
    parentName: 'Vikram Patel',
    parentContact: '+91 9876543213',
    joinedDate: '2022-07-10',
  },
  '3': {
    id: '3',
    name: 'Arjun Singh',
    email: 'arjun.singh@student.edu',
    attendance: '76%',
    grade: '9th',
    section: 'C',
    contact: '+91 9876543214',
    address: '789 Tagore Lane, Kolkata',
    parentName: 'Harpreet Singh',
    parentContact: '+91 9876543215',
    joinedDate: '2023-08-05',
  },
  '4': {
    id: '4',
    name: 'Neha Kumar',
    email: 'neha.kumar@student.edu',
    attendance: '88%',
    grade: '12th',
    section: 'A',
    contact: '+91 9876543216',
    address: '321 Bose Avenue, Chennai',
    parentName: 'Ramesh Kumar',
    parentContact: '+91 9876543217',
    joinedDate: '2021-06-22',
  },
  '5': {
    id: '5',
    name: 'Sample Student',
    email: 'sample.student@edupulse.com',
    attendance: '90%',
    grade: '10th',
    section: 'B',
    contact: '+91 9876543218',
    address: '555 Education Street, Bangalore',
    parentName: 'Demo Parent',
    parentContact: '+91 9876543219',
    joinedDate: '2023-01-15',
  },
};

const marksData = [
  { subject: 'Mathematics', internal1: 85, internal2: 88, midTerm: 82, preFinal: 90, predicted: 92 },
  { subject: 'Science', internal1: 78, internal2: 82, midTerm: 75, preFinal: 80, predicted: 83 },
  { subject: 'History', internal1: 72, internal2: 68, midTerm: 70, preFinal: 75, predicted: 78 },
  { subject: 'English', internal1: 90, internal2: 92, midTerm: 88, preFinal: 95, predicted: 94 },
  { subject: 'Computer Science', internal1: 95, internal2: 92, midTerm: 90, preFinal: 98, predicted: 96 },
];

const progressData = [
  { name: 'Term 1', Mathematics: 78, Science: 72, English: 85, History: 68, Computer: 90 },
  { name: 'Term 2', Mathematics: 82, Science: 75, English: 88, History: 70, Computer: 92 },
  { name: 'Term 3', Mathematics: 85, Science: 78, English: 90, History: 72, Computer: 94 },
  { name: 'Term 4', Mathematics: 88, Science: 82, English: 92, History: 76, Computer: 96 },
];

const badgesData = [
  { name: 'Perfect Attendance', description: 'Never missed a class all semester', date: '2023-09-15' },
  { name: 'Math Star', description: 'Outstanding performance in Mathematics', date: '2023-10-10' },
  { name: 'Science Explorer', description: 'Top performer in Science projects', date: '2023-11-05' },
];

const TeacherStudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const student = studentData[id as keyof typeof studentData];

  if (!student) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-2xl font-bold mb-4">Student not found</h2>
          <Button variant="outline" onClick={() => navigate('/teacher/students')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleRunPrediction = () => {
    toast({
      title: "Running prediction",
      description: `Updating prediction for ${student.name}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Prediction complete",
        description: "Student performance prediction has been updated.",
      });
    }, 2000);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Generating report",
      description: "Preparing comprehensive report for the student...",
    });
    
    setTimeout(() => {
      toast({
        title: "Report generated",
        description: "Student report has been created and is ready for download.",
      });
    }, 2500);
  };

  const handleEmailStudent = () => {
    toast({
      title: "Email initiated",
      description: `Composing email to ${student.name}...`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate('/teacher/students')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">{student.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEmailStudent}>
              <Mail className="mr-2 h-4 w-4" />
              Email Student
            </Button>
            <Button variant="outline" onClick={handleGenerateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button className="bg-edu-secondary hover:bg-edu-secondary/90" onClick={handleRunPrediction}>
              <BarChart2 className="mr-2 h-4 w-4" />
              Run Prediction
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="marks">Academic Marks</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Email:</dt>
                      <dd>{student.email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Grade:</dt>
                      <dd>{student.grade}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Section:</dt>
                      <dd>{student.section}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Attendance:</dt>
                      <dd>{student.attendance}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Contact:</dt>
                      <dd>{student.contact}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Address:</dt>
                      <dd className="text-right">{student.address}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parent Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Name:</dt>
                      <dd>{student.parentName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Contact:</dt>
                      <dd>{student.parentContact}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Joined:</dt>
                      <dd>{new Date(student.joinedDate).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Overall Grade:</dt>
                      <dd className="text-green-600 font-semibold">A</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Rank:</dt>
                      <dd>5 / 30</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Student's academic performance across subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartCard 
                    title=""
                    description=""
                    type="bar"
                    data={[
                      { subject: 'Mathematics', actual: 88, predicted: 92 },
                      { subject: 'Science', actual: 82, predicted: 85 },
                      { subject: 'History', actual: 75, predicted: 78 },
                      { subject: 'English', actual: 92, predicted: 94 },
                      { subject: 'Computer', actual: 95, predicted: 96 },
                    ]}
                    series={[
                      { name: 'Current Marks', dataKey: 'actual', color: '#4F46E5' },
                      { name: 'Predicted Marks', dataKey: 'predicted', color: '#10B981' },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marks" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Marks</CardTitle>
                <CardDescription>
                  Detailed view of marks across all subjects and assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Internal 1</TableHead>
                      <TableHead>Internal 2</TableHead>
                      <TableHead>Mid Term</TableHead>
                      <TableHead>Pre-Final</TableHead>
                      <TableHead>Predicted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marksData.map((mark, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{mark.subject}</TableCell>
                        <TableCell>{mark.internal1}</TableCell>
                        <TableCell>{mark.internal2}</TableCell>
                        <TableCell>{mark.midTerm}</TableCell>
                        <TableCell>{mark.preFinal}</TableCell>
                        <TableCell className="font-medium text-green-600">{mark.predicted}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>
                  Performance trends across terms for all subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartCard 
                    title=""
                    description=""
                    type="line"
                    data={progressData}
                    series={[
                      { name: 'Mathematics', dataKey: 'Mathematics', color: '#4F46E5' },
                      { name: 'Science', dataKey: 'Science', color: '#10B981' },
                      { name: 'English', dataKey: 'English', color: '#F59E0B' },
                      { name: 'History', dataKey: 'History', color: '#EF4444' },
                      { name: 'Computer', dataKey: 'Computer', color: '#8B5CF6' },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Achievements</CardTitle>
                <CardDescription>
                  Badges and awards earned by the student
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {badgesData.map((badge, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-primary/10 p-3 rounded-full mb-4">
                            <Award className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Awarded on {new Date(badge.date).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudentDetail;
