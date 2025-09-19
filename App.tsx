import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AddStudent from './pages/AddStudent';
import StudentList from './pages/StudentList';
import StaffManagement from './pages/StaffManagement';
import Schedules from './pages/Schedules';
import Attendance from './pages/Attendance';
import ClassTests from './pages/ClassTests';
import ExamManagement from './pages/ExamManagement';
import LibraryManagement from './pages/LibraryManagement';
import StudentLeaves from './pages/StudentLeaves';
import Subscription from './pages/Subscription';
import Settings from './pages/Settings';
import StudentProfile from './pages/StudentProfile';
import ProtectedRoute from './components/ProtectedRoute';
import NoticeBoard from './pages/NoticeBoard';
import FeesManagement from './pages/FeesManagement';

const AppRoutes: React.FC = () => {
    const { user } = useApp();

    if (!user) {
        return <LoginPage />;
    }

    const defaultRoute = user.role === 'admin' ? '/admin-dashboard' : user.role === 'teacher' ? '/teacher-dashboard' : '/library-management';

    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<Navigate to={defaultRoute} replace />} />
                
                {/* Admin Routes */}
                <Route path="/admin-dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/add-student" element={<ProtectedRoute roles={['admin']}><AddStudent /></ProtectedRoute>} />
                <Route path="/teachers" element={<ProtectedRoute roles={['admin']}><StaffManagement /></ProtectedRoute>} />
                <Route path="/exam-management" element={<ProtectedRoute roles={['admin']} isPremium><ExamManagement /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute roles={['admin']}><Subscription /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute roles={['admin']}><Settings /></ProtectedRoute>} />
                <Route path="/fees-management" element={<ProtectedRoute roles={['admin']}><FeesManagement /></ProtectedRoute>} />

                {/* Teacher Routes */}
                <Route path="/teacher-dashboard" element={<ProtectedRoute roles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
                <Route path="/teacher-attendance" element={<ProtectedRoute roles={['teacher']}><Attendance /></ProtectedRoute>} />
                <Route path="/class-tests" element={<ProtectedRoute roles={['teacher']}><ClassTests /></ProtectedRoute>} />

                {/* Librarian Routes */}
                <Route path="/library-management" element={<ProtectedRoute roles={['admin', 'librarian']}><LibraryManagement /></ProtectedRoute>} />

                {/* Shared Routes */}
                <Route path="/student-list" element={<ProtectedRoute roles={['admin', 'teacher']}><StudentList /></ProtectedRoute>} />
                <Route path="/student-profile/:id" element={<ProtectedRoute roles={['admin', 'teacher']}><StudentProfile /></ProtectedRoute>} />
                <Route path="/schedules" element={<ProtectedRoute roles={['admin', 'teacher']}><Schedules /></ProtectedRoute>} />
                <Route path="/student-leaves" element={<ProtectedRoute roles={['admin']}><StudentLeaves /></ProtectedRoute>} />
                <Route path="/notice-board" element={<ProtectedRoute roles={['admin', 'teacher', 'librarian']}><NoticeBoard /></ProtectedRoute>} />
            </Routes>
        </MainLayout>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </AppProvider>
    );
};

export default App;