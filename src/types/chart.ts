
export interface ChartData {
  name: string;
  [key: string]: string | number;
}

export interface Mark {
  id: string;
  student_id: string;
  subject: string;
  course_code: string | null;
  course_name: string | null;
  internal_1: number;
  internal_2: number;
  internal_3: number | null;
  external_exam: number;
  series_exam: number;
  university_exam: number | null;
  predicted: number;
  semester: number;
  academic_year: string | null;
  max_marks: number | null;
  credit_hours: number | null;
  grade_point: number | null;
  letter_grade: string | null;
  cgpa: number | null;
  sgpa: number | null;
  batch_year: string | null;
  department: string | null;
}

export interface SemesterPerformance {
  semester: number;
  sgpa: number;
  subjects: Mark[];
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  course_code: string;
  semester: number;
  reason?: string;
  marked_by?: string;
  academic_year: string;
}

export interface AttendanceSummary {
  student_id: string;
  course_code: string;
  semester: number;
  academic_year: string;
  total_classes: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  attendance_percentage: number;
}
