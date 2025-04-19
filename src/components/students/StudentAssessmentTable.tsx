
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
  editable?: boolean;
  onScoreUpdate?: (subject: string, field: string, value: number) => void;
}

export const StudentAssessmentTable = ({ 
  subjectPerformance, 
  editable = false,
  onScoreUpdate
}: StudentAssessmentTableProps) => {
  const handleScoreChange = (subject: string, field: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && onScoreUpdate) {
      onScoreUpdate(subject, field, numValue);
    }
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Internal 1</TableHead>
            <TableHead>Internal 2</TableHead>
            <TableHead>Mid Semester</TableHead>
            <TableHead>Pre-Final</TableHead>
            <TableHead>Current Avg</TableHead>
            <TableHead>Predicted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjectPerformance.map((subject, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{subject.subject}</TableCell>
              <TableCell>
                {editable ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-16 p-1 border rounded"
                    value={subject.internal1}
                    onChange={(e) => handleScoreChange(subject.subject, 'internal1', e.target.value)}
                  />
                ) : (
                  subject.internal1
                )}
              </TableCell>
              <TableCell>
                {editable ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-16 p-1 border rounded"
                    value={subject.internal2}
                    onChange={(e) => handleScoreChange(subject.subject, 'internal2', e.target.value)}
                  />
                ) : (
                  subject.internal2
                )}
              </TableCell>
              <TableCell>
                {editable ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-16 p-1 border rounded"
                    value={subject.midTerm}
                    onChange={(e) => handleScoreChange(subject.subject, 'midTerm', e.target.value)}
                  />
                ) : (
                  subject.midTerm
                )}
              </TableCell>
              <TableCell>
                {editable ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-16 p-1 border rounded"
                    value={subject.preFinal}
                    onChange={(e) => handleScoreChange(subject.subject, 'preFinal', e.target.value)}
                  />
                ) : (
                  subject.preFinal
                )}
              </TableCell>
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
