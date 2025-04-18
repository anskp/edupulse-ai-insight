
import { useState } from 'react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, BarChart2, Download, FileText, Search } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { ChartData } from '@/types/chart';

// Mock data
const studentsData = [
  { id: 1, name: 'Rahul Sharma', class: '10A', internal1: 72, internal2: 75, midTerm: 68, attendance: '82%', predicted: 70, actual: 72 },
  { id: 2, name: 'Priya Patel', class: '10A', internal1: 85, internal2: 88, midTerm: 82, attendance: '95%', predicted: 86, actual: 88 },
  { id: 3, name: 'Arjun Singh', class: '10A', internal1: 78, internal2: 72, midTerm: 75, attendance: '88%', predicted: 76, actual: 78 },
  { id: 4, name: 'Neha Kumar', class: '10B', internal1: 65, internal2: 70, midTerm: 68, attendance: '78%', predicted: 66, actual: 64 },
  { id: 5, name: 'Vikram Mehta', class: '10B', internal1: 88, internal2: 92, midTerm: 85, attendance: '92%', predicted: 88, actual: 90 },
  { id: 6, name: 'Ananya Desai', class: '10B', internal1: 76, internal2: 78, midTerm: 75, attendance: '85%', predicted: 78, actual: 76 },
  { id: 7, name: 'Rajiv Chauhan', class: '11A', internal1: 62, internal2: 68, midTerm: 65, attendance: '75%', predicted: 64, actual: 62 },
  { id: 8, name: 'Sona Reddy', class: '11A', internal1: 82, internal2: 85, midTerm: 80, attendance: '90%', predicted: 83, actual: 85 },
];

