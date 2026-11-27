export type GlobalRole = 'ADMIN' | 'USER' |
'GUEST';
export interface AuthUser {
    id: string;
    username: string;
    email: string;
    displayName: string | null;
    globalRole: GlobalRole;
    createdAt: string;
}
export interface AuthResponse {
    message: string;
    user: AuthUser;
}
export interface LoginPayload {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}
export interface BackendValidationIssue {
    field: string;
    message: string;
}
export interface BackendErrorBody {
    message?: string;
    error?: {
        code?: string;
        message?: string;
        errors?: BackendValidationIssue[];
    };
}