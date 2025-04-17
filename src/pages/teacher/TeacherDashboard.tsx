
import { GraduationCap, BookOpen, BarChart2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { useToast } from '@/hooks/use-toast';

// Mock data
const studentPerformanceData = [
  { name: 'Internal 1', avg: 72, class9: 65, class10: 70, class11: 78, class12: 82 },
  { name: 'Internal 2', avg: 75, class9: 68, class10: 72, class11: 76, class12: 85 },
  { name: 'Mid-Term', avg: 70, class9: 62, class10: 68, class11: 74, class12: 80 },
  { name: 'Internal 3', avg: 78, class9: 70, class10: 75, class11: 80, class12: 88 },
  { name: 'Pre-Final', avg: 80, class9: 72, class10: 78, class11: 82, class12: 90 },
];

const predictionsData = [
  { name: 'Mathematics', actual: 85, predicted: 82 },
  { name: 'Science', actual: 78, predicted: 80 },
  { name: 'Social Studies', actual: 72, predicted: 75 },
  { name: 'Languages', actual: 88, predicted: 85 },
];

const studentsAtRisk = [
  { id: 1, name: 'Rahul Sharma', attendance: '76%', internalAvg: 62, prediction: 58, risk: 'High' },
  { id: 2, name: 'Ananya Patel', attendance: '80%', internalAvg: 65, prediction: 63, risk: 'Medium' },
  { id: 3, name: 'Vikram Singh', attendance: '85%', internalAvg: 67, prediction: 64, risk: 'Medium' },
  { id: 4, name: 'Neha Kumar', attendance: '78%', internalAvg: 64, prediction: 60, risk: 'High' },
];

const TeacherDashboard = () => {
  const { toast } = useToast();

  const triggerPrediction = () => {
    toast({
      title: 'Prediction Started',
      description: 'Running AI predictions for all students...',
    });
    
    setTimeout(() => {
      toast({
        title: 'Prediction Complete',
        description: 'AI predictions successfully updated for all students.',
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor student performance and run AI predictions.
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={triggerPrediction} className="bg-edu-secondary hover:bg-edu-secondary/90">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Run AI Prediction
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This will use our AI model to predict external marks based on internal assessments.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Total Students"
            value="126"
            icon={<GraduationCap className="h-4 w-4" />}
          />
          <StatsCard
            title="Assessment Completion"
            value="92%"
            change={5}
            icon={<BookOpen className="h-4 w-4" />}
          />
          <StatsCard
            title="At-Risk Students"
            value="8"
            change={-2}
            icon={<AlertCircle className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard
            title="Class Performance Trends"
            description="Average scores across different assessments"
            type="line"
            data={studentPerformanceData}
            series={[
              { name: 'Average', dataKey: 'avg', color: '#4F46E5' },
              { name: 'Class 9', dataKey: 'class9', color: '#10B981' },
              { name: 'Class 10', dataKey: 'class10', color: '#EF4444' },
              { name: 'Class 11', dataKey: 'class11', color: '#F59E0B' },
              { name: 'Class 12', dataKey: 'class12', color: '#8B5CF6' },
            ]}
          />
          <ChartCard
            title="Prediction Accuracy"
            description="AI predicted vs actual marks by subject"
            type="bar"
            data={predictionsData}
            series={[
              { name: 'Actual', dataKey: 'actual', color: '#4F46E5' },
              { name: 'Predicted', dataKey: 'predicted', color: '#8B5CF6' },
            ]}
          />
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Students At Risk</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Students who are predicted to score below passing grade in external exams.
          </p>
          
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Internal Avg</TableHead>
                  <TableHead>Predicted Score</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsAtRisk.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.attendance}</TableCell>
                    <TableCell>{student.internalAvg}</TableCell>
                    <TableCell>{student.prediction}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.risk === 'High' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.risk}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
