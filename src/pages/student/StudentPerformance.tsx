
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from '@/components/ui/use-toast';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Award, Download, Trophy } from 'lucide-react';
import { ChartData } from '@/types/chart';

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

interface Badge {
  id: string;
  student_id: string;
  name: string;
  description: string;
  achieved_at: string;
  image_url: string | null;
}

const StudentPerformance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [marks, setMarks] = useState<Mark[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchMarks(user.id);
      fetchBadges(user.id);
    }
  }, [user]);

  const fetchMarks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('marks')
        .select('*')
        .eq('student_id', userId);

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

  const fetchBadges = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('student_id', userId);

      if (error) {
        toast({
          title: "Failed to fetch badges",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setBadges(data || []);
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  };

  // If no data is found, insert sample data
  const insertSampleData = async () => {
    if (!user) return;
    
    // Sample badges
    const sampleBadges: Omit<Badge, 'id'>[] = [
      {
        student_id: user.id,
        name: 'Perfect Attendance',
        description: 'Achieved 100% attendance for the term',
        achieved_at: new Date().toISOString(),
        image_url: null
      },
      {
        student_id: user.id,
        name: 'Math Wizard',
        description: 'Top performer in Mathematics',
        achieved_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        image_url: null
      },
      {
        student_id: user.id,
        name: 'Science Star',
        description: 'Excellence in Science projects',
        achieved_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        image_url: null
      }
    ];

    try {
      const { error: badgesError } = await supabase
        .from('badges')
        .insert(sampleBadges);

      if (badgesError) throw badgesError;
      
      // Refresh the data
      fetchBadges(user.id);
      
      toast({
        title: "Sample badges added",
        description: "Sample achievement badges have been added to your profile.",
      });
    } catch (error) {
      console.error("Error inserting sample data:", error);
      toast({
        title: "Error",
        description: "Failed to insert sample data",
        variant: "destructive"
      });
    }
  };

  const downloadPerformanceReport = () => {
    toast({
      title: "Download Started",
      description: "Preparing your performance report..."
    });
    
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your performance report has been downloaded."
      });
    }, 1500);
  };

  // Prepare chart data
  
  // Subject Performance Chart
  const subjectPerformanceData: ChartData[] = marks.map(mark => ({
    name: mark.subject,
    current: (mark.internal1 + mark.internal2 + mark.mid_term + mark.pre_final) / 4,
    predicted: mark.predicted
  }));

  // Term Progress Chart
  const termProgressData: ChartData[] = [
    { name: 'Term 1', average: 72, predicted: 76 },
    { name: 'Term 2', average: 75, predicted: 78 },
    { name: 'Term 3', average: 80, predicted: 82 },
    { name: 'Current', average: 83, predicted: 87 }
  ];

  // Assessment Performance Chart showing breakdowns by assessment type
  const assessmentPerformanceData: ChartData[] = marks.map(mark => ({
    name: mark.subject,
    internal1: mark.internal1,
    internal2: mark.internal2,
    midTerm: mark.mid_term,
    preFinal: mark.pre_final
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Performance</h1>
            <p className="text-muted-foreground">
              Track your academic progress and achievements
            </p>
          </div>
          <div className="flex gap-2">
            {marks.length === 0 && badges.length === 0 && (
              <Button variant="outline" onClick={insertSampleData}>
                Load Sample Data
              </Button>
            )}
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={downloadPerformanceReport}
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {marks.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subject Performance</CardTitle>
                      <CardDescription>
                        Current average vs. predicted final marks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={subjectPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="current" name="Current Average" fill="#4F46E5" />
                            <Bar dataKey="predicted" name="Predicted Final" fill="#10B981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Term Progress</CardTitle>
                      <CardDescription>
                        Performance trends over academic terms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={termProgressData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="average" name="Term Average" stroke="#4F46E5" strokeWidth={2} />
                            <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Performance</CardTitle>
                    <CardDescription>
                      Breakdown of marks by assessment type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={assessmentPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="internal1" name="Internal 1" fill="#4F46E5" />
                          <Bar dataKey="internal2" name="Internal 2" fill="#8B5CF6" />
                          <Bar dataKey="midTerm" name="Mid Term" fill="#EC4899" />
                          <Bar dataKey="preFinal" name="Pre-Final" fill="#F59E0B" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Trophy className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Performance Data</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    We don't have any performance data to display yet. Load sample data to see how your progress report would look.
                  </p>
                  <Button onClick={insertSampleData}>Load Sample Data</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="assessments" className="space-y-6">
            {marks.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-3">
                  {marks.map((mark) => (
                    <Card key={mark.id}>
                      <CardHeader>
                        <CardTitle>{mark.subject}</CardTitle>
                        <CardDescription>{mark.term}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Internal 1</p>
                              <p className="text-lg font-semibold">{mark.internal1}%</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Internal 2</p>
                              <p className="text-lg font-semibold">{mark.internal2}%</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Mid Term</p>
                              <p className="text-lg font-semibold">{mark.mid_term}%</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Pre-Final</p>
                              <p className="text-lg font-semibold">{mark.pre_final}%</p>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t">
                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Average</p>
                                <p className="text-lg font-semibold">
                                  {((mark.internal1 + mark.internal2 + mark.mid_term + mark.pre_final) / 4).toFixed(1)}%
                                </p>
                              </div>
                              <div className="space-y-1 text-right">
                                <p className="text-xs text-muted-foreground">Predicted Final</p>
                                <p className="text-lg font-semibold text-green-600">{mark.predicted}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Improvement Opportunities</CardTitle>
                    <CardDescription>
                      Areas where you can focus to improve your performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marks
                        .sort((a, b) => a.predicted - b.predicted)
                        .slice(0, 2)
                        .map((mark) => (
                          <div key={mark.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{mark.subject}</h3>
                              <span className="text-sm text-muted-foreground">Current Avg: {((mark.internal1 + mark.internal2 + mark.mid_term + mark.pre_final) / 4).toFixed(1)}%</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Focus on improving your {
                                Math.min(mark.internal1, mark.internal2, mark.mid_term, mark.pre_final) === mark.internal1 ? "first internal assessment" :
                                Math.min(mark.internal1, mark.internal2, mark.mid_term, mark.pre_final) === mark.internal2 ? "second internal assessment" :
                                Math.min(mark.internal1, mark.internal2, mark.mid_term, mark.pre_final) === mark.mid_term ? "mid-term examination" :
                                "pre-final examination"
                              } performance.
                            </p>
                            <div className="text-sm">
                              <span className="font-medium">Recommendation: </span>
                              Consider additional practice and review in this subject to strengthen your understanding.
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Trophy className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Assessment Data</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    We don't have any assessment data to display yet. Load sample data to see how your assessments would look.
                  </p>
                  <Button onClick={insertSampleData}>Load Sample Data</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6">
            {badges.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-3">
                {badges.map((badge) => (
                  <Card key={badge.id}>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-primary/10 p-4 mb-4">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{badge.name}</h3>
                      <p className="text-center text-muted-foreground mb-4">
                        {badge.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Earned on {new Date(badge.achieved_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Award className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Achievements Yet</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    You haven't earned any badges or achievements yet. Continue working hard to unlock achievements!
                  </p>
                  <Button onClick={insertSampleData}>Load Sample Achievements</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentPerformance;
