
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface NavItem {
    path: string;
    icon: string;
    label: string;
    roles: ('admin' | 'teacher' | 'librarian')[];
    isPremium?: boolean;
}

const navItems: NavItem[] = [
    { path: '/admin-dashboard', icon: 'fas fa-tachometer-alt', label: 'ড্যাশবোর্ড', roles: ['admin'] },
    { path: '/teacher-dashboard', icon: 'fas fa-tachometer-alt', label: 'ড্যাশবোর্ড', roles: ['teacher'] },
    { path: '/add-student', icon: 'fas fa-user-plus', label: 'নতুন ছাত্র', roles: ['admin'] },
    { path: '/student-list', icon: 'fas fa-users', label: 'ছাত্র তালিকা', roles: ['admin', 'teacher'] },
    { path: '/teachers', icon: 'fas fa-chalkboard-user', label: 'স্টাফ ম্যানেজমেন্ট', roles: ['admin'] },
    { path: '/schedules', icon: 'fas fa-calendar-alt', label: 'ক্লাস শিডিউল', roles: ['admin', 'teacher'] },
    { path: '/teacher-attendance', icon: 'fas fa-user-check', label: 'ছাত্রের হাজিরা', roles: ['teacher'] },
    { path: '/class-tests', icon: 'fas fa-file-signature', label: 'ক্লাস টেস্ট ও নম্বর', roles: ['teacher'] },
    { path: '/exam-management', icon: 'fas fa-sitemap', label: 'পরীক্ষা ম্যানেজমেন্ট', roles: ['admin'], isPremium: true },
    { path: '/library-management', icon: 'fas fa-book-open-reader', label: 'লাইব্রেরি ম্যানেজমেন্ট', roles: ['admin', 'librarian'] },
    { path: '/student-leaves', icon: 'fas fa-user-clock', label: 'ছাত্রের ছুটি', roles: ['admin'] },
    { path: '/subscription', icon: 'fas fa-star', label: 'সাবস্ক্রিপশন', roles: ['admin'] },
    { path: '/settings', icon: 'fas fa-cogs', label: 'সেটিংস', roles: ['admin'] },
];

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const { user, logout, settings, subscription } = useApp();
    const location = useLocation();

    const getNavLinkClass = (path: string) => {
        return location.pathname === path
            ? 'bg-accent text-white border-l-4 border-secondary'
            : 'text-gray-200 hover:bg-accent hover:text-white border-l-4 border-transparent';
    };

    if (!user) return null;
    
    const userNavItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 bg-sidebar text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40 lg:relative lg:translate-x-0`}>
                <div className="flex flex-col items-center text-center p-5 border-b border-gray-700">
                    <img src={settings.schoolLogoUrl} alt="School Logo" className="w-16 h-16 rounded-full mb-3 bg-white object-cover" />
                    <h2 className="text-lg font-bold">{settings.schoolName}</h2>
                    <span className="text-sm text-gray-400">{user.name}</span>
                </div>
                <nav className="flex-grow overflow-y-auto">
                    <ul className="py-4">
                        {userNavItems.map(item => (
                            <li key={item.path}>
                                <NavLink to={item.path} className={`flex items-center py-3 px-6 transition-colors duration-200 ${getNavLinkClass(item.path)}`} onClick={toggleSidebar}>
                                    <i className={`${item.icon} w-6 text-center`}></i>
                                    <span className="ml-4">{item.label}</span>
                                    {item.isPremium && <i className="fas fa-crown text-premium ml-auto"></i>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={logout} className="w-full flex items-center py-3 px-6 text-gray-200 hover:bg-accent hover:text-white rounded-lg transition-colors duration-200">
                        <i className="fas fa-sign-out-alt w-6 text-center"></i>
                        <span className="ml-4">লগআউট</span>
                    </button>
                </div>
            </aside>
            {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" onClick={toggleSidebar}></div>}
        </>
    );
};

export default Sidebar;

