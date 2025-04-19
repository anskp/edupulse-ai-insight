
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  attendance?: 'present' | 'absent' | 'late' | null;
}

export const RoleBasedAttendance = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSubject, setSelectedSubject] = useState<string>('MATH101');
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Rahul Sharma', rollNumber: '4PA22CS019', attendance: null },
    { id: '2', name: 'Priya Patel', rollNumber: '4PA22CS020', attendance: null },
    { id: '3', name: 'Vikram Singh', rollNumber: '4PA22CS021', attendance: null },
    { id: '4', name: 'Neha Kumar', rollNumber: '4PA22CS022', attendance: null },
    { id: '5', name: 'Anjali Desai', rollNumber: '4PA22CS023', attendance: null },
  ]);

  const subjects = [
    { id: 'MATH101', name: 'Mathematics I' },
    { id: 'PHY101', name: 'Physics I' },
    { id: 'CHEM101', name: 'Chemistry I' },
    { id: 'CSE101', name: 'Computer Science I' },
  ];

  const markAttendance = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a subject first",
        variant: "destructive",
      });
      return;
    }

    // Update the student's attendance status
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId ? { ...student, attendance: status } : student
      )
    );

    // Show success toast
    toast({
      title: "Success",
      description: `Attendance marked as ${status} for ${students.find(s => s.id === studentId)?.name}`,
    });
  };

  const saveAllAttendance = () => {
    // Check if all students have attendance marked
    const unmarkedStudents = students.filter(student => student.attendance === null);
    
    if (unmarkedStudents.length > 0) {
      toast({
        title: "Incomplete Attendance",
        description: `${unmarkedStudents.length} students don't have attendance marked`,
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would save to the database
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${selectedSubject} on ${selectedDate?.toLocaleDateString()} has been saved for all students`,
    });
  };

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  // For student view - mock data
  const studentAttendance = [
    { date: '2025-04-15', status: 'present', subject: 'Mathematics I' },
    { date: '2025-04-14', status: 'absent', subject: 'Physics I' },
    { date: '2025-04-13', status: 'present', subject: 'Chemistry I' },
    { date: '2025-04-12', status: 'late', subject: 'Computer Science I' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isTeacher ? 'Mark Student Attendance' : 'My Attendance'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-4">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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

            {isTeacher && (
              <Button onClick={saveAllAttendance} className="w-full">
                Save All Attendance
              </Button>
            )}
          </div>
        </div>

        {isTeacher ? (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      {student.attendance ? (
                        <span className={`px-2 py-1 rounded text-white ${
                          student.attendance === 'present' ? 'bg-green-500' : 
                          student.attendance === 'absent' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}>
                          {student.attendance.charAt(0).toUpperCase() + student.attendance.slice(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not marked</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant={student.attendance === 'present' ? 'default' : 'outline'}
                          className={student.attendance === 'present' ? 'bg-green-500 hover:bg-green-600' : ''}
                          onClick={() => markAttendance(student.id, 'present')}
                        >
                          Present
                        </Button>
                        <Button 
                          size="sm" 
                          variant={student.attendance === 'absent' ? 'default' : 'outline'}
                          className={student.attendance === 'absent' ? 'bg-red-500 hover:bg-red-600' : ''}
                          onClick={() => markAttendance(student.id, 'absent')}
                        >
                          Absent
                        </Button>
                        <Button 
                          size="sm" 
                          variant={student.attendance === 'late' ? 'default' : 'outline'}
                          className={student.attendance === 'late' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                          onClick={() => markAttendance(student.id, 'late')}
                        >
                          Late
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          // Student view
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentAttendance.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-white ${
                        record.status === 'present' ? 'bg-green-500' : 
                        record.status === 'absent' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
