import { useNavigate } from 'react-router';
import { Button } from '@/components';
import { useAuth } from '@/features/auth/context/useAuth';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate('/signin', { replace: true });
    };
    return (
        <main className="min-h-screen p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b
                border-foreground/20 pb-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome,{' '}
                        <span className="text-primary">
                            {user?.displayName ?? user?.username}
                        </span>
                    </h1>
                    <p className="text-page text-sm">
                        {user?.email} • Role: {user?.globalRole}
                    </p>
                </div>
                <Button variant="secondary" onClick={handleLogout}>
                    Log out
                </Button>
            </div>
        </main>
    );
}