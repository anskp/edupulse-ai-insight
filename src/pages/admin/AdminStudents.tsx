
import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
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
  semester: z.string().min(1, { message: "Semester is required" }),
  section: z.string().min(1, { message: "Section is required" }),
  department: z.string().min(1, { message: "Department is required" }),
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
    semester: '1st',
    section: 'A',
    department: 'Computer Science',
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
    semester: '1st',
    section: 'A',
    department: 'Computer Science',
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
    semester: '3rd',
    section: 'B',
    department: 'Electronics',
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
    semester: '5th',
    section: 'A',
    department: 'Mechanical',
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
    semester: '7th',
    section: 'B',
    department: 'Civil',
    attendance: '90%',
    parentName: 'Demo Parent',
    parentContact: '+91 9876543214',
    address: '555 Education Street, Bangalore',
    joinDate: '2023-05-15',
    status: 'active',
  },
];

// Departments for engineering college
const departments = [
  { id: 1, name: "Computer Science" },
  { id: 2, name: "Electronics" },
  { id: 3, name: "Mechanical" },
  { id: 4, name: "Civil" },
  { id: 5, name: "Electrical" },
];

// Semesters for engineering college
const semesters = [
  { id: 1, name: "1st" },
  { id: 2, name: "2nd" },
  { id: 3, name: "3rd" },
  { id: 4, name: "4th" },
  { id: 5, name: "5th" },
  { id: 6, name: "6th" },
  { id: 7, name: "7th" },
  { id: 8, name: "8th" },
];

const AdminStudents = () => {
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { theme } = useAuthStore();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      semester: '',
      section: '',
      department: '',
      rollNumber: '',
      parentName: '',
      parentContact: '',
      address: '',
      joinDate: new Date().toISOString().split('T')[0],
    },
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.section.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = selectedSemester ? student.semester === selectedSemester : true;
    const matchesDepartment = selectedDepartment ? student.department === selectedDepartment : true;
    
    return matchesSearch && matchesSemester && matchesDepartment;
  });

  const handleAddStudent = (data: StudentFormValues) => {
    const newStudent = {
      id: (students.length + 1).toString(),
      name: data.name,
      email: data.email,
      rollNumber: data.rollNumber || `${data.semester[0]}${data.section}${Math.floor(Math.random() * 1000)}`,
      semester: data.semester,
      section: data.section,
      department: data.department,
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
        semester: student.semester,
        section: student.section,
        department: student.department,
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
            semester: data.semester,
            section: data.section,
            department: data.department,
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
        semester: '3rd',
        section: 'B',
        department: 'Computer Science',
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
            <ThemeSwitcher />
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
          <div className="flex gap-2">
            <Select 
              value={selectedSemester} 
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Semesters</SelectItem>
                {semesters.map(semester => (
                  <SelectItem key={semester.id} value={semester.name}>
                    {semester.name} Semester
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedDepartment} 
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              className="bg-edu-secondary hover:bg-edu-secondary/90"
              onClick={handleRunPrediction}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Run AI Prediction
            </Button>
          </div>
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
                    <TableHead>Semester</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Department</TableHead>
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
                        <TableCell>{student.semester}</TableCell>
                        <TableCell>{student.section}</TableCell>
                        <TableCell>{student.department}</TableCell>
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
                      <TableCell colSpan={9} className="text-center py-4">
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
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.name}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {semesters.map(semester => (
                            <SelectItem key={semester.id} value={semester.name}>
                              {semester.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.name}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {semesters.map(semester => (
                            <SelectItem key={semester.id} value={semester.name}>
                              {semester.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
