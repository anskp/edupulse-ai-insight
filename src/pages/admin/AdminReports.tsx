
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, LineChart, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar, Line, Cell, Pie } from 'recharts';
import { Download, FileText, Filter, Search } from 'lucide-react';
import { ChartData } from '@/types/chart';

const AdminReports = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('performance');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Performance trend data
  const performanceTrendData: ChartData[] = [
    { name: 'Jan', avg: 72 },
    { name: 'Feb', avg: 75 },
    { name: 'Mar', avg: 70 },
    { name: 'Apr', avg: 78 },
    { name: 'May', avg: 80 },
    { name: 'Jun', avg: 82 }
  ];

  // Attendance data
  const attendanceData: ChartData[] = [
    { name: 'Class 9A', attendance: 90 },
    { name: 'Class 9B', attendance: 88 },
    { name: 'Class 10A', attendance: 92 },
    { name: 'Class 10B', attendance: 86 },
    { name: 'Class 11A', attendance: 85 },
    { name: 'Class 11B', attendance: 89 },
    { name: 'Class 12A', attendance: 91 },
    { name: 'Class 12B', attendance: 87 }
  ];

  // Subject performance data
  const subjectPerformanceData: ChartData[] = [
    { name: 'Mathematics', passing: 85, distinction: 45 },
    { name: 'Science', passing: 88, distinction: 40 },
    { name: 'English', passing: 92, distinction: 50 },
    { name: 'History', passing: 78, distinction: 25 },
    { name: 'Computer Science', passing: 90, distinction: 55 }
  ];

  // Prediction accuracy data
  const predictionAccuracyData: ChartData[] = [
    { name: 'Term 1', accuracy: 88 },
    { name: 'Term 2', accuracy: 90 },
    { name: 'Term 3', accuracy: 92 },
    { name: 'Term 4', accuracy: 91 },
    { name: 'Term 5', accuracy: 94 }
  ];

  // Year-over-year performance comparison
  const yearOverYearData: ChartData[] = [
    { name: 'Mathematics', '2023': 72, '2024': 76, '2025': 81 },
    { name: 'Science', '2023': 75, '2024': 79, '2025': 83 },
    { name: 'English', '2023': 81, '2024': 83, '2025': 86 },
    { name: 'History', '2023': 68, '2024': 72, '2025': 76 },
    { name: 'Computer Science', '2023': 80, '2024': 85, '2025': 89 }
  ];

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: 'Download Started',
      description: `Preparing ${reportType} report for download...`
    });
    
    setTimeout(() => {
      toast({
        title: 'Download Complete',
        description: 'Report has been downloaded successfully.'
      });
    }, 1500);
  };

  const handleFilterChange = () => {
    toast({
      title: 'Filters Applied',
      description: 'Report data has been updated with your filters.'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">School Reports</h1>
            <p className="text-muted-foreground">
              View comprehensive reports and analytics for your institution
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleDownloadReport('complete')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download All Reports
            </Button>
            <Button 
              className="bg-edu-secondary hover:bg-edu-secondary/90"
              onClick={handleFilterChange}
            >
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Class" />
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

          <Tabs defaultValue="performance" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="prediction">Prediction Accuracy</TabsTrigger>
              <TabsTrigger value="comparison">Year Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Performance Trends</CardTitle>
                  <CardDescription>
                    Average performance across all classes and subjects for {selectedYear}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceTrendData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="avg" 
                          name="Average Score" 
                          stroke="#4F46E5" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance Breakdown</CardTitle>
                  <CardDescription>
                    Pass rates and distinction percentages by subject for {selectedYear}
                  </CardDescription>
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => handleDownloadReport('subject performance')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={subjectPerformanceData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="passing" 
                          name="Pass Rate %" 
                          fill="#4F46E5" 
                        />
                        <Bar 
                          dataKey="distinction" 
                          name="Distinction %" 
                          fill="#10B981" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Class Attendance Rate</CardTitle>
                  <CardDescription>
                    Average attendance percentage by class for {selectedYear}
                  </CardDescription>
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => handleDownloadReport('attendance')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="attendance" 
                          name="Attendance %" 
                          fill="#10B981" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="prediction" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Prediction Accuracy</CardTitle>
                  <CardDescription>
                    Accuracy rate of our AI prediction system over time
                  </CardDescription>
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => handleDownloadReport('prediction')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictionAccuracyData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[50, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="accuracy" 
                          name="Accuracy %" 
                          stroke="#8B5CF6" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Year-over-Year Performance Comparison</CardTitle>
                  <CardDescription>
                    Subject performance trends across multiple years
                  </CardDescription>
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => handleDownloadReport('year comparison')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yearOverYearData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="2023" fill="#94A3B8" />
                        <Bar dataKey="2024" fill="#64748B" />
                        <Bar dataKey="2025" fill="#4F46E5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
