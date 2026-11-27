import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { authApi } from '../api/auth.api';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth.types';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const refreshUser = useCallback(async () => {
        try {
            const me = await authApi.getMe();
            setUser(me);
        }
        catch {
            setUser(null);
        }
    }, []);
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const me = await authApi.getMe();if (active) setUser(me);
            }
            catch {
                if (active) setUser(null);
            }
            finally {
                if (active) setIsLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);
    const login = useCallback(async (payload: LoginPayload) => {
        const res = await authApi.login(payload);
        setUser(res.user);
        return res.user;
    }, []);
    const register = useCallback(async (payload: RegisterPayload) => {
        const res = await authApi.register(payload);
        setUser(res.user);
        return res.user;
    }, []);
    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        }
        finally {
            setUser(null);
        }
    }, []);
    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}