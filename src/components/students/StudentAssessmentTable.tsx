
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SubjectPerformance {
  subject: string;
  internal1: number;
  internal2: number;
  midTerm: number;
  preFinal: number;
  predicted: number;
}

interface StudentAssessmentTableProps {
  subjectPerformance: SubjectPerformance[];
}

export const StudentAssessmentTable = ({ subjectPerformance }: StudentAssessmentTableProps) => {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Internal 1</TableHead>
            <TableHead>Internal 2</TableHead>
            <TableHead>Mid Term</TableHead>
            <TableHead>Pre-Final</TableHead>
            <TableHead>Current Avg</TableHead>
            <TableHead>Predicted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjectPerformance.map((subject, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{subject.subject}</TableCell>
              <TableCell>{subject.internal1}</TableCell>
              <TableCell>{subject.internal2}</TableCell>
              <TableCell>{subject.midTerm}</TableCell>
              <TableCell>{subject.preFinal}</TableCell>
              <TableCell>
                {Math.round((subject.internal1 + subject.internal2 + subject.midTerm + subject.preFinal) / 4)}
              </TableCell>
              <TableCell className="font-semibold text-green-600">
                {subject.predicted}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
