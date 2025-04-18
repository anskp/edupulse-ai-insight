
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AttendanceRecord } from "@/types/chart";
import { format } from "date-fns";

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

const statusColors = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  late: "bg-yellow-100 text-yellow-800",
  excused: "bg-blue-100 text-blue-800",
};

export const AttendanceTable = ({ records }: AttendanceTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              {format(new Date(record.date), 'dd MMM yyyy')}
            </TableCell>
            <TableCell>{record.course_code}</TableCell>
            <TableCell>
              <Badge 
                variant="secondary" 
                className={statusColors[record.status]}
              >
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>{record.reason || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
