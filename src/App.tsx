
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Admin routes
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAttendance from "./pages/admin/AdminAttendance";

// Teacher routes
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherStudentDetail from "./pages/teacher/TeacherStudentDetail";
import TeacherMarks from "./pages/teacher/TeacherMarks";
import TeacherPredictions from "./pages/teacher/TeacherPredictions";
import TeacherSettings from "./pages/teacher/TeacherSettings";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";

// Student routes
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentMarks from "./pages/student/StudentMarks";
import StudentPerformance from "./pages/student/StudentPerformance";
import StudentSettings from "./pages/student/StudentSettings";
import StudentAttendance from "./pages/student/StudentAttendance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Admin routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/teachers" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminTeachers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/students" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminStudents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/attendance" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSettings />
              </ProtectedRoute>
            } 
          />
          
          {/* Teacher routes */}
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/students" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherStudents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/students/:id" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherStudentDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/marks" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherMarks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/attendance" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/predictions" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherPredictions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/settings" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherSettings />
              </ProtectedRoute>
            } 
          />
          
          {/* Student routes */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/marks" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentMarks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/attendance" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/performance" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPerformance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/settings" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentSettings />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
