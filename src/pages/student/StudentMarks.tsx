
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
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { insertSampleStudentData } from '@/lib/supabase-helpers';

interface Mark {
  id: string;
  student_id: string;
  subject: string;
  internal1: number;
  internal2: number;
  mid_term: number;
  pre_final: number;
  final: number | null;
  predicted: number;
  term: string;
}

const StudentMarks = () => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const insertSampleData = async () => {
    setIsLoading(true);
    try {
      const studentId = await insertSampleStudentData();
      if (studentId) {
        toast.success('Sample data inserted successfully!');
        fetchMarks(studentId);
      } else {
        toast.error('Failed to insert sample data');
      }
    } catch (error) {
      toast.error('Error inserting sample data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarks = async (userId: string) => {
    const { data, error } = await supabase
      .from('marks')
      .select('*')
      .eq('student_id', userId);

    if (error) {
      toast.error('Failed to fetch marks', {
        description: error.message
      });
    } else {
      setMarks(data || []);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMarks(user.id);
    }
  }, [user]);

  const downloadMarks = () => {
    toast.info('Download feature coming soon!');
  };

  const calculateSubjectAverage = (subject: Mark) => {
    const assessments = [
      subject.internal1, 
      subject.internal2, 
      subject.mid_term, 
      subject.pre_final
    ];
    const average = assessments.reduce((a, b) => a + b, 0) / assessments.length;
    return average.toFixed(2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Academic Marks</h1>
          <div className="flex gap-2">
            <Button 
              onClick={insertSampleData} 
              variant="outline"
              disabled={isLoading}
            >
              Insert Sample Data
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
        
        {marks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No marks available. Click "Insert Sample Data" to add sample marks.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Internal 1</TableHead>
                <TableHead>Internal 2</TableHead>
                <TableHead>Mid Term</TableHead>
                <TableHead>Pre-Final</TableHead>
                <TableHead>Predicted</TableHead>
                <TableHead>Average</TableHead>
                <TableHead>Term</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marks.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.subject}</TableCell>
                  <TableCell>{subject.internal1}</TableCell>
                  <TableCell>{subject.internal2}</TableCell>
                  <TableCell>{subject.mid_term}</TableCell>
                  <TableCell>{subject.pre_final}</TableCell>
                  <TableCell>{subject.predicted}</TableCell>
                  <TableCell>{calculateSubjectAverage(subject)}</TableCell>
                  <TableCell>{subject.term}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentMarks;
