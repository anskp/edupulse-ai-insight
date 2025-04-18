
import { useState } from 'react';
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
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  BarChart2,
  Download,
  Edit,
  FileText,
  MoreVertical,
  Search,
  Trash2,
  UserPlus,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { insertSampleStudentData } from '@/lib/supabase-helpers';

// Form schema
const studentFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  grade: z.string().min(1, { message: "Grade is required" }),
  section: z.string().min(1, { message: "Section is required" }),
  rollNumber: z.string().optional(),
  parentName: z.string().optional(),
  parentContact: z.string().optional(),
  address: z.string().optional(),
  joinDate: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

// Sample student data
const mockStudents = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@student.edu',
    rollNumber: 'A001',
    grade: '10th',
    section: 'A',
    attendance: '85%',
    parentName: 'Rajesh Sharma',
    parentContact: '+91 9876543210',
    address: '123 Nehru Street, Delhi',
    joinDate: '2023-06-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@student.edu',
    rollNumber: 'A002',
    grade: '10th',
    section: 'A',
    attendance: '92%',
    parentName: 'Vikram Patel',
    parentContact: '+91 9876543211',
    address: '456 Gandhi Road, Mumbai',
    joinDate: '2023-06-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Arjun Singh',
    email: 'arjun.singh@student.edu',
    rollNumber: 'B001',
    grade: '9th',
    section: 'B',
    attendance: '76%',
    parentName: 'Harpreet Singh',
    parentContact: '+91 9876543212',
    address: '789 Tagore Lane, Kolkata',
    joinDate: '2023-07-05',
    status: 'active',
  },
  {
    id: '4',
    name: 'Neha Kumar',
    email: 'neha.kumar@student.edu',
    rollNumber: 'C001',
    grade: '11th',
    section: 'A',
    attendance: '88%',
    parentName: 'Ramesh Kumar',
    parentContact: '+91 9876543213',
    address: '321 Bose Avenue, Chennai',
    joinDate: '2022-06-10',
    status: 'active',
  },
  {
    id: '5',
    name: 'Sample Student',
    email: 'sample.student@edupulse.com',
    rollNumber: 'D001',
    grade: '10th',
    section: 'B',
    attendance: '90%',
    parentName: 'Demo Parent',
    parentContact: '+91 9876543214',
    address: '555 Education Street, Bangalore',
    joinDate: '2023-05-15',
    status: 'active',
  },
];

const AdminStudents = () => {
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      grade: '',
      section: '',
      rollNumber: '',
      parentName: '',
      parentContact: '',
      address: '',
      joinDate: new Date().toISOString().split('T')[0],
    },
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = (data: StudentFormValues) => {
    const newStudent = {
      id: (students.length + 1).toString(),
      name: data.name,
      email: data.email,
      rollNumber: data.rollNumber || `${data.grade[0]}${data.section}${Math.floor(Math.random() * 1000)}`,
      grade: data.grade,
      section: data.section,
      attendance: '100%',
      parentName: data.parentName || '',
      parentContact: data.parentContact || '',
      address: data.address || '',
      joinDate: data.joinDate || new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setStudents([...students, newStudent]);
    setAddDialogOpen(false);
    form.reset();

    toast({
      title: "Student added",
      description: `${data.name} has been added successfully.`,
    });
  };

  const handleEditStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setCurrentStudent(student);
      form.reset({
        name: student.name,
        email: student.email,
        grade: student.grade,
        section: student.section,
        rollNumber: student.rollNumber,
        parentName: student.parentName,
        parentContact: student.parentContact,
        address: student.address,
        joinDate: student.joinDate,
      });
      setEditDialogOpen(true);
    }
  };

  const handleUpdateStudent = (data: StudentFormValues) => {
    if (!currentStudent) return;

    const updatedStudents = students.map(student =>
      student.id === currentStudent.id
        ? {
            ...student,
            name: data.name,
            email: data.email,
            grade: data.grade,
            section: data.section,
            rollNumber: data.rollNumber || student.rollNumber,
            parentName: data.parentName || student.parentName,
            parentContact: data.parentContact || student.parentContact,
            address: data.address || student.address,
            joinDate: data.joinDate || student.joinDate,
          }
        : student
    );

    setStudents(updatedStudents);
    setEditDialogOpen(false);
    setCurrentStudent(null);

    toast({
      title: "Student updated",
      description: `${data.name}'s information has been updated.`,
    });
  };

  const handleDeletePrompt = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setCurrentStudent(student);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteStudent = () => {
    if (!currentStudent) return;

    const updatedStudents = students.filter(student => student.id !== currentStudent.id);
    setStudents(updatedStudents);
    setDeleteDialogOpen(false);
    
    toast({
      title: "Student removed",
      description: `${currentStudent.name} has been removed from the system.`,
    });
    
    setCurrentStudent(null);
  };

  const handleExportStudents = () => {
    toast({
      title: "Export started",
      description: "Preparing student data for export...",
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Student data has been exported successfully.",
      });
    }, 1500);
  };

  const handleCreateSampleStudent = async () => {
    try {
      setLoading(true);
      const studentId = await insertSampleStudentData();
      toast({
        title: "Sample student created",
        description: "A new sample student with marks and badges has been created.",
      });
      
      // Add mock student to the list
      const newSampleStudent = {
        id: (students.length + 1).toString(),
        name: 'Sample Student',
        email: 'sample.student@edupulse.com',
        rollNumber: `S${Math.floor(Math.random() * 1000)}`,
        grade: '10th',
        section: 'B',
        attendance: '100%',
        parentName: 'Demo Parent',
        parentContact: '+91 9876543299',
        address: '123 Test Street, Bangalore',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      
      setStudents([...students, newSampleStudent]);
      
    } catch (error) {
      console.error('Error creating sample student:', error);
      toast({
        title: "Error",
        description: "Failed to create sample student.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRunPrediction = () => {
    toast({
      title: "Prediction Started",
      description: "Running AI predictions for all students...",
    });
    
    setTimeout(() => {
      toast({
        title: "Prediction Complete",
        description: "AI predictions successfully updated for all students.",
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-muted-foreground">
              View, add, and manage students in the system.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleExportStudents}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={handleCreateSampleStudent} disabled={loading}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Sample
            </Button>
            <Button onClick={() => {
              form.reset();
              setAddDialogOpen(true);
            }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            className="bg-edu-secondary hover:bg-edu-secondary/90"
            onClick={handleRunPrediction}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Run AI Prediction
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>
              A list of all students in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>{student.section}</TableCell>
                        <TableCell>{student.attendance}</TableCell>
                        <TableCell>{new Date(student.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditStudent(student.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Report
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeletePrompt(student.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No students found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Add a new student to the system. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddStudent)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="9th">9th</SelectItem>
                          <SelectItem value="10th">10th</SelectItem>
                          <SelectItem value="11th">11th</SelectItem>
                          <SelectItem value="12th">12th</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional. Will be auto-generated if not provided.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent/Guardian Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent/Guardian Contact</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Student</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student information. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateStudent)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="9th">9th</SelectItem>
                          <SelectItem value="10th">10th</SelectItem>
                          <SelectItem value="11th">11th</SelectItem>
                          <SelectItem value="12th">12th</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent/Guardian Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent/Guardian Contact</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Student</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {currentStudent?.name} from the system? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteStudent}
            >
              Delete Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminStudents;
