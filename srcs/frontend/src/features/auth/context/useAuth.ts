import { createContext, useContext } from 'react';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth.types';

export interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<AuthUser>;
    register: (payload: RegisterPayload) => Promise<AuthUser>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextValue | null>(null);
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) 
        throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}