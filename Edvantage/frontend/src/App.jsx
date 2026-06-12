import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import StudentDashboard from './pages/StudentDashboard';
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout children={<Outlet />} />}>
          <Route index element={<Overview />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/:id" element={<StudentProfile />} />
          <Route path="risk" element={<RuleEditor />} />
          <Route path="interventions" element={<Interventions />} />
          <Route path="messages" element={<ChatHub />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<SchoolSettings />} />
          <Route path="bulk" element={<BulkOperations />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="search" element={<AdvancedSearch />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
