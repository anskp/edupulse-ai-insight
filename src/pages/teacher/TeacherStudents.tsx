
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart2, Download, FileText, MoreVertical, Search, UserPlus } from 'lucide-react';
import { insertSampleStudentData } from '@/lib/supabase-helpers';

interface Student {
  id: string;
  name: string;
  email: string;
  attendance: string;
  internal_avg: number;
  predicted: number | null;
}

const TeacherStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  // Mocked function until you have real student data
  const fetchStudents = async () => {
    setLoading(true);
    
    // For now, let's create some mock student data for the demo
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@student.edu',
        attendance: '85%',
        internal_avg: 78,
        predicted: 82,
      },
      {
        id: '2',
        name: 'Priya Patel',
        email: 'priya.patel@student.edu',
        attendance: '92%',
        internal_avg: 86,
        predicted: 89,
      },
      {
        id: '3',
        name: 'Arjun Singh',
        email: 'arjun.singh@student.edu',
        attendance: '76%',
        internal_avg: 65,
        predicted: 68,
      },
      {
        id: '4',
        name: 'Neha Kumar',
        email: 'neha.kumar@student.edu',
        attendance: '88%',
        internal_avg: 72,
        predicted: 76,
      },
      {
        id: '5',
        name: 'Sample Student',
        email: 'sample.student@edupulse.com',
        attendance: '90%',
        internal_avg: 81,
        predicted: 85,
      },
    ];
    
    setStudents(mockStudents);
    setLoading(false);
  };

  const handleCreateSampleStudent = async () => {
    try {
      setLoading(true);
      const studentId = await insertSampleStudentData();
      toast({
        title: "Sample student data created",
        description: "A new student with marks and badges has been created for testing.",
      });
      fetchStudents();
    } catch (error) {
      console.error('Error creating sample student:', error);
      toast({
        title: "Error",
        description: "Failed to create sample student data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePredictMarks = () => {
    toast({
      title: "Prediction Started",
      description: "Running AI predictions for selected students...",
    });
    
    setTimeout(() => {
      toast({
        title: "Prediction Complete",
        description: "AI predictions successfully updated.",
      });
      
      // Update students with new predictions
      setStudents(students.map(student => ({
        ...student,
        predicted: Math.min(100, Math.floor(student.internal_avg * 1.05))
      })));
    }, 2000);
  };

  const handleViewDetails = (studentId: string) => {
    navigate(`/teacher/students/${studentId}`);
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Preparing student data for export...",
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Student data has been exported successfully.",
      });
    }, 1500);
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-muted-foreground">
              View, manage, and predict performance for your students.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleCreateSampleStudent}
              disabled={loading}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create Sample Student
            </Button>
            <Button 
              className="bg-edu-secondary hover:bg-edu-secondary/90" 
              onClick={handlePredictMarks}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Run AI Prediction
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>
              View and manage all students in your classes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Internal Avg</TableHead>
                    <TableHead>Predicted Final</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.attendance}</TableCell>
                        <TableCell>{student.internal_avg}</TableCell>
                        <TableCell>
                          <span className={`${
                            student.predicted && student.predicted > 80 
                              ? 'text-green-600' 
                              : student.predicted && student.predicted > 60 
                                ? 'text-yellow-600' 
                                : 'text-red-600'
                          }`}>
                            {student.predicted || 'Not predicted'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(student.id)}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handlePredictMarks}>
                                <BarChart2 className="mr-2 h-4 w-4" />
                                Predict Marks
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        {loading ? "Loading students..." : "No students found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudents;
