
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChartCard from '@/components/dashboard/ChartCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  BarChart2,
  Download,
  FileText,
  HelpCircle,
  Info,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Sample data
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

const studentsWithPredictions = [
  {
    id: '1',
    name: 'Rahul Sharma',
    internal1: 85,
    internal2: 88,
    attendance: '85%',
    predicted: 92,
    confidence: 0.89,
    risk: 'Low',
    riskFactors: ['None'],
  },
  {
    id: '2',
    name: 'Priya Patel',
    internal1: 78,
    internal2: 82,
    attendance: '92%',
    predicted: 83,
    confidence: 0.85,
    risk: 'Low',
    riskFactors: ['None'],
  },
  {
    id: '3',
    name: 'Arjun Singh',
    internal1: 62,
    internal2: 58,
    attendance: '76%',
    predicted: 60,
    confidence: 0.78,
    risk: 'High',
    riskFactors: ['Low internal marks', 'Inconsistent attendance'],
  },
  {
    id: '4',
    name: 'Neha Kumar',
    internal1: 70,
    internal2: 68,
    attendance: '80%',
    predicted: 72,
    confidence: 0.82,
    risk: 'Medium',
    riskFactors: ['Declining internal trend'],
  },
  {
    id: '5',
    name: 'Sample Student',
    internal1: 95,
    internal2: 92,
    attendance: '90%',
    predicted: 96,
    confidence: 0.95,
    risk: 'Low',
    riskFactors: ['None'],
  },
];

const predictionAccuracyData = [
  { subject: 'Mathematics', accuracy: 92 },
  { subject: 'Science', accuracy: 89 },
  { subject: 'History', accuracy: 84 },
  { subject: 'English', accuracy: 91 },
  { subject: 'Computer Science', accuracy: 95 },
];

const predictionTrendData = [
  { month: 'Jan', accuracy: 82 },
  { month: 'Feb', accuracy: 85 },
  { month: 'Mar', accuracy: 87 },
  { month: 'Apr', accuracy: 89 },
  { month: 'May', accuracy: 91 },
  { month: 'Jun', accuracy: 92 },
  { month: 'Jul', accuracy: 94 },
];

