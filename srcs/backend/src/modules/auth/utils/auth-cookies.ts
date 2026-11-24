import type { Request, Response } from 'express';

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string, refreshExpiresAt: Date): void {
    const secure = process.env.NODE_ENV === 'production';

    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/api/v1/auth',
        maxAge: Math.max(0, refreshExpiresAt.getTime() - Date.now()), // Set maxAge based on expiresAt
    });
}

export function clearAuthCookies(res: Response): void {
    const secure = process.env.NODE_ENV === 'production';

    res.clearCookie('access_token', {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
    });

    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/api/v1/auth',
    });
}