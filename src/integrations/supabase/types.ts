export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          issuer_id: string
          name: string
          price: number
          supply: number
          token_id: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          issuer_id: string
          name: string
          price: number
          supply: number
          token_id: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          issuer_id?: string
          name?: string
          price?: number
          supply?: number
          token_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "assets_issuer_id_fkey"
            columns: ["issuer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          academic_year: string
          course_code: string
          created_at: string | null
          date: string
          id: string
          marked_by: string | null
          reason: string | null
          semester: number
          status: string
          student_id: string
        }
        Insert: {
          academic_year: string
          course_code: string
          created_at?: string | null
          date: string
          id?: string
          marked_by?: string | null
          reason?: string | null
          semester: number
          status: string
          student_id: string
        }
        Update: {
          academic_year?: string
          course_code?: string
          created_at?: string | null
          date?: string
          id?: string
          marked_by?: string | null
          reason?: string | null
          semester?: number
          status?: string
          student_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          achieved_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          student_id: string
        }
        Insert: {
          achieved_at?: string
          description: string
          id?: string
          image_url?: string | null
          name: string
          student_id: string
        }
        Update: {
          achieved_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          student_id?: string
        }
        Relationships: []
      }
      marks: {
        Row: {
          academic_year: string | null
          batch_year: string | null
          cgpa: number | null
          course_code: string | null
          course_name: string | null
          created_at: string | null
          credit_hours: number | null
          department: string | null
          external_exam: number
          grade_point: number | null
          id: string
          internal_1: number
          internal_2: number
          internal_3: number | null
          letter_grade: string | null
          max_marks: number | null
          predicted: number
          semester: number
          series_exam: number
          sgpa: number | null
          student_id: string
          subject: string
          university_exam: number | null
        }
        Insert: {
          academic_year?: string | null
          batch_year?: string | null
          cgpa?: number | null
          course_code?: string | null
          course_name?: string | null
          created_at?: string | null
          credit_hours?: number | null
          department?: string | null
          external_exam: number
          grade_point?: number | null
          id?: string
          internal_1: number
          internal_2: number
          internal_3?: number | null
          letter_grade?: string | null
          max_marks?: number | null
          predicted: number
          semester?: number
          series_exam: number
          sgpa?: number | null
          student_id: string
          subject: string
          university_exam?: number | null
        }
        Update: {
          academic_year?: string | null
          batch_year?: string | null
          cgpa?: number | null
          course_code?: string | null
          course_name?: string | null
          created_at?: string | null
          credit_hours?: number | null
          department?: string | null
          external_exam?: number
          grade_point?: number | null
          id?: string
          internal_1?: number
          internal_2?: number
          internal_3?: number | null
          letter_grade?: string | null
          max_marks?: number | null
          predicted?: number
          semester?: number
          series_exam?: number
          sgpa?: number | null
          student_id?: string
          subject?: string
          university_exam?: number | null
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          created_at: string | null
          experience: string
          id: string
          interest: string
          knowledge: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          experience: string
          id?: string
          interest: string
          knowledge: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          experience?: string
          id?: string
          interest?: string
          knowledge?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password_hash: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password_hash: string
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password_hash?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      attendance_summary: {
        Row: {
          absent_count: number | null
          academic_year: string | null
          attendance_percentage: number | null
          course_code: string | null
          excused_count: number | null
          late_count: number | null
          present_count: number | null
          semester: number | null
          student_id: string | null
          total_classes: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_grade_point: {
        Args: { marks: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
