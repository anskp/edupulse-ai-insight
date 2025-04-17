
import { Users, GraduationCap, BarChart2, ClipboardCheck } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ChartCard from '@/components/dashboard/ChartCard';

// Mock data
const performanceData = [
  { name: 'Class 9A', avg: 72, min: 45, max: 98 },
  { name: 'Class 9B', avg: 68, min: 42, max: 95 },
  { name: 'Class 10A', avg: 76, min: 50, max: 99 },
  { name: 'Class 10B', avg: 71, min: 48, max: 94 },
  { name: 'Class 11A', avg: 82, min: 65, max: 100 },
  { name: 'Class 11B', avg: 79, min: 60, max: 97 },
  { name: 'Class 12A', avg: 85, min: 68, max: 100 },
  { name: 'Class 12B', avg: 83, min: 67, max: 99 },
];

const predictionsAccuracy = [
  { name: 'Jan', accuracy: 78 },
  { name: 'Feb', accuracy: 82 },
  { name: 'Mar', accuracy: 85 },
  { name: 'Apr', accuracy: 89 },
  { name: 'May', accuracy: 91 },
  { name: 'Jun', accuracy: 90 },
  { name: 'Jul', accuracy: 92 },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all school metrics and performance indicators.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Teachers"
            value="64"
            change={8}
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Students"
            value="1,284"
            change={12}
            icon={<GraduationCap className="h-4 w-4" />}
          />
          <StatsCard
            title="Prediction Accuracy"
            value="92%"
            change={4}
            icon={<BarChart2 className="h-4 w-4" />}
          />
          <StatsCard
            title="Assessments Complete"
            value="86%"
            change={-2}
            icon={<ClipboardCheck className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard
            title="Class Performance Overview"
            description="Average, minimum and maximum scores by class"
            type="bar"
            data={performanceData}
            series={[
              { name: 'Average', dataKey: 'avg', color: '#4F46E5' },
              { name: 'Minimum', dataKey: 'min', color: '#EF4444' },
              { name: 'Maximum', dataKey: 'max', color: '#10B981' },
            ]}
          />
          <ChartCard
            title="Prediction Accuracy Trend"
            description="AI prediction accuracy over time"
            type="line"
            data={predictionsAccuracy}
            series={[
              { name: 'Accuracy %', dataKey: 'accuracy', color: '#8B5CF6' },
            ]}
          />
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent System Updates</h2>
          <ul className="space-y-2">
            <li className="flex items-center justify-between border-b pb-2">
              <span>AI Model Retrained with Latest Data</span>
              <span className="text-sm text-muted-foreground">2 days ago</span>
            </li>
            <li className="flex items-center justify-between border-b pb-2">
              <span>Term 2 Assessment Data Imported</span>
              <span className="text-sm text-muted-foreground">5 days ago</span>
            </li>
            <li className="flex items-center justify-between border-b pb-2">
              <span>New Teacher Accounts Created</span>
              <span className="text-sm text-muted-foreground">1 week ago</span>
            </li>
            <li className="flex items-center justify-between">
              <span>System Maintenance Complete</span>
              <span className="text-sm text-muted-foreground">2 weeks ago</span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
