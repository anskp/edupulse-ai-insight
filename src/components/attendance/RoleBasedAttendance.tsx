
import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
}

export const RoleBasedAttendance = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const subjects = [
    { id: 'MATH101', name: 'Mathematics I' },
    { id: 'PHY101', name: 'Physics I' },
    { id: 'CHEM101', name: 'Chemistry I' },
    { id: 'CSE101', name: 'Computer Science I' },
  ];

  const markAttendance = async (status: 'present' | 'absent' | 'late') => {
    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a subject first",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to store the attendance
    toast({
      title: "Success",
      description: `Attendance marked as ${status} for ${subjects.find(s => s.id === selectedSubject)?.name}`,
    });
  };

  const isTeacher = user?.role === 'teacher';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isTeacher ? 'Mark Student Attendance' : 'My Attendance'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => markAttendance('present')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Mark Present
                </Button>
                <Button
                  onClick={() => markAttendance('absent')}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Mark Absent
                </Button>
                <Button
                  onClick={() => markAttendance('late')}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  Mark Late
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
