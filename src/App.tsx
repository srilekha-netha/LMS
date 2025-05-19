import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import CourseDetails from './pages/student/CourseDetails';
import CourseContent from './pages/student/CourseContent';
import StudentProfile from './pages/student/StudentProfile';
import StudentPayments from './pages/student/StudentPayments';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherCourses from './pages/teacher/TeacherCourses';
import CreateCourse from './pages/teacher/CreateCourse';
import ManageCourse from './pages/teacher/ManageCourse';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminPayments from './pages/admin/AdminPayments';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { UserRole } from './types';

function App() {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse-slow">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Student Routes */}
      <Route 
        path="/student" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/courses" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
            <StudentCourses />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/courses/:courseId" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
            <CourseDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/courses/:courseId/chapter/:chapterId" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
            <CourseContent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/profile" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
            <StudentProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/payments" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
            <StudentPayments />
          </ProtectedRoute>
        } 
      />
      
      {/* Teacher Routes */}
      <Route 
        path="/teacher" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
            <TeacherDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/courses" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
            <TeacherCourses />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/courses/create" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
            <CreateCourse />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/courses/:courseId" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
            <ManageCourse />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminUsers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/courses" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminCourses />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/payments" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminPayments />
          </ProtectedRoute>
        } 
      />
      
      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;