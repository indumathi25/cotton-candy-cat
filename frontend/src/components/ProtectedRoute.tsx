import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../store/authSlice';
import { UserRole } from '../types/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && user?.role !== role) {
        // Redirect to appropriate dashboard if wrong role
        return <Navigate to={user?.role === 'STUDENT' ? '/student' : '/admin'} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
