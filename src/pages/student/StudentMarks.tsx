import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { insertSampleStudentData } from '@/lib/supabase-helpers';
import { Mark } from '@/types/chart';

const StudentMarks = () => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('1');
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const insertSampleData = async () => {
    setIsLoading(true);
    try {
      const studentId = await insertSampleStudentData();
      if (studentId) {
        toast({
          title: "Success",
          description: "Sample data inserted successfully!"
        });
        fetchMarks(studentId, parseInt(selectedSemester));
      } else {
        toast({
          title: "Error",
          description: "Failed to insert sample data",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inserting sample data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarks = async (userId: string, semester: number) => {
    try {
      const { data, error } = await supabase
        .from('marks')
        .select('*')
        .eq('student_id', userId)
        .eq('semester', semester);

      if (error) {
        toast({
          title: "Failed to fetch marks",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setMarks(data || []);
      }
    } catch (error) {
      console.error("Error fetching marks:", error);
      toast({
        title: "Error",
        description: "Unexpected error fetching marks",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchMarks(user.id, parseInt(selectedSemester));
    }
  }, [user, selectedSemester]);

  const calculateAverage = (mark: Mark) => {
    const internals = [mark.internal_1, mark.internal_2, mark.internal_3].filter(Boolean);
    return internals.length ? (internals.reduce((a, b) => a + b, 0) / internals.length).toFixed(2) : 'N/A';
  };

  const downloadMarks = () => {
    toast({
      title: "Coming Soon",
      description: "Download feature will be available soon!"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Academic Performance</h1>
          <div className="flex gap-2">
            <Button 
              onClick={insertSampleData} 
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Insert Sample Data"}
            </Button>
            <Button 
              onClick={downloadMarks} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-[200px]">
            <Select 
              value={selectedSemester} 
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 8 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Semester {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {marks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No marks available for this semester. Click "Insert Sample Data" to add sample marks.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Internal 1</TableHead>
                <TableHead>Internal 2</TableHead>
                <TableHead>Internal 3</TableHead>
                <TableHead>Avg Internal</TableHead>
                <TableHead>Series</TableHead>
                <TableHead>External</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Credits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marks.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.course_code || 'N/A'}</TableCell>
                  <TableCell>{subject.course_name || subject.subject}</TableCell>
                  <TableCell>{subject.internal_1}</TableCell>
                  <TableCell>{subject.internal_2}</TableCell>
                  <TableCell>{subject.internal_3 || 'N/A'}</TableCell>
                  <TableCell>{calculateAverage(subject)}</TableCell>
                  <TableCell>{subject.series_exam}</TableCell>
                  <TableCell>{subject.external_exam}</TableCell>
                  <TableCell className="font-semibold">
                    {subject.letter_grade || 'N/A'}
                  </TableCell>
                  <TableCell>{subject.credit_hours}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={6}>Semester GPA</TableCell>
                <TableCell colSpan={4} className="font-bold">
                  {marks[0]?.sgpa?.toFixed(2) || 'N/A'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentMarks;
