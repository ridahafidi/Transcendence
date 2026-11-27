import { createBrowserRouter } from 'react-router';
import { AuthPage, SignInPage, SignUpPage } from '@/features';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { GuestOnlyRoute } from '@/features/auth/components/GuestOnlyRoute';
import { Dashboard, DeveloperPage, FeaturesPage, LandingPage, MainContent } from '@/pages';

const router = createBrowserRouter([
    {
        element: <LandingPage />,
        children: [
            { path: '/', element: <MainContent /> },
            { path: '/features', element: <FeaturesPage /> },
            { path: '/developer', element: <DeveloperPage /> },
        ],
    },
    {
        element: <GuestOnlyRoute />,
        children: [
            {
                element: <AuthPage />,
                children: [
                    { path: '/signin', element: <SignInPage /> },
                    { path: '/signup', element: <SignUpPage /> },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            { path: '/dashboard', element: <Dashboard /> }
        ],
    },
]);
export default router;