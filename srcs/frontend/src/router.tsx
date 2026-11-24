import { AuthPage, SignInPage, SignUpPage } from '@/features'
import { DeveloperPage, FeaturesPage, LandingPage, MainContent } from '@/pages'
import { createBrowserRouter } from 'react-router'

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
        element: <AuthPage />,
        children: [
            { path: '/signin', element: <SignInPage /> },
            { path: '/signup', element: <SignUpPage /> },
        ]
    },
])

export default router;