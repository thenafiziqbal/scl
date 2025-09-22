

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
    // FIX: Changed JSX.Element to React.ReactElement for better type safety.
    children: React.ReactElement;
    roles: UserRole[];
    isPremium?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles, isPremium = false }) => {
    const { user, subscription, settings } = useApp();

    if (!user) {
        return <Navigate to="/" />;
    }

    if (!roles.includes(user.role)) {
         const defaultRoute = user.role === 'admin' ? '/admin-dashboard' : user.role === 'teacher' ? '/teacher-dashboard' : '/library-management';
        return <Navigate to={defaultRoute} />;
    }

    if (isPremium && settings.premiumFeatures.examManagement && subscription.status !== 'Active') {
        // Redirect to subscription page if feature is premium and subscription is not active
        alert('এই ফিচারটি ব্যবহার করার জন্য আপনার একটি সক্রিয় সাবস্ক্রিপশন প্রয়োজন।');
        return <Navigate to="/subscription" />;
    }

    return children;
};

export default ProtectedRoute;
