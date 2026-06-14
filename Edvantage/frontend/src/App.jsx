import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import ParentDashboard from './pages/ParentDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import StudentList from './pages/StudentList';
import RuleEditor from './pages/RuleEditor';
import Interventions from './pages/Interventions';
import StudentProfile from './pages/StudentProfile';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import ChatHub from './pages/ChatHub';
import UserManagement from './pages/UserManagement';
import SchoolSettings from './pages/SchoolSettings';
import BulkOperations from './pages/BulkOperations';
import Analytics from './pages/Analytics';
import AdvancedSearch from './pages/AdvancedSearch';
import Placeholder from './pages/Placeholder';

// Component to decide which dashboard to show based on role
const DashboardIndex = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'superadmin':
      return <SuperAdminDashboard />;
    case 'admin':
    case 'supervisor':
      return <Overview />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'counselor':
      return <CounselorDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout children={<Outlet />} />}>
          <Route index element={<DashboardIndex />} />
          
          {/* Shared Routes with RBAC handled inside components or Sidebar */}
          <Route path="students" element={<StudentList />} />
          <Route path="students/:id" element={<StudentProfile />} />
          <Route path="messages" element={<ChatHub />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="search" element={<AdvancedSearch />} />
          
          {/* Role-Specific Placeholder Modules */}
          <Route path="attendance" element={<Placeholder title="Attendance" />} />
          <Route path="grades" element={<Placeholder title="Grades" />} />
          <Route path="referrals" element={<Placeholder title="Referrals" />} />
          
          {/* Admin/Superadmin Specific */}
          <Route path="risk" element={<RuleEditor />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<SchoolSettings />} />
          <Route path="bulk" element={<BulkOperations />} />
          <Route path="interventions" element={<Interventions />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
