import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/useAuth'

export function ProtectedRoute() {
    const { user, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) 
        return <div className="min-h-screen flex items-center justify-center text-page">Loading...</div>;
    if (!user) 
        return <Navigate to="/signin" state={{ from: location }} replace />;
    return <Outlet />;
}