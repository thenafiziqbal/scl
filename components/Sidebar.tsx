import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  path: string;
  icon: string;
  label: string;
  roles: UserRole[];
  isPremium?: boolean;
}

const navItems: NavItem[] = [
    { path: '/admin-dashboard', icon: 'fas fa-tachometer-alt', label: 'ড্যাশবোর্ড', roles: ['admin'] },
    { path: '/teacher-dashboard', icon: 'fas fa-tachometer-alt', label: 'ড্যাশবোর্ড', roles: ['teacher'] },
    { path: '/department-head-dashboard', icon: 'fas fa-tachometer-alt', label: 'ড্যাশবোর্ড', roles: ['department-head'] },
    { path: '/add-student', icon: 'fas fa-user-plus', label: 'নতুন ছাত্র', roles: ['admin'] },
    { path: '/student-list', icon: 'fas fa-users', label: 'ছাত্র তালিকা', roles: ['admin', 'department-head'] },
    { path: '/teachers', icon: 'fas fa-chalkboard-user', label: 'স্টাফ ম্যানেজমেন্ট', roles: ['admin'] },
    { path: '/schedules', icon: 'fas fa-calendar-alt', label: 'ক্লাস শিডিউল', roles: ['admin'] },
    { path: '/teacher-attendance', icon: 'fas fa-user-check', label: 'ছাত্রের হাজিরা', roles: ['teacher', 'admin', 'department-head'] },
    { path: '/class-tests', icon: 'fas fa-file-alt', label: 'ক্লাস টেস্ট', roles: ['teacher'] },
    { path: '/exam-management', icon: 'fas fa-graduation-cap', label: 'পরীক্ষা ম্যানেজমেন্ট', roles: ['admin'], isPremium: true },
    { path: '/fees-management', icon: 'fas fa-money-bill-wave', label: 'ফি ম্যানেজমেন্ট', roles: ['admin'] },
    { path: '/library-management', icon: 'fas fa-book', label: 'লাইব্রেরি', roles: ['librarian', 'admin'] },
    { path: '/student-leaves', icon: 'fas fa-calendar-times', label: 'ছাত্রের ছুটি', roles: ['admin', 'teacher', 'department-head'] },
    { path: '/notice-board', icon: 'fas fa-bullhorn', label: 'নোটিশ বোর্ড', roles: ['admin', 'teacher', 'department-head', 'librarian'] },
    { path: '/subscription', icon: 'fas fa-star', label: 'সাবস্ক্রিপশন', roles: ['admin'] },
    { path: '/settings', icon: 'fas fa-cog', label: 'সেটিংস', roles: ['admin'] },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const { user, logout, subscription, settings } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleSidebar}
            ></div>

            <aside
                className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 bg-sidebar text-white transform transition-transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 flex flex-col`}
            >
                <div className="p-4 text-center border-b border-gray-700">
                    <h2 className="text-2xl font-bold">স্কুল পোর্টাল</h2>
                </div>
                <nav className="flex-1 p-2 space-y-1">
                    {filteredNavItems.map(item => {
                        const isPremiumFeature = item.isPremium && settings.premiumFeatures.examManagement;
                        const isSubscriptionInactive = subscription.status !== 'Active';

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                title={item.label}
                                className={({ isActive }) =>
                                `flex items-center p-3 rounded-lg transition-colors hover:bg-accent ${
                                    isActive ? 'bg-accent' : ''
                                }`
                                }
                            >
                                <i className={`${item.icon} w-6 text-center`}></i>
                                <span className="ml-3">{item.label}</span>
                                {isPremiumFeature && (
                                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isSubscriptionInactive ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                        PRO
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-700">
                     <p className="text-sm text-center text-gray-400 mb-2">Logged in as {user.name} ({user.role})</p>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center p-3 rounded-lg bg-danger hover:bg-red-700 transition-colors"
                    >
                        <i className="fas fa-sign-out-alt w-6 text-center"></i>
                        <span className="ml-3">লগআউট</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
