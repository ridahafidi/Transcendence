import AuthBrandPanel from '@/features/auth/components/AuthBrandPanel'
import { Outlet, NavLink } from 'react-router'

const navClass = ({ isActive }: { isActive: boolean }) => `flex-1 text-center py-2 rounded-md ${isActive ? 'bg-background' : ''}`

export default function AuthPage() {
    return (
        <div className="h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="flex justify-center items-center">
                <div className="bg-surface p-10 rounded-2xl">
                    <nav className="flex bg-foreground/5 rounded-xl p-2">
                        <NavLink className={navClass} to="/signin">Sign in</NavLink>
                        <NavLink className={navClass} to="/signup">Sign up</NavLink>
                    </nav>
                    <Outlet />
                </div>
            </div>
            <AuthBrandPanel className="relative hidden flex-col justify-center px-12 text-foreground md:flex" />
        </div>
    )
}

