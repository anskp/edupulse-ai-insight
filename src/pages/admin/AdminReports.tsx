
import { useState } from 'react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Download,
  FileText,
  Filter,
  Printer,
  RefreshCw,
} from 'lucide-react';

// Sample data for reports
const performanceTrendData = [
  { month: 'Jan', avg: 72 },
  { month: 'Feb', avg: 75 },
  { month: 'Mar', avg: 70 },
  { month: 'Apr', avg: 78 },
  { month: 'May', avg: 80 },
  { month: 'Jun', avg: 83 },
  { month: 'Jul', avg: 85 },
];

const classComparisonData = [
  { name: 'Class 9A', avg: 72, min: 45, max: 98 },
  { name: 'Class 9B', avg: 68, min: 42, max: 95 },
  { name: 'Class 10A', avg: 76, min: 50, max: 99 },
  { name: 'Class 10B', avg: 71, min: 48, max: 94 },
  { name: 'Class 11A', avg: 82, min: 65, max: 100 },
  { name: 'Class 11B', avg: 79, min: 60, max: 97 },
  { name: 'Class 12A', avg: 85, min: 68, max: 100 },
  { name: 'Class 12B', avg: 83, min: 67, max: 99 },
];

const subjectComparisonData = [
  { subject: 'Mathematics', passing: 85, distinction: 32 },
  { subject: 'Science', passing: 88, distinction: 28 },
  { subject: 'English', passing: 92, distinction: 35 },
  { subject: 'History', passing: 80, distinction: 20 },
  { subject: 'Computer Science', passing: 95, distinction: 40 },
];

const attendanceData = [
  { name: 'Class 9A', attendance: 85 },
  { name: 'Class 9B', attendance: 82 },
  { name: 'Class 10A', attendance: 88 },
  { name: 'Class 10B', attendance: 86 },
  { name: 'Class 11A', attendance: 90 },
  { name: 'Class 11B', attendance: 87 },
  { name: 'Class 12A', attendance: 92 },
  { name: 'Class 12B', attendance: 89 },
];

