import axios from 'axios';
import { api } from '@/lib/api';
import type {
    AuthResponse,
    AuthUser,
    BackendErrorBody,
    LoginPayload,
    RegisterPayload,
} from '../types/auth.types';

export interface NormalizedApiError {
    status?: number;
    code?: string;
    message: string;
    fieldErrors: Record<string, string[]>;
}
export function parseApiError(err: unknown): NormalizedApiError {
    if (!axios.isAxiosError<BackendErrorBody>(err)) {
        return { message: 'An unexpected error occurred.', fieldErrors: {} };
    }
    if (!err.response) {
        return {
            message: 'Cannot reach the server. Please check your connection.',
            fieldErrors: {},
        };
    }
    const { status, data } = err.response;
    const fieldErrors: Record<string, string[]> = {};
    if (data?.error?.errors) {
        for (const issue of data.error.errors) {
            fieldErrors[issue.field] = [...(fieldErrors[issue.field] ?? []),
            issue.message];
        }
    }
    const message = data?.error?.message ?? data?.message ?? `Request failed with status ${status}.`;
    return { status, code: data?.error?.code, message, fieldErrors };
}
export const authApi = {
    async login(payload: LoginPayload): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/login', payload);
        return data;
    },
    async register(payload: RegisterPayload): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/register', payload);
        return data;
    },
    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },
    async getMe(): Promise<AuthUser> {
      const { data } = await api.get<AuthUser>('/auth/me');
      if (!data || typeof data !== 'object' || !('id' in data)) {
          throw new Error('Invalid auth response');
      }
      return data;
    },
    start42OAuth(): void {
        window.location.assign('/api/v1/auth/42');
    },
};