
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { GeminiChat } from '@/components/chatbot/GeminiChat';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Pencil, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { StudentAssessmentTable } from '@/components/students/StudentAssessmentTable';

// Form validation schema
const markFormSchema = z.object({
  internal1: z.coerce.number().min(0).max(100),
  internal2: z.coerce.number().min(0).max(100),
  midTerm: z.coerce.number().min(0).max(100),
  preFinal: z.coerce.number().min(0).max(100),
});

type MarkFormValues = z.infer<typeof markFormSchema>;

// Sample data
const subjects = [
  { id: 1, name: "Engineering Mathematics" },
  { id: 2, name: "Data Structures & Algorithms" },
  { id: 3, name: "Computer Organization" },
  { id: 4, name: "Database Management" },
  { id: 5, name: "Operating Systems" },
];

const departments = [
  { id: 1, name: "Computer Science" },
  { id: 2, name: "Electronics" },
  { id: 3, name: "Mechanical" },
  { id: 4, name: "Civil" },
  { id: 5, name: "Electrical" },
];

const semesters = [
  { id: 1, name: "1st Semester" },
  { id: 2, name: "2nd Semester" },
  { id: 3, name: "3rd Semester" },
  { id: 4, name: "4th Semester" },
  { id: 5, name: "5th Semester" },
  { id: 6, name: "6th Semester" },
  { id: 7, name: "7th Semester" },
  { id: 8, name: "8th Semester" },
];

const terms = [
  { id: 1, name: "Spring 2025" },
  { id: 2, name: "Summer 2025" },
  { id: 3, name: "Fall 2024" },
  { id: 4, name: "Winter 2024" },
];

interface Student {
  id: string;
  name: string;
  internal1: number;
  internal2: number;
  midTerm: number;
  preFinal: number;
  predicted: number | null;
}

interface SubjectPerformance {
  subject: string;
  internal1: number;
  internal2: number;
  midTerm: number;
  preFinal: number;
  predicted: number;
}

const sampleStudents: Student[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    internal1: 85,
    internal2: 88,
    midTerm: 82,
    preFinal: 90,
    predicted: 92,
  },
  {
    id: '2',
    name: 'Priya Patel',
    internal1: 78,
    internal2: 82,
    midTerm: 75,
    preFinal: 80,
    predicted: 83,
  },
  {
    id: '3',
    name: 'Arjun Singh',
    internal1: 72,
    internal2: 68,
    midTerm: 70,
    preFinal: 75,
    predicted: 78,
  },
  {
    id: '4',
    name: 'Neha Kumar',
    internal1: 90,
    internal2: 92,
    midTerm: 88,
    preFinal: 95,
    predicted: 94,
  },
  {
    id: '5',
    name: 'Sample Student',
    internal1: 95,
    internal2: 92,
    midTerm: 90,
    preFinal: 98,
    predicted: 96,
  },
];

const studentSubjectPerformance: SubjectPerformance[] = [
  {
    subject: "Engineering Mathematics",
    internal1: 85,
    internal2: 88,
    midTerm: 82,
    preFinal: 90,
    predicted: 92,
  },
  {
    subject: "Data Structures & Algorithms",
    internal1: 78,
    internal2: 82,
    midTerm: 75,
    preFinal: 80,
    predicted: 83,
  },
  {
    subject: "Computer Organization",
    internal1: 72,
    internal2: 68,
    midTerm: 70,
    preFinal: 75,
    predicted: 78,
  },
];

