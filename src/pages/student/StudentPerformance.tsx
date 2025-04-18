
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChartCard from '@/components/dashboard/ChartCard';
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
import { Loader2, TrendingUp, Award, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Mark {
  id: string;
  student_id: string;
  subject: string;
  internal1: number;
  internal2: number;
  mid_term: number;
  pre_final: number;
  predicted: number;
  final: number | null;
  term: string;
}

interface Badge {
  id: string;
  student_id: string;
  name: string;
  description: string;
  image_url: string | null;
  achieved_at: string;
}

const performanceInsights = [
  {
    subject: 'Mathematics',
    strength: 'Strong analytical skills and problem-solving abilities.',
    improvement: 'Consider practicing more complex problems for extra challenge.',
    percentile: 92,
  },
  {
    subject: 'Science',
    strength: 'Good understanding of scientific concepts and theories.',
    improvement: 'Focus on practical applications and real-world examples.',
    percentile: 85,
  },
  {
    subject: 'English',
    strength: 'Excellent comprehension and writing skills.',
    improvement: 'More practice with advanced vocabulary would be beneficial.',
    percentile: 88,
  },
  {
    subject: 'History',
    strength: 'Strong knowledge of historical events and their impact.',
    improvement: 'Try connecting historical patterns to current events.',
    percentile: 78,
  },
  {
    subject: 'Computer Science',
    strength: 'Excellent programming skills and logical thinking.',
    improvement: 'Explore more advanced algorithms and data structures.',
    percentile: 95,
  },
];

const StudentPerformance = () => {
  const { user } = useAuthStore();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.id) {
      fetchStudentData(user.id);
    }
  }, [user]);

  const fetchStudentData = async (userId: string) => {
    setLoading(true);
    try {
      // Fetch marks
      const { data: marksData, error: marksError } = await supabase
        .from('marks')
        .select('*')
        .eq('student_id', userId);

      if (marksError) throw marksError;
      
      // Fetch badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .eq('student_id', userId);

      if (badgesError) throw badgesError;

      setMarks(marksData || []);
      setBadges(badgesData || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load performance data.',
        variant: 'destructive',
      });
      
      // Use mock data for now if there's an error
      setMarks(generateMockMarks());
      setBadges(generateMockBadges());
    } finally {
      setLoading(false);
    }
  };

  const generateMockMarks = (): Mark[] => {
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];
    const terms = ['Fall 2024', 'Winter 2024', 'Spring 2025'];
    
    return subjects.flatMap((subject, i) => 
      terms.map((term, j) => ({
        id: `mock-${i}-${j}`,
        student_id: user?.id || 'mock-user',
        subject,
        internal1: 70 + Math.floor(Math.random() * 20),
        internal2: 75 + Math.floor(Math.random() * 20),
        mid_term: 70 + Math.floor(Math.random() * 25),
        pre_final: 75 + Math.floor(Math.random() * 20),
        predicted: 80 + Math.floor(Math.random() * 15),
        final: j === terms.length - 1 ? null : 75 + Math.floor(Math.random() * 20),
        term
      }))
    );
  };

  const generateMockBadges = (): Badge[] => {
    return [
      {
        id: 'mock-badge-1',
        student_id: user?.id || 'mock-user',
        name: 'Math Star',
        description: 'Outstanding performance in Mathematics',
        image_url: null,
        achieved_at: new Date().toISOString(),
      },
      {
        id: 'mock-badge-2',
        student_id: user?.id || 'mock-user',
        name: 'Perfect Attendance',
        description: 'Never missed a class all semester',
        achieved_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-badge-3',
        student_id: user?.id || 'mock-user',
        name: 'Science Explorer',
        description: 'Top performer in Science projects',
        achieved_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
  };

  // Filter marks by selected term
  const filteredMarks = selectedTerm === 'all' 
    ? marks 
    : marks.filter(mark => mark.term === selectedTerm);

  // Get unique terms for the select dropdown
  const terms = [...new Set(marks.map(mark => mark.term))];

  // Generate data for the current vs predicted chart
  const currentVsPredictedData = filteredMarks.map(mark => ({
    subject: mark.subject,
    current: Math.round((mark.internal1 + mark.internal2 + mark.mid_term + mark.pre_final) / 4),
    predicted: mark.predicted,
  }));

  // Generate data for the progress over time chart
  const progressData = terms.map(term => {
    const termMarks = marks.filter(mark => mark.term === term);
    const avgCurrent = termMarks.length > 0 
      ? Math.round(termMarks.reduce((sum, mark) => 
          sum + (mark.internal1 + mark.internal2 + mark.mid_term + mark.pre_final) / 4, 0) / termMarks.length) 
      : 0;
    const avgPredicted = termMarks.length > 0 
      ? Math.round(termMarks.reduce((sum, mark) => sum + mark.predicted, 0) / termMarks.length) 
      : 0;
    
    return {
      term,
      average: avgCurrent,
      predicted: avgPredicted,
    };
  });

  // Generate data for subject breakdown chart
  const subjectBreakdownData = [...new Set(filteredMarks.map(mark => mark.subject))].map(subject => {
    const subjectMarks = filteredMarks.filter(mark => mark.subject === subject);
    return {
      subject,
      internal1: subjectMarks.reduce((sum, mark) => sum + mark.internal1, 0) / subjectMarks.length,
      internal2: subjectMarks.reduce((sum, mark) => sum + mark.internal2, 0) / subjectMarks.length,
      midTerm: subjectMarks.reduce((sum, mark) => sum + mark.mid_term, 0) / subjectMarks.length,
      preFinal: subjectMarks.reduce((sum, mark) => sum + mark.pre_final, 0) / subjectMarks.length,
    };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Performance Analytics</h1>
            <p className="text-muted-foreground">
              Detailed analysis of your academic performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Select
              value={selectedTerm}
              onValueChange={setSelectedTerm}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                {terms.map(term => (
                  <SelectItem key={term} value={term}>{term}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading performance data...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Current vs Predicted Performance</CardTitle>
                    <CardDescription>
                      Comparison between your current average and AI-predicted final scores
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ChartCard
                      title=""
                      description=""
                      type="bar"
                      data={currentVsPredictedData}
                      series={[
                        { name: 'Current Average', dataKey: 'current', color: '#4F46E5' },
                        { name: 'AI Predicted', dataKey: 'predicted', color: '#10B981' },
                      ]}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Progress</CardTitle>
                    <CardDescription>
                      Your performance trend across terms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ChartCard
                      title=""
                      description=""
                      type="line"
                      data={progressData}
                      series={[
                        { name: 'Average Score', dataKey: 'average', color: '#4F46E5' },
                        { name: 'Predicted Score', dataKey: 'predicted', color: '#10B981' },
                      ]}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Insights
                  </CardTitle>
                  <CardDescription>
                    AI-generated insights based on your performance patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {performanceInsights.slice(0, 3).map((insight, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{insight.subject}</h3>
                            <div className="mt-1 text-xs text-muted-foreground space-y-1">
                              <p><span className="font-medium text-foreground">Strength:</span> {insight.strength}</p>
                              <p><span className="font-medium text-foreground">To improve:</span> {insight.improvement}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="text-xs font-medium">Percentile:</div>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${insight.percentile}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs font-medium">{insight.percentile}%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" onClick={() => setActiveTab('detailed')}>
                      View Detailed Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="detailed" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Breakdown</CardTitle>
                  <CardDescription>
                    Performance breakdown by assessment types for each subject
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ChartCard
                    title=""
                    description=""
                    type="bar"
                    data={subjectBreakdownData}
                    series={[
                      { name: 'Internal 1', dataKey: 'internal1', color: '#4F46E5' },
                      { name: 'Internal 2', dataKey: 'internal2', color: '#10B981' },
                      { name: 'Mid Term', dataKey: 'midTerm', color: '#F59E0B' },
                      { name: 'Pre-Final', dataKey: 'preFinal', color: '#EF4444' },
                    ]}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Performance Insights</CardTitle>
                  <CardDescription>
                    Subject-wise detailed analysis and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {performanceInsights.map((insight, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Sparkles className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">{insight.subject}</h3>
                            <div className="mt-2 space-y-2">
                              <div>
                                <h4 className="text-sm font-medium">Strengths:</h4>
                                <p className="text-sm text-muted-foreground">{insight.strength}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Areas for Improvement:</h4>
                                <p className="text-sm text-muted-foreground">{insight.improvement}</p>
                              </div>
                              <div className="pt-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">Performance Percentile:</span>
                                  <span className="font-bold">{insight.percentile}%</span>
                                </div>
                                <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${insight.percentile}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="badges" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Academic Badges
                  </CardTitle>
                  <CardDescription>
                    Achievements and recognitions you've earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {badges.length > 0 ? (
                      badges.map((badge) => (
                        <div key={badge.id} className="border rounded-lg p-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="bg-primary/10 p-4 rounded-full mb-4">
                              <Award className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">{badge.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                            <p className="text-xs text-muted-foreground">
                              Awarded on {new Date(badge.achieved_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <Award className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium">No Badges Yet</h3>
                        <p className="text-muted-foreground mt-2">
                          Keep up the good work to earn academic badges!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentPerformance;
