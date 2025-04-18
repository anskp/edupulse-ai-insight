
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Filter, Pencil, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Science" },
  { id: 3, name: "History" },
  { id: 4, name: "English" },
  { id: 5, name: "Computer Science" },
];

const classes = [
  { id: 1, name: "Class 9A" },
  { id: 2, name: "Class 9B" },
  { id: 3, name: "Class 10A" },
  { id: 4, name: "Class 10B" },
  { id: 5, name: "Class 11A" },
  { id: 6, name: "Class 11B" },
  { id: 7, name: "Class 12A" },
  { id: 8, name: "Class 12B" },
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

const TeacherMarks = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
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
    if (selectedClass && selectedSubject && selectedTerm) {
      fetchStudentMarks();
    }
  }, [selectedClass, selectedSubject, selectedTerm]);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Student Marks</h1>
          <div className="flex gap-2">
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
              Select class, subject, and term to view student marks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select 
                  onValueChange={setSelectedClass} 
                  value={selectedClass}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
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
              {selectedClass && selectedSubject && selectedTerm 
                ? `Showing marks for ${classes.find(c => c.id.toString() === selectedClass)?.name}, 
                  ${subjects.find(s => s.id.toString() === selectedSubject)?.name}, 
                  ${terms.find(t => t.id.toString() === selectedTerm)?.name}`
                : "Select class, subject, and term to view student marks"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : selectedClass && selectedSubject && selectedTerm ? (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Internal 1</TableHead>
                      <TableHead>Internal 2</TableHead>
                      <TableHead>Mid Term</TableHead>
                      <TableHead>Pre-Final</TableHead>
                      <TableHead>Predicted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
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
                Please select a class, subject, and term to view student marks.
              </div>
            )}
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
                      <FormLabel>Mid Term</FormLabel>
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