const TeacherMarks = () => {
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const { toast } = useToast();
  const { theme } = useAuthStore();
  
  const form = useForm<MarkFormValues>({
    resolver: zodResolver(markFormSchema),
    defaultValues: {
      internal1: 0,
      internal2: 0,
      midTerm: 0,
      preFinal: 0,
    },
  });

  useEffect(() => {
    if (selectedSemester && selectedSubject && selectedTerm) {
      fetchStudentMarks();
    }
  }, [selectedSemester, selectedSubject, selectedTerm, selectedDepartment]);

  const fetchStudentMarks = () => {
    setLoading(true);
    // Simulating API call delay
    setTimeout(() => {
      setStudents(sampleStudents);
      setLoading(false);
    }, 1000);
  };

  const handleEditMarks = (student: Student) => {
    setEditingStudent(student);
    form.reset({
      internal1: student.internal1,
      internal2: student.internal2,
      midTerm: student.midTerm,
      preFinal: student.preFinal,
    });
    setDialogOpen(true);
  };

  const onSubmit = (values: MarkFormValues) => {
    if (!editingStudent) return;
    
    toast({
      title: "Saving marks",
      description: "Updating student marks...",
    });
    
    // Simulate API call
    setTimeout(() => {
      // Update the local state
      setStudents(students.map(student => 
        student.id === editingStudent.id 
          ? { 
              ...student, 
              ...values, 
              // Simulate prediction update
              predicted: Math.round((values.internal1 + values.internal2 + values.midTerm + values.preFinal) / 4 * 1.05)
            } 
          : student
      ));
      
      setDialogOpen(false);
      
      toast({
        title: "Marks updated",
        description: `Marks for ${editingStudent.name} have been updated successfully.`,
      });
    }, 1000);
  };

  const handleExportMarks = () => {
    toast({
      title: "Exporting marks",
      description: "Preparing marks data for export...",
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Marks data has been exported to CSV.",
      });
    }, 1500);
  };

  const handleRunPredictions = () => {
    toast({
      title: "Running predictions",
      description: "Calculating grade predictions for all students...",
    });
    
    // Simulate prediction update
    setTimeout(() => {
      const updatedStudents = students.map(student => ({
        ...student,
        predicted: Math.round((student.internal1 + student.internal2 + student.midTerm + student.preFinal) / 4 * 1.05)
      }));
      
      setStudents(updatedStudents);
      
      toast({
        title: "Predictions complete",
        description: "Grade predictions have been updated for all students.",
      });
    }, 2000);
  };

  const handleUpdateScores = (subject: string, field: string, value: number) => {
    console.log(`Updating ${field} for ${subject} to ${value}`);
    // In a real application, you would update the state or call an API here
  };

  const getSelectedStudentData = () => {
    if (!selectedStudent) return null;
    return students.find(s => s.id === selectedStudent) || null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Student Marks</h1>
            <p className="text-muted-foreground">
              View and manage student assessments
            </p>
          </div>
          <div className="flex gap-2">
            <ThemeSwitcher />
            <Button variant="outline" onClick={handleExportMarks}>
              <Download className="mr-2 h-4 w-4" />
              Export Marks
            </Button>
            <Button 
              className="bg-edu-secondary hover:bg-edu-secondary/90"
              onClick={handleRunPredictions}
            >
              <Save className="mr-2 h-4 w-4" />
              Run Predictions
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Student Marks</CardTitle>
            <CardDescription>
              Select department, semester, subject, and term to view student marks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select 
                  onValueChange={setSelectedDepartment} 
                  value={selectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select 
                  onValueChange={setSelectedSemester} 
                  value={selectedSemester}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem.id} value={sem.id.toString()}>
                        {sem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select 
                  onValueChange={setSelectedSubject} 
                  value={selectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Term</Label>
                <Select 
                  onValueChange={setSelectedTerm} 
                  value={selectedTerm}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map((term) => (
                      <SelectItem key={term.id} value={term.id.toString()}>
                        {term.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Marks</CardTitle>
            <CardDescription>
              {selectedSemester && selectedSubject && selectedTerm 
                ? `Showing marks for ${departments.find(d => d.id.toString() === selectedDepartment)?.name || "All Departments"},
                  ${semesters.find(s => s.id.toString() === selectedSemester)?.name}, 
                  ${subjects.find(s => s.id.toString() === selectedSubject)?.name}, 
                  ${terms.find(t => t.id.toString() === selectedTerm)?.name}`
                : "Select department, semester, subject, and term to view student marks"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="students">All Students</TabsTrigger>
                <TabsTrigger value="student-detail" disabled={!selectedStudent}>Student Detail</TabsTrigger>
                <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
              </TabsList>
              
              <TabsContent value="students">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : selectedSemester && selectedSubject && selectedTerm ? (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Internal 1</TableHead>
                          <TableHead>Internal 2</TableHead>
                          <TableHead>Mid Semester</TableHead>
                          <TableHead>Pre-Final</TableHead>
                          <TableHead>Predicted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              <Button 
                                variant="link" 
                                onClick={() => setSelectedStudent(student.id)}
                                className="p-0 h-auto font-medium text-left"
                              >
                                {student.name}
                              </Button>
                            </TableCell>
                            <TableCell>{student.internal1}</TableCell>
                            <TableCell>{student.internal2}</TableCell>
                            <TableCell>{student.midTerm}</TableCell>
                            <TableCell>{student.preFinal}</TableCell>
                            <TableCell className="font-medium text-green-600">
                              {student.predicted || 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditMarks(student)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Please select department, semester, subject, and term to view student marks.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="student-detail">
                {selectedStudent && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">
                        {getSelectedStudentData()?.name} - Detailed Performance
                      </h3>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('students')}
                      >
                        Back to All Students
                      </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Current Average</h4>
                        <p className="text-2xl font-bold">
                          {getSelectedStudentData() && Math.round((
                            getSelectedStudentData()!.internal1 + 
                            getSelectedStudentData()!.internal2 + 
                            getSelectedStudentData()!.midTerm + 
                            getSelectedStudentData()!.preFinal) / 4)
                          }%
                        </p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Predicted Score</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {getSelectedStudentData()?.predicted}%
                        </p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Grade</h4>
                        <p className="text-2xl font-bold">
                          {getSelectedStudentData() && 
                            (getSelectedStudentData()!.predicted! >= 90 ? 'A+' :
                            getSelectedStudentData()!.predicted! >= 80 ? 'A' :
                            getSelectedStudentData()!.predicted! >= 70 ? 'B' :
                            getSelectedStudentData()!.predicted! >= 60 ? 'C' :
                            getSelectedStudentData()!.predicted! >= 50 ? 'D' : 'F')
                          }
                        </p>
                      </div>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Subject Performance</CardTitle>
                        <CardDescription>
                          View performance across different subjects
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <StudentAssessmentTable 
                          subjectPerformance={studentSubjectPerformance} 
                          editable={true}
                          onScoreUpdate={handleUpdateScores}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="assistant">
                <div className="h-[400px]">
                  <GeminiChat context="academics" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Student Marks</DialogTitle>
              <DialogDescription>
                {editingStudent && `Update marks for ${editingStudent.name}`}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="internal1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal 1</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="internal2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal 2</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="midTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mid Semester</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preFinal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pre-Final</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

// Component for form labels
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </label>
);

export default TeacherMarks;
