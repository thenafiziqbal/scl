
import React from 'react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
    toggleSidebar: () => void;
}

const pageTitles: { [key: string]: string } = {
    '/admin-dashboard': 'ড্যাশবোর্ড',
    '/teacher-dashboard': 'ড্যাশবোর্ড',
    '/add-student': 'নতুন ছাত্র যোগ করুন',
    '/student-list': 'ছাত্র তালিকা',
    '/teachers': 'স্টাফ ম্যানেজমেন্ট',
    '/schedules': 'ক্লাস শিডিউল',
    '/teacher-attendance': 'ছাত্রের হাজিরা',
    '/class-tests': 'ক্লাস টেস্ট ও নম্বর',
    '/exam-management': 'পরীক্ষা ম্যানেজমেন্ট',
    '/library-management': 'লাইব্রেরি ম্যানেজমেন্ট',
    '/student-leaves': 'ছাত্রের ছুটি',
    '/subscription': 'সাবস্ক্রিপশন ও পেমেন্ট',
    '/settings': 'সেটিংস',
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const location = useLocation();
    
    // Handle dynamic routes like /student-profile/:id
    let title = 'স্কুল ম্যানেজমেন্ট সিস্টেম';
    if (location.pathname.startsWith('/student-profile/')) {
        title = 'ছাত্রের প্রোফাইল';
    } else {
        title = pageTitles[location.pathname] || 'স্কুল ম্যানেজমেন্ট সিস্টেম';
    }


    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-primary">{title}</h1>
            <button onClick={toggleSidebar} className="text-primary text-2xl lg:hidden">
                <i className="fas fa-bars"></i>
            </button>
        </header>
    );
};

export default Header;
