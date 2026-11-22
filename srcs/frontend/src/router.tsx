import WorkspacesPage from './pages/WorkspacesPage'
import { AuthPage } from '@/features'
import { Dashboard, DeveloperPage, FeaturesPage, LandingPage, MainContent } from '@/pages'
import { createBrowserRouter, Navigate } from 'react-router'

const router = createBrowserRouter([
    {
        element: <LandingPage />,
        children: [
            { path: '/', element: <MainContent /> },
            { path: '/features', element: <FeaturesPage /> },
            { path: '/developer', element: <DeveloperPage /> },
        ],
    },
    { path: '/workspaces', element: <WorkspacesPage /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/login', element: <AuthPage /> },
    { path: '/register', element: <AuthPage isRegister /> },
    { path: '/signin', element: <Navigate to="/login" replace /> },
    { path: '/signup', element: <Navigate to="/register" replace /> },
])

export default router;