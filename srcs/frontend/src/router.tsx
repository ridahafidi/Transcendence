import FortyTwoCallbackPage from './features/auth/pages/FortyTwoCallbackPage'
import ErrorPage from './pages/ErrorPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
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
    { path: '/workspaces/:workspaceId', element: <WorkspacesPage /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/login', element: <AuthPage /> },
    { path: '/register', element: <AuthPage isRegister /> },
    { path: '/signin', element: <Navigate to="/login" replace /> },
    { path: '/signup', element: <Navigate to="/register" replace /> },
    { path: '/auth/42/callback', element: <FortyTwoCallbackPage /> },
    { path: '/privacy', element: <PrivacyPolicy /> },
    { path: '/terms', element: <TermsOfService /> },
    { path: '/403', element: <ErrorPage code={403} /> },
    { path: '*', element: <ErrorPage code={404} /> },
])

export default router;