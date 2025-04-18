
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AttendanceSummary } from "@/types/chart";
import { CalendarCheck, CalendarX, Clock } from "lucide-react";

interface AttendanceSummaryCardProps {
  summary: AttendanceSummary;
}

export const AttendanceSummaryCard = ({ summary }: AttendanceSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
        <CardDescription>
          {summary.course_code} - Semester {summary.semester}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Progress 
            value={summary.attendance_percentage} 
            className="h-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {summary.attendance_percentage}% Attendance
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-full">
              <CalendarCheck className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{summary.present_count}</p>
              <p className="text-xs text-muted-foreground">Present</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-full">
              <CalendarX className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{summary.absent_count}</p>
              <p className="text-xs text-muted-foreground">Absent</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{summary.late_count}</p>
              <p className="text-xs text-muted-foreground">Late</p>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Total Classes: {summary.total_classes}
        </div>
      </CardContent>
    </Card>
  );
};