const predictionAccuracyData = [
  { term: 'Term 1', accuracy: 82 },
  { term: 'Term 2', accuracy: 85 },
  { term: 'Term 3', accuracy: 87 },
  { term: 'Term 4', accuracy: 90 },
  { term: 'Final', accuracy: 93 },
];

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('term');
  const { toast } = useToast();

  const handleGenerateReport = () => {
    toast({
      title: "Generating report",
      description: "Preparing comprehensive report for download...",
    });
    
    setTimeout(() => {
      toast({
        title: "Report ready",
        description: "Your report has been generated and is ready for download.",
      });
    }, 2000);
  };

  const handleExportData = (format: string) => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: `Preparing ${activeTab} report in ${format.toUpperCase()} format...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `${activeTab} report has been exported as ${format.toUpperCase()}.`,
      });
    }, 1500);
  };

  const handlePrintReport = () => {
    toast({
      title: "Preparing for print",
      description: "Setting up print preview...",
    });
    
    setTimeout(() => {
      toast({
        title: "Print ready",
        description: "The print dialog should open now.",
      });
      
      // In a real app, this would trigger the print dialog
      // window.print();
    }, 1000);
  };

  const handleRefreshData = () => {
    toast({
      title: "Refreshing data",
      description: "Fetching the latest data for reports...",
    });
    
    setTimeout(() => {
      toast({
        title: "Data refreshed",
        description: "Report data has been updated with the latest information.",
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive reports and analytics about school performance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefreshData}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button onClick={handleGenerateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>
              Select filters to customize your report view.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Class</label>
                <Select
                  value={selectedClass}
                  onValueChange={setSelectedClass}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="9">Class 9</SelectItem>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="computer">Computer Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Period</label>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="term">Current Term</SelectItem>
                    <SelectItem value="year">Academic Year</SelectItem>
                    <SelectItem value="last_term">Last Term</SelectItem>
                    <SelectItem value="last_year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 md:w-[600px]">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Performance Trend</CardTitle>
                <CardDescription>
                  Average student performance across the academic year.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartCard 
                    title="" 
                    description="" 
                    type="line" 
                    data={performanceTrendData}
                    series={[
                      { name: 'Average Score', dataKey: 'avg', color: '#4F46E5' },
                    ]}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-muted-foreground text-sm">
                  Data period: {selectedPeriod === 'term' ? 'Current Term' : 'Academic Year 2024-25'}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExportData('pdf')}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExportData('csv')}>
                    <Download className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrintReport}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Comparison</CardTitle>
                <CardDescription>
                  Performance metrics across different classes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartCard 
                    title="" 
                    description="" 
                    type="bar" 
                    data={classComparisonData}
                    series={[
                      { name: 'Average', dataKey: 'avg', color: '#4F46E5' },
                      { name: 'Minimum', dataKey: 'min', color: '#EF4444' },
                      { name: 'Maximum', dataKey: 'max', color: '#10B981' },
                    ]}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-muted-foreground text-sm">
                  Based on all assessments in the {selectedPeriod === 'term' ? 'current term' : 'academic year'}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExportData('pdf')}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExportData('csv')}>
                    <Download className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>
                  Average attendance percentage across classes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartCard 
                    title="" 
                    description="" 
                    type="bar" 
                    data={attendanceData}
                    series={[
                      { name: 'Attendance %', dataKey: 'attendance', color: '#4F46E5' },
                    ]}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-muted-foreground text-sm">
                  Data for {selectedPeriod === 'term' ? 'Spring Term 2025' : 'Academic Year 2024-25'}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExportData('pdf')}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExportData('csv')}>
                    <Download className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Calendar</CardTitle>
                  <CardDescription>
                    Daily attendance patterns.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Calendar className="h-32 w-32 text-primary opacity-80" />
                    <p className="text-center text-muted-foreground">
                      Calendar view is available in the full report.
                      <br />
                      Click "Generate Report" to view detailed attendance patterns.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Statistics</CardTitle>
                  <CardDescription>
                    Key attendance metrics and insights.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-4 text-center">
                        <p className="text-sm text-muted-foreground">Average Attendance</p>
                        <p className="text-3xl font-bold text-primary">87%</p>
                      </div>
                      <div className="border rounded-md p-4 text-center">
                        <p className="text-sm text-muted-foreground">Perfect Attendance</p>
                        <p className="text-3xl font-bold text-primary">32%</p>
                      </div>
                      <div className="border rounded-md p-4 text-center">
                        <p className="text-sm text-muted-foreground">Below 75%</p>
                        <p className="text-3xl font-bold text-destructive">8%</p>
                      </div>
                      <div className="border rounded-md p-4 text-center">
                        <p className="text-sm text-muted-foreground">Most Absent Day</p>
                        <p className="text-3xl font-bold">Monday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="subjects" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance Analysis</CardTitle>
                <CardDescription>
                  Passing rates and distinction percentages by subject.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartCard 
                    title="" 
                    description="" 
                    type="bar" 
                    data={subjectComparisonData}
                    series={[
                      { name: 'Passing %', dataKey: 'passing', color: '#4F46E5' },
                      { name: 'Distinction %', dataKey: 'distinction', color: '#10B981' },
                    ]}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-muted-foreground text-sm">
                  Data for all classes, {selectedPeriod === 'term' ? 'current term' : 'academic year'}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExportData('pdf')}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExportData('csv')}>
                    <Download className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mathematics</CardTitle>
                  <CardDescription>
                    Performance metrics for Mathematics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Score:</span>
                      <span className="font-medium">82/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Highest Score:</span>
                      <span className="font-medium">100/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lowest Score:</span>
                      <span className="font-medium">45/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distinction %:</span>
                      <span className="font-medium">32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pass %:</span>
                      <span className="font-medium">85%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Science</CardTitle>
                  <CardDescription>
                    Performance metrics for Science.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Score:</span>
                      <span className="font-medium">79/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Highest Score:</span>
                      <span className="font-medium">98/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lowest Score:</span>
                      <span className="font-medium">42/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distinction %:</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pass %:</span>
                      <span className="font-medium">88%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>English</CardTitle>
                  <CardDescription>
                    Performance metrics for English.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Score:</span>
                      <span className="font-medium">85/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Highest Score:</span>
                      <span className="font-medium">99/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lowest Score:</span>
                      <span className="font-medium">50/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distinction %:</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pass %:</span>
                      <span className="font-medium">92%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Prediction Accuracy</CardTitle>
                <CardDescription>
                  Historical accuracy of AI predictions compared to actual results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartCard 
                    title="" 
                    description="" 
                    type="line" 
                    data={predictionAccuracyData}
                    series={[
                      { name: 'Accuracy %', dataKey: 'accuracy', color: '#4F46E5' },
                    ]}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-muted-foreground text-sm">
                  Data from previous academic terms
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExportData('pdf')}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExportData('csv')}>
                    <Download className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Insights</CardTitle>
                  <CardDescription>
                    Key insights from the prediction model.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Model Accuracy</h3>
                      <p className="text-muted-foreground">
                        The AI prediction model has achieved an overall accuracy of 93% in the final term predictions, 
                        showing a steady improvement from 82% in Term 1.
                      </p>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Predictive Factors</h3>
                      <p className="text-muted-foreground">
                        Internal assessments (60%), attendance (25%), and previous performance (15%) 
                        have been identified as the strongest predictors of student outcomes.
                      </p>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Improvement Areas</h3>
                      <p className="text-muted-foreground">
                        The model accuracy is lower for students with irregular attendance patterns and 
                        inconsistent performance across assessments.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Statistics</CardTitle>
                  <CardDescription>
                    Subject-wise prediction accuracy metrics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Mathematics</p>
                        <p className="text-2xl font-bold text-primary">95%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                      <div className="border rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Science</p>
                        <p className="text-2xl font-bold text-primary">92%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                      <div className="border rounded-md p-4">
                        <p className="text-sm text-muted-foreground">English</p>
                        <p className="text-2xl font-bold text-primary">91%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                      <div className="border rounded-md p-4">
                        <p className="text-sm text-muted-foreground">History</p>
                        <p className="text-2xl font-bold text-primary">88%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Performance Correlation</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Prediction to Actual Correlation:</span>
                        <span className="font-medium">0.89</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Year-on-Year Comparison</CardTitle>
                <CardDescription>
                  Academic performance comparison across years.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartCard 
                    title="" 
                    description="" 
                    type="bar" 
                    data={[
                      { subject: 'Mathematics', '2023': 75, '2024': 82, '2025': 85 },
                      { subject: 'Science', '2023': 72, '2024': 78, '2025': 83 },
                      { subject: 'English', '2023': 80, '2024': 85, '2025': 88 },
                      { subject: 'History', '2023': 68, '2024': 75, '2025': 78 },
                      { subject: 'Computer Science', '2023': 85, '2024': 90, '2025': 94 },
                    ]}
                    series={[
                      { name: '2023', dataKey: '2023', color: '#9CA3AF' },
                      { name: '2024', dataKey: '2024', color: '#60A5FA' },
                      { name: '2025', dataKey: '2025', color: '#4F46E5' },
                    ]}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-muted-foreground text-sm">
                  Average scores across academic years
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExportData('pdf')}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExportData('csv')}>
                    <Download className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Growth</CardTitle>
                  <CardDescription>
                    Year-over-year performance improvements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Overall Growth</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Average improvement:</span>
                        <span className="font-medium text-green-600">+3.8%</span>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Subject Growth</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Mathematics:</span>
                          <span className="font-medium text-green-600">+3.7%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Science:</span>
                          <span className="font-medium text-green-600">+6.4%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">English:</span>
                          <span className="font-medium text-green-600">+3.5%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">History:</span>
                          <span className="font-medium text-green-600">+4.0%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Computer Science:</span>
                          <span className="font-medium text-green-600">+4.4%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Comparative Analysis</CardTitle>
                  <CardDescription>
                    Insights from year-on-year performance data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Key Improvements</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Highest growth observed in Science subjects (+6.4%)</li>
                        <li>Consistent improvement across all subjects for 3 consecutive years</li>
                        <li>Reduced failure rate by 5.2% compared to the previous year</li>
                        <li>Increased distinction percentage by 4.7% across all subjects</li>
                      </ul>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Contributing Factors</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Implementation of AI-based personalized learning</li>
                        <li>Teacher professional development programs</li>
                        <li>Improved teaching methodologies and resources</li>
                        <li>Better assessment and feedback mechanisms</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
