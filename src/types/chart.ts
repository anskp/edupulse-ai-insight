
export interface ChartData {
  name: string;
  [key: string]: string | number;
}

export interface Mark {
  id: string;
  student_id: string;
  subject: string;
  course_code: string;
  course_name: string;
  internal_1: number;
  internal_2: number;
  internal_3: number;
  external_exam: number;
  series_exam: number;
  university_exam: number | null;
  predicted: number;
  semester: number;
  academic_year: string;
  max_marks: number;
  credit_hours: number;
  grade_point: number;
  letter_grade: string;
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
