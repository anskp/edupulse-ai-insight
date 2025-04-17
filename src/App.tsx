
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

// Teacher routes
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

// Student routes
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentMarks from "./pages/student/StudentMarks";
import StudentPerformance from "./pages/student/StudentPerformance";
import StudentSettings from "./pages/student/StudentSettings";

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
          
          {/* Teacher routes */}
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
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
