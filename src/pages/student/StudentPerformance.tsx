
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from '@/components/dashboard/ChartCard';

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
  image_url: string | null;
  achieved_at: string;
}

const StudentPerformance = () => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchStudentData(user.id);
    }
  }, [user]);

  const fetchStudentData = async (userId: string) => {
    setIsLoading(true);
    try {
      // Fetch marks
      const { data: marksData, error: marksError } = await (supabase as any)
        .from('marks')
        .select('*')
        .eq('student_id', userId);

      if (marksError) throw marksError;
      
      // Fetch badges
      const { data: badgesData, error: badgesError } = await (supabase as any)
        .from('badges')
        .select('*')
        .eq('student_id', userId);

      if (badgesError) throw badgesError;

      setMarks(marksData || []);
      setBadges(badgesData || []);
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPerformanceData = () => {
    return marks.map(mark => ({
      subject: mark.subject,
      'Internal 1': mark.internal1,
      'Internal 2': mark.internal2,
      'Mid Term': mark.mid_term,
      'Pre-Final': mark.pre_final,
      Predicted: mark.predicted
    }));
  };

  const getOverallAverage = () => {
    if (marks.length === 0) return 0;
    
    const allScores = marks.flatMap(mark => [
      mark.internal1, mark.internal2, mark.mid_term, mark.pre_final
    ]);
    
    const sum = allScores.reduce((total, score) => total + score, 0);
    return sum / allScores.length;
  };

  const getPerformanceTrend = () => {
    if (marks.length === 0) return [];
    
    return marks.map(mark => {
      const scores = [mark.internal1, mark.internal2, mark.mid_term, mark.pre_final];
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      return {
        name: mark.subject,
        average: parseFloat(average.toFixed(2)),
        predicted: mark.predicted
      };
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Performance Dashboard</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading performance data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Overall Average</CardTitle>
                  <CardDescription>Based on all assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {getOverallAverage().toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Subject Count</CardTitle>
                  <CardDescription>Total subjects enrolled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {marks.length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Total badges earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {badges.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Performance</CardTitle>
                  <CardDescription>Scores across different assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={getPerformanceData()} 
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Internal 1" fill="#8884d8" />
                        <Bar dataKey="Internal 2" fill="#82ca9d" />
                        <Bar dataKey="Mid Term" fill="#ffc658" />
                        <Bar dataKey="Pre-Final" fill="#ff8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average vs Predicted</CardTitle>
                  <CardDescription>Comparison of your average performance with predicted scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={getPerformanceTrend()} 
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" fill="#8884d8" name="Your Average" />
                        <Bar dataKey="predicted" fill="#82ca9d" name="Predicted" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Achievements & Badges</CardTitle>
                <CardDescription>Recognition for your academic accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                {badges.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No badges earned yet. Keep up the good work!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {badges.map((badge) => (
                      <Card key={badge.id} className="overflow-hidden">
                        <div className="bg-muted p-4 flex justify-center">
                          {badge.image_url ? (
                            <img 
                              src={badge.image_url} 
                              alt={badge.name} 
                              className="h-16 w-16 object-contain"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                              {badge.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-1">{badge.name}</h3>
                          <p className="text-sm text-muted-foreground">{badge.description}</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {new Date(badge.achieved_at).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentPerformance;