const TeacherPredictions = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [runningPrediction, setRunningPrediction] = useState(false);

  // Filter students based on search term and selected class
  const filteredStudents = studentsData.filter(student => 
    (selectedClass === 'all' || student.class === selectedClass) &&
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRunPrediction = () => {
    setRunningPrediction(true);
    
    toast({
      title: 'Running Predictions',
      description: 'The AI model is analyzing student data to generate predictions...',
    });
    
    setTimeout(() => {
      setRunningPrediction(false);
      
      toast({
        title: 'Predictions Complete',
        description: 'All student predictions have been updated successfully.',
      });
    }, 3000);
  };

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: 'Download Started',
      description: `Preparing ${reportType} report for download...`,
    });
    
    setTimeout(() => {
      toast({
        title: 'Download Complete',
        description: 'Report has been downloaded successfully.',
      });
    }, 1500);
  };

  // Prediction distribution data
  const predictionDistributionData: ChartData[] = [
    { name: '90-100', count: 5 },
    { name: '80-89', count: 12 },
    { name: '70-79', count: 18 },
    { name: '60-69', count: 8 },
    { name: 'Below 60', count: 3 },
  ];

  // Prediction vs Actual data
  const predictionVsActualData: ChartData[] = [
    { name: '90-100', predicted: 5, actual: 6 },
    { name: '80-89', predicted: 12, actual: 10 },
    { name: '70-79', predicted: 18, actual: 20 },
    { name: '60-69', predicted: 8, actual: 7 },
    { name: 'Below 60', predicted: 3, actual: 3 },
  ];

  // Prediction accuracy by subject
  const predictionAccuracyBySubjectData: ChartData[] = [
    { name: 'Mathematics', accuracy: 92 },
    { name: 'Science', accuracy: 88 },
    { name: 'English', accuracy: 94 },
    { name: 'History', accuracy: 85 },
    { name: 'Computer Science', accuracy: 90 },
  ];

  // Prediction accuracy over time
  const predictionAccuracyOverTimeData: ChartData[] = [
    { name: 'Jan', accuracy: 85 },
    { name: 'Feb', accuracy: 87 },
    { name: 'Mar', accuracy: 89 },
    { name: 'Apr', accuracy: 91 },
    { name: 'May', accuracy: 93 },
    { name: 'Jun', accuracy: 92 },
  ];

  // Colors for pie chart
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">AI Predictions</h1>
            <p className="text-muted-foreground">
              View and generate performance predictions for your students
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRunPrediction} 
              disabled={runningPrediction}
              className="bg-edu-secondary hover:bg-edu-secondary/90"
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              {runningPrediction ? 'Running Prediction...' : 'Run AI Prediction'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleDownloadReport('predictions')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="10A">Class 10A</SelectItem>
              <SelectItem value="10B">Class 10B</SelectItem>
              <SelectItem value="11A">Class 11A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Distribution</CardTitle>
                  <CardDescription>
                    Distribution of students across score ranges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={predictionDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {predictionDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Predicted vs Actual</CardTitle>
                  <CardDescription>
                    Comparison of predicted and actual score distributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={predictionVsActualData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="predicted" name="Predicted" fill="#4F46E5" />
                        <Bar dataKey="actual" name="Actual" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>AI Model Performance</CardTitle>
                  <CardDescription>
                    Overall prediction accuracy and model metrics
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadReport('model metrics')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-2">Overall Accuracy</h3>
                    <p className="text-4xl font-bold text-green-600">91.5%</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Improvement: +2.5% from last term
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-2">Mean Error</h3>
                    <p className="text-4xl font-bold text-amber-600">±2.8</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Improvement: -0.7 from last term
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-2">Confidence Score</h3>
                    <p className="text-4xl font-bold text-blue-600">87%</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Improvement: +5.2% from last term
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accuracy" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Accuracy by Subject</CardTitle>
                  <CardDescription>
                    How accurate predictions are across different subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={predictionAccuracyBySubjectData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[70, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="accuracy" name="Accuracy %" fill="#4F46E5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Accuracy Over Time</CardTitle>
                  <CardDescription>
                    Trends in prediction accuracy over the months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictionAccuracyOverTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[80, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#4F46E5" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Prediction Factors</CardTitle>
                <CardDescription>
                  Key factors influencing prediction accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Attendance Impact</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Higher attendance correlates strongly with more accurate predictions. Students with 90%+ attendance have prediction accuracy of 95%.
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Assessment Consistency</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Students with consistent performance across internal assessments have more predictable outcomes.
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '88%'}}></div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Mid-Term Performance</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Mid-term exam performance is the strongest indicator of final results in most subjects.
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Long-Term Prediction Trends</CardTitle>
                <CardDescription>
                  Analysis of prediction accuracy across multiple terms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: 'Term 1 2023', accuracy: 84 },
                      { name: 'Term 2 2023', accuracy: 86 },
                      { name: 'Term 3 2023', accuracy: 89 },
                      { name: 'Term 1 2024', accuracy: 90 },
                      { name: 'Term 2 2024', accuracy: 91 },
                      { name: 'Term 3 2024', accuracy: 92 },
                      { name: 'Term 1 2025', accuracy: 93 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="accuracy" name="Model Accuracy %" stroke="#4F46E5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Key Insights:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Prediction accuracy has improved consistently over time.</li>
                    <li>The AI model shows best results for Mathematics and Science subjects.</li>
                    <li>Increased training data volume has contributed to better prediction quality.</li>
                    <li>Model refinements in the latest term have reduced error margins by 15%.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Prediction Success Factors</CardTitle>
                <CardDescription>
                  Factors that contribute to successful predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">Consistent Data Collection</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Regular and consistent assessment data across all subjects directly influences prediction quality.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">Assessment Timing</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Keeping internal assessments evenly spaced improves the model's ability to detect improvement trends.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">Attendance Tracking</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Daily attendance records significantly improve prediction accuracy, especially for borderline students.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">Multi-Year Training</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The AI model's extended training across multiple academic years has improved its pattern recognition.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Predictions</CardTitle>
                <CardDescription>
                  View and analyze predictions for individual students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Internal 1</TableHead>
                        <TableHead>Internal 2</TableHead>
                        <TableHead>Mid-Term</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Predicted</TableHead>
                        <TableHead>Actual</TableHead>
                        <TableHead>Accuracy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.class}</TableCell>
                            <TableCell>{student.internal1}</TableCell>
                            <TableCell>{student.internal2}</TableCell>
                            <TableCell>{student.midTerm}</TableCell>
                            <TableCell>{student.attendance}</TableCell>
                            <TableCell>{student.predicted}</TableCell>
                            <TableCell>{student.actual || 'N/A'}</TableCell>
                            <TableCell>
                              {student.actual ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  Math.abs(student.predicted - student.actual) <= 3
                                    ? 'bg-green-100 text-green-800'
                                    : Math.abs(student.predicted - student.actual) <= 6
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-red-100 text-red-800'
                                }`}>
                                  {Math.abs(student.predicted - student.actual) <= 3
                                    ? 'Excellent'
                                    : Math.abs(student.predicted - student.actual) <= 6
                                      ? 'Good'
                                      : 'Fair'}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">Pending</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-4">
                            No students match your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
