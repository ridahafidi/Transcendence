import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
_retry?: boolean;
}
export const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true, 
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});
const AUTH_SKIP_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh',
'/auth/logout'];
let refreshPromise: Promise<void> | null = null;
async function refreshSession(): Promise<void> {
    if (!refreshPromise) {
        refreshPromise = api
        .post('/auth/refresh')
        .then(() => undefined)
        .finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
}
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? '';
    const shouldSkip = AUTH_SKIP_REFRESH.some((path) => url.includes(path));
    if (status === 401 && originalRequest && !originalRequest._retry && !shouldSkip) {
        originalRequest._retry = true;
        try {
            await refreshSession();
            return api(originalRequest);
        catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});