import { AuthPage } from '@/features'
import { DeveloperPage, FeaturesPage, LandingPage, MainContent } from '@/pages'
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
    { path: '/login', element: <AuthPage /> },
    { path: '/register', element: <AuthPage isRegister /> },
    { path: '/signin', element: <Navigate to="/login" replace /> },
    { path: '/signup', element: <Navigate to="/register" replace /> },
])

export default router;