const TeacherPredictions = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState('students');
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedClass) {
      // Fetch predictions for the selected class
    }
  }, [selectedClass]);

  const handleRunPredictions = () => {
    if (!selectedClass) {
      toast({
        title: "Error",
        description: "Please select a class first.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Running predictions",
      description: `Calculating predictions for ${classes.find(c => c.id.toString() === selectedClass)?.name}...`,
    });
    
    setLoading(true);
    
    // Simulate prediction calculation delay
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Predictions complete",
        description: "Student performance predictions have been updated.",
      });
    }, 3000);
  };

  const handleExportReport = () => {
    toast({
      title: "Exporting report",
      description: "Preparing prediction report for export...",
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Prediction report has been generated and is ready for download.",
      });
    }, 1500);
  };

  const renderRiskBadge = (risk: string) => {
    const colorMap = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[risk as keyof typeof colorMap]}`}>
        {risk}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">AI Predictions</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground"
                    onClick={() => setShowHelp(!showHelp)}
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Our AI model predicts student performance based on internal marks, attendance, and historical data.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleExportReport}
            >
              <FileText className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button
              className="bg-edu-secondary hover:bg-edu-secondary/90"
              onClick={handleRunPredictions}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin">◌</span>
                  Processing...
                </>
              ) : (
                <>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Run Predictions
                </>
              )}
            </Button>
          </div>
        </div>

        {showHelp && (
          <Card>
            <CardHeader className="bg-amber-50 dark:bg-amber-950/40">
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <Lightbulb className="h-5 w-5" />
                How Predictions Work
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-background border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Data Collection</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI analyzes internal marks, attendance, past records, and study patterns to build a prediction model.
                    </p>
                  </div>
                  <div className="bg-background border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Prediction Algorithm</h3>
                    <p className="text-sm text-muted-foreground">
                      Using XGBoost machine learning, the system calculates expected outcomes with a confidence score.
                    </p>
                  </div>
                  <div className="bg-background border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Risk Assessment</h3>
                    <p className="text-sm text-muted-foreground">
                      Students at risk of underperforming are highlighted with specific factors that need attention.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" onClick={() => setShowHelp(false)}>
                    Close Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-4">
          <div className="w-full md:w-64">
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
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="students">Student Predictions</TabsTrigger>
            <TabsTrigger value="insights">Prediction Insights</TabsTrigger>
            <TabsTrigger value="accuracy">Model Accuracy</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Predictions</CardTitle>
                <CardDescription>
                  {selectedClass 
                    ? `Showing predictions for ${classes.find(c => c.id.toString() === selectedClass)?.name}`
                    : "Select a class to view predictions"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Internal 1</TableHead>
                      <TableHead>Internal 2</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Predicted Score</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Risk Factors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsWithPredictions.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.internal1}</TableCell>
                        <TableCell>{student.internal2}</TableCell>
                        <TableCell>{student.attendance}</TableCell>
                        <TableCell className="font-medium">{student.predicted}</TableCell>
                        <TableCell>{`${Math.round(student.confidence * 100)}%`}</TableCell>
                        <TableCell>{renderRiskBadge(student.risk)}</TableCell>
                        <TableCell>
                          {student.riskFactors.length > 0 && student.riskFactors[0] !== 'None' ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <AlertCircle className={`h-4 w-4 ${
                                      student.risk === 'High' 
                                        ? 'text-red-500' 
                                        : student.risk === 'Medium' 
                                          ? 'text-yellow-500' 
                                          : 'text-green-500'
                                    }`} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-semibold mb-1">Risk Factors:</p>
                                  <ul className="list-disc list-inside">
                                    {student.riskFactors.map((factor, idx) => (
                                      <li key={idx} className="text-sm">{factor}</li>
                                    ))}
                                  </ul>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <span className="text-green-500 text-sm">None</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {studentsWithPredictions.length} students
                </p>
                <Button variant="outline" size="sm" onClick={handleExportReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Confidence Distribution</CardTitle>
                  <CardDescription>
                    Distribution of prediction confidence levels across students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartCard 
                      title=""
                      description=""
                      type="bar"
                      data={[
                        { range: '90-100%', count: 25 },
                        { range: '80-90%', count: 42 },
                        { range: '70-80%', count: 18 },
                        { range: '60-70%', count: 10 },
                        { range: 'Below 60%', count: 5 },
                      ]}
                      series={[
                        { name: 'Students', dataKey: 'count', color: '#4F46E5' },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prediction vs. Actual Distribution</CardTitle>
                  <CardDescription>
                    Comparison between predicted and actual scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartCard 
                      title=""
                      description=""
                      type="bar"
                      data={[
                        { range: '90-100', predicted: 18, actual: 15 },
                        { range: '80-89', predicted: 32, actual: 30 },
                        { range: '70-79', predicted: 25, actual: 28 },
                        { range: '60-69', predicted: 15, actual: 17 },
                        { range: 'Below 60', predicted: 10, actual: 10 },
                      ]}
                      series={[
                        { name: 'Predicted', dataKey: 'predicted', color: '#4F46E5' },
                        { name: 'Actual', dataKey: 'actual', color: '#10B981' },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Prediction Insights</CardTitle>
                <CardDescription>
                  Key insights from the prediction model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Key Predictors</h3>
                        <p className="text-sm text-muted-foreground">
                          Internal assessments (60%), attendance (25%), and previous performance (15%) are the strongest predictors.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <AlertCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Risk Indicators</h3>
                        <p className="text-sm text-muted-foreground">
                          8 students (8%) are at high risk of underperforming and require immediate intervention.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Opportunity Areas</h3>
                        <p className="text-sm text-muted-foreground">
                          15 students show potential to improve by 10-15% with targeted assistance in specific areas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accuracy" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Accuracy by Subject</CardTitle>
                  <CardDescription>
                    Model accuracy across different subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartCard 
                      title=""
                      description=""
                      type="bar"
                      data={predictionAccuracyData}
                      series={[
                        { name: 'Accuracy %', dataKey: 'accuracy', color: '#4F46E5' },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prediction Accuracy Trend</CardTitle>
                  <CardDescription>
                    Model accuracy improvement over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartCard 
                      title=""
                      description=""
                      type="line"
                      data={predictionTrendData}
                      series={[
                        { name: 'Accuracy %', dataKey: 'accuracy', color: '#10B981' },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Model Performance Metrics</CardTitle>
                <CardDescription>
                  Technical details about the prediction model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Accuracy</h3>
                    <p className="text-2xl font-bold text-primary">92.5%</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Overall prediction accuracy averaged across all subjects and classes
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Mean Absolute Error</h3>
                    <p className="text-2xl font-bold text-primary">2.8 points</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Average difference between predicted and actual scores
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Training Data Size</h3>
                    <p className="text-2xl font-bold text-primary">15,240 records</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total historical student records used to train the prediction model
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherPredictions;
