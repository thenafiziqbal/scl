import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import DepartmentHeadDashboard from './pages/DepartmentHeadDashboard';
import StudentList from './pages/StudentList';
import AddStudent from './pages/AddStudent';
import StudentProfile from './pages/StudentProfile';
import StaffManagement from './pages/StaffManagement';
import Schedules from './pages/Schedules';
import Attendance from './pages/Attendance';
import ClassTests from './pages/ClassTests';
import ExamManagement from './pages/ExamManagement';
import LibraryManagement from './pages/LibraryManagement';
import StudentLeaves from './pages/StudentLeaves';
import NoticeBoard from './pages/NoticeBoard';
import FeesManagement from './pages/FeesManagement';
import Subscription from './pages/Subscription';
import Settings from './pages/Settings';
import Loader from './components/Loader';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

const AppRoutes: React.FC = () => {
    const { user, loading } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && user && location.pathname === '/') {
            switch (user.role) {
                case 'admin':
                    navigate('/admin-dashboard');
                    break;
                case 'teacher':
                    navigate('/teacher-dashboard');
                    break;
                case 'department-head':
                    navigate('/department-head-dashboard');
                    break;
                case 'librarian':
                    navigate('/library-management');
                    break;
                case 'super-admin':
                    navigate('/super-admin-dashboard');
                    break;
                default:
                    navigate('/');
            }
        }
    }, [user, loading, navigate, location.pathname]);

    if (loading) {
        return <Loader />;
    }

    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />

            {/* Super Admin Route */}
            <Route path="/super-admin-dashboard" element={<ProtectedRoute roles={['super-admin']}><SuperAdminDashboard /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<ProtectedRoute roles={['admin']}><MainLayout><AdminDashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/add-student" element={<ProtectedRoute roles={['admin']}><MainLayout><AddStudent /></MainLayout></ProtectedRoute>} />
            <Route path="/student-list" element={<ProtectedRoute roles={['admin', 'department-head']}><MainLayout><StudentList /></MainLayout></ProtectedRoute>} />
            <Route path="/student-profile/:id" element={<ProtectedRoute roles={['admin', 'teacher', 'department-head']}><MainLayout><StudentProfile /></MainLayout></ProtectedRoute>} />
            <Route path="/teachers" element={<ProtectedRoute roles={['admin']}><MainLayout><StaffManagement /></MainLayout></ProtectedRoute>} />
            <Route path="/schedules" element={<ProtectedRoute roles={['admin']}><MainLayout><Schedules /></MainLayout></ProtectedRoute>} />
            <Route path="/exam-management" element={<ProtectedRoute roles={['admin']} isPremium><MainLayout><ExamManagement /></MainLayout></ProtectedRoute>} />
            <Route path="/fees-management" element={<ProtectedRoute roles={['admin']}><MainLayout><FeesManagement /></MainLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute roles={['admin']}><MainLayout><Settings /></MainLayout></ProtectedRoute>} />

            {/* Teacher Routes */}
            <Route path="/teacher-dashboard" element={<ProtectedRoute roles={['teacher']}><MainLayout><TeacherDashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/teacher-attendance" element={<ProtectedRoute roles={['teacher', 'admin', 'department-head']}><MainLayout><Attendance /></MainLayout></ProtectedRoute>} />
            <Route path="/class-tests" element={<ProtectedRoute roles={['teacher']}><MainLayout><ClassTests /></MainLayout></ProtectedRoute>} />

            {/* Department Head Routes */}
            <Route path="/department-head-dashboard" element={<ProtectedRoute roles={['department-head']}><MainLayout><DepartmentHeadDashboard /></MainLayout></ProtectedRoute>} />

            {/* Librarian Routes */}
            <Route path="/library-management" element={<ProtectedRoute roles={['librarian', 'admin']}><MainLayout><LibraryManagement /></MainLayout></ProtectedRoute>} />

            {/* Common Routes */}
            <Route path="/student-leaves" element={<ProtectedRoute roles={['admin', 'teacher', 'department-head']}><MainLayout><StudentLeaves /></MainLayout></ProtectedRoute>} />
            <Route path="/notice-board" element={<ProtectedRoute roles={['admin', 'teacher', 'department-head', 'librarian']}><MainLayout><NoticeBoard /></MainLayout></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute roles={['admin']}><MainLayout><Subscription /></MainLayout></ProtectedRoute>} />

        </Routes>
    );
};

const App: React.FC = () => {
  return (
    <AppProvider>
        <Router>
            <AppRoutes />
        </Router>
    </AppProvider>
  );
}

export default App;