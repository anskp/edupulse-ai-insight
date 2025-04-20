
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types
interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

interface AttendanceStatus {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused' | null;
}

interface AttendanceMarkingProps {
  readOnly?: boolean;
  studentsList?: Student[];
}

// Sample data for testing
const sampleStudents: Student[] = [
  { id: '1', name: 'Rahul Sharma', rollNumber: '4PA22CS019' },
  { id: '2', name: 'Priya Patel', rollNumber: '4PA22CS020' },
  { id: '3', name: 'Vikram Singh', rollNumber: '4PA22CS021' },
  { id: '4', name: 'Neha Kumar', rollNumber: '4PA22CS022' },
  { id: '5', name: 'Anjali Desai', rollNumber: '4PA22CS023' },
];

const semesters = [
  { id: "1", name: "Semester 1" },
  { id: "2", name: "Semester 2" },
  { id: "3", name: "Semester 3" },
  { id: "4", name: "Semester 4" },
  { id: "5", name: "Semester 5" },
  { id: "6", name: "Semester 6" },
  { id: "7", name: "Semester 7" },
  { id: "8", name: "Semester 8" },
];

const subjects = [
  { id: "1", name: "Engineering Mathematics" },
  { id: "2", name: "Computer Science Fundamentals" },
  { id: "3", name: "Data Structures & Algorithms" },
  { id: "4", name: "Digital Electronics" },
  { id: "5", name: "Programming in C++" },
];

const periods = [
  { id: "1", name: "Period 1 (9:00 - 10:00)" },
  { id: "2", name: "Period 2 (10:00 - 11:00)" },
  { id: "3", name: "Period 3 (11:15 - 12:15)" },
  { id: "4", name: "Period 4 (12:15 - 1:15)" },
  { id: "5", name: "Period 5 (2:00 - 3:00)" },
  { id: "6", name: "Period 6 (3:00 - 4:00)" },
];

export const AttendanceMarking = ({ readOnly = false, studentsList }: AttendanceMarkingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSemester, setSelectedSemester] = useState<string>("1");
  const [selectedSubject, setSelectedSubject] = useState<string>("1");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1");
  const [attendanceData, setAttendanceData] = useState<AttendanceStatus[]>([]);
  const [students, setStudents] = useState<Student[]>(studentsList || sampleStudents);
  const { toast } = useToast();

  // Initialize attendance data
  useEffect(() => {
    setAttendanceData(
      students.map(student => ({
        studentId: student.id,
        status: null
      }))
    );
  }, [students]);

  const updateAttendanceStatus = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    if (readOnly) return;
    
    setAttendanceData(prev => 
      prev.map(item => 
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const handleSaveAttendance = () => {
    if (!selectedDate || !selectedSemester || !selectedSubject || !selectedPeriod) {
      toast({
        title: "Missing information",
        description: "Please select date, semester, subject, and period before saving.",
        variant: "destructive"
      });
      return;
    }

    // Check if any students don't have attendance marked
    const unmarkedStudents = attendanceData.filter(item => item.status === null);
    if (unmarkedStudents.length > 0) {
      toast({
        title: "Incomplete attendance",
        description: `${unmarkedStudents.length} students don't have attendance marked.`,
        variant: "destructive"
      });
      return;
    }

    // Here we would normally save to database
    toast({
      title: "Attendance saved",
      description: `Attendance for ${subjects.find(s => s.id === selectedSubject)?.name} on ${selectedDate.toLocaleDateString()} has been saved for Semester ${selectedSemester}.`
    });
  };

  const getStatusColor = (status: 'present' | 'absent' | 'late' | 'excused' | null) => {
    switch (status) {
      case 'present': return 'bg-green-500 hover:bg-green-600';
      case 'absent': return 'bg-red-500 hover:bg-red-600';
      case 'late': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'excused': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-300 hover:bg-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Attendance</CardTitle>
        <CardDescription>
          {readOnly 
            ? "View student attendance records" 
            : "Record student attendance for a specific date and period"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <div className="flex items-center">
              <DatePicker
                date={selectedDate}
                setDate={setSelectedDate}
                disabled={readOnly}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Semester</label>
            <Select 
              value={selectedSemester} 
              onValueChange={setSelectedSemester}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Select 
              value={selectedSubject} 
              onValueChange={setSelectedSubject}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Period</label>
            <Select 
              value={selectedPeriod} 
              onValueChange={setSelectedPeriod}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                {!readOnly && <TableHead className="text-center">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const attendance = attendanceData.find(a => a.studentId === student.id);
                const status = attendance?.status;
                
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-center">
                      {status && (
                        <span className={`inline-block px-2 py-1 rounded text-white font-medium ${getStatusColor(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      )}
                      {!status && <span className="text-gray-500">Not marked</span>}
                    </TableCell>
                    {!readOnly && (
                      <TableCell>
                        <div className="flex justify-center space-x-1">
                          <Button 
                            size="sm" 
                            variant={status === 'present' ? 'default' : 'outline'}
                            className={status === 'present' ? 'bg-green-500 hover:bg-green-600' : ''}
                            onClick={() => updateAttendanceStatus(student.id, 'present')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant={status === 'absent' ? 'default' : 'outline'}
                            className={status === 'absent' ? 'bg-red-500 hover:bg-red-600' : ''}
                            onClick={() => updateAttendanceStatus(student.id, 'absent')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant={status === 'late' ? 'default' : 'outline'}
                            className={status === 'late' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                            onClick={() => updateAttendanceStatus(student.id, 'late')}
                          >
                            L
                          </Button>
                          <Button 
                            size="sm" 
                            variant={status === 'excused' ? 'default' : 'outline'}
                            className={status === 'excused' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                            onClick={() => updateAttendanceStatus(student.id, 'excused')}
                          >
                            E
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {!readOnly && (
          <div className="flex justify-end">
            <Button onClick={handleSaveAttendance}>
              Save Attendance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
