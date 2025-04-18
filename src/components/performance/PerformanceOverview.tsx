
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartData, Mark } from "@/types/chart";

interface PerformanceOverviewProps {
  marks: Mark[];
  onInsertSampleData: () => void;
}

export const PerformanceOverview = ({ marks, onInsertSampleData }: PerformanceOverviewProps) => {
  const subjectPerformanceData: ChartData[] = marks.map(mark => ({
    name: mark.subject,
    current: (mark.internal_1 + mark.internal_2 + (mark.internal_3 || 0) + mark.series_exam) / (mark.internal_3 ? 4 : 3),
    predicted: mark.predicted
  }));

  const termProgressData: ChartData[] = [
    { name: 'Term 1', average: 72, predicted: 76 },
    { name: 'Term 2', average: 75, predicted: 78 },
    { name: 'Term 3', average: 80, predicted: 82 },
    { name: 'Current', average: 83, predicted: 87 }
  ];

  const assessmentPerformanceData: ChartData[] = marks.map(mark => ({
    name: mark.subject,
    internal1: mark.internal_1,
    internal2: mark.internal_2,
    midTerm: mark.series_exam,
    preFinal: mark.external_exam
  }));

  if (marks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Trophy className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Performance Data</h3>
          <p className="text-center text-muted-foreground mb-4">
            We don't have any performance data to display yet. Load sample data to see how your progress report would look.
          </p>
          <Button onClick={onInsertSampleData}>Load Sample Data</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Current average vs. predicted final marks</CardDescription>
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
            <CardDescription>Performance trends over academic terms</CardDescription>
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
          <CardDescription>Breakdown of marks by assessment type</CardDescription>
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
  );
};
