import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/useAuth'

export function GuestOnlyRoute() {
    const { user, isLoading } = useAuth();
    if (isLoading) 
        return <div className="min-h-screen flex items-center justify-center text-page">Loading...</div>;
    if (user)
        return <Navigate to="/dashboard" replace />;
    return <Outlet />;
}