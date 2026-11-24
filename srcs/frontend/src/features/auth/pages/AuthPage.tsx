import AuthBrandPanel from '@/features/auth/components/AuthBrandPanel'
import { Outlet, NavLink } from 'react-router'


export default function AuthPage() {
    return (
        <div className="h-screen flex items-center">
            <div className="flex-1 m-[15%] bg-surface px-5 py-8 rounded-2xl">
                <nav className="flex bg-foreground/5 rounded-xl p-0.5">
                    <NavLink className={"flex-1 text-center py-2 rounded-xl aria-[current=page]:bg-foreground/15"} to="/signin">Sign in</NavLink>
                    <NavLink className={"flex-1 text-center py-2 rounded-xl aria-[current=page]:bg-foreground/15"} to="/signup">Sign up</NavLink>
                </nav>
                <Outlet />
            </div>

            <AuthBrandPanel className="flex-1 self-start h-full relative hidden flex-col justify-center px-12 text-foreground lg:flex" />
        </div>
    )
}

