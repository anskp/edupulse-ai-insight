
import { BookOpen, BarChart2, Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
const performanceData = [
  { name: 'Math', internal1: 75, internal2: 82, prediction: 85 },
  { name: 'Science', internal1: 80, internal2: 78, prediction: 82 },
  { name: 'History', internal1: 68, internal2: 72, prediction: 75 },
  { name: 'English', internal1: 85, internal2: 88, prediction: 90 },
  { name: 'Computer', internal1: 90, internal2: 92, prediction: 94 },
];

const trendData = [
  { name: 'Term 1', score: 72 },
  { name: 'Mid-Term', score: 76 },
  { name: 'Term 2', score: 78 },
  { name: 'Term 3', score: 82 },
  { name: 'Pre-Final', score: 85 },
];

const StudentDashboard = () => {
  const { toast } = useToast();

  const downloadReport = () => {
    toast({
      title: 'Download Started',
      description: 'Your report is being generated and will download shortly.',
    });
    
    setTimeout(() => {
      toast({
        title: 'Download Complete',
        description: 'Your performance report has been downloaded.',
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">
              Your academic performance and insights.
            </p>
          </div>
          <Button onClick={downloadReport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Overall Average"
            value="82%"
            change={4}
            icon={<BookOpen className="h-4 w-4" />}
          />
          <StatsCard
            title="Predicted Final Score"
            value="85%"
            icon={<BarChart2 className="h-4 w-4" />}
          />
          <StatsCard
            title="Achievement Badges"
            value="7"
            change={2}
            icon={<Award className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Subject Performance"
            description="Internal scores vs predictions by subject"
            type="bar"
            data={performanceData}
            series={[
              { name: 'Internal 1', dataKey: 'internal1', color: '#4F46E5' },
              { name: 'Internal 2', dataKey: 'internal2', color: '#10B981' },
              { name: 'Predicted External', dataKey: 'prediction', color: '#8B5CF6' },
            ]}
          />
          <ChartCard
            title="Performance Trend"
            description="Your score progression over time"
            type="line"
            data={trendData}
            series={[
              { name: 'Score', dataKey: 'score', color: '#4F46E5' },
            ]}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">Mathematics</div>
                  <div className="text-sm text-muted-foreground">85%</div>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">Science</div>
                  <div className="text-sm text-muted-foreground">78%</div>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">History</div>
                  <div className="text-sm text-muted-foreground">72%</div>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">English</div>
                  <div className="text-sm text-muted-foreground">90%</div>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">Computer Science</div>
                  <div className="text-sm text-muted-foreground">95%</div>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Predicted Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="text-sm font-medium">Current Standing</div>
                  <div className="text-sm font-bold text-green-600">A Grade</div>
                </div>
                <div className="flex items-center justify-between py-4 border-b">
                  <div className="text-sm font-medium">Predicted Final Grade</div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-sm font-bold text-edu-secondary">
                        A+ Grade
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          This prediction is based on your current performance and our AI model.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center justify-between py-4 border-b">
                  <div className="text-sm font-medium">Prediction Confidence</div>
                  <div className="text-sm font-bold">92%</div>
                </div>
                <div className="flex items-center justify-between py-4">
                  <div className="text-sm font-medium">Areas for Improvement</div>
                  <div className="text-sm font-medium text-amber-600">History, Science</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 text-xs text-muted-foreground">
              Predictions are based on internal assessments and attendance patterns.
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
