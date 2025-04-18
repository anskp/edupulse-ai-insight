
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartData } from "@/types/chart";

interface StudentPerformanceChartsProps {
  subjectPerformanceData: ChartData[];
}

export const StudentPerformanceCharts = ({ subjectPerformanceData }: StudentPerformanceChartsProps) => {
  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={subjectPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="actual" name="Current Average" fill="#4F46E5" />
            <Bar dataKey="predicted" name="Predicted Final" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 border rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Class Rank</p>
          <p className="text-2xl font-semibold">5th</p>
          <p className="text-xs text-muted-foreground">Top 15%</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Overall Average</p>
          <p className="text-2xl font-semibold">85%</p>
          <p className="text-xs text-green-600">↑ 3% from last term</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Predicted Average</p>
          <p className="text-2xl font-semibold">88%</p>
          <p className="text-xs text-green-600">↑ 5% from current</p>
        </div>
      </div>
    </div>
  );
};
