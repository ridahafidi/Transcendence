import type { Request, Response } from 'express';
import { signAccessToken } from '@/modules/auth/services/jwt.service';
import { rotateRefreshSession } from '@/modules/auth/services/refresh-token.service';
import { revokeRefreshSession } from '@/modules/auth/services/refresh-token.service';
import { setAuthCookies, clearAuthCookies } from '@/modules/auth/utils/auth-cookies';

export async function logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refresh_token;

    try {
        if (typeof refreshToken === 'string') {
            await revokeRefreshSession(refreshToken);
        }

        clearAuthCookies(res);

        res.status(200).json({
            message: 'Logged out successfully.'
        });
    } catch (error) {
        console.error('Logout error:', error);

        res.status(500).json({
            message: 'Internal server error.'
        });
    }
}

export async function refreshAccessToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken || typeof refreshToken !== 'string')
    {
        clearAuthCookies(res);
        res.status(401).json({ message: 'Refresh token missing.' });
        return;
    }
    try {
        const result = await rotateRefreshSession(refreshToken);

        if (result.status !== 'ROTATED') {
            clearAuthCookies(res);

            res.status(401).json({
                message: 'Refresh token is invalid or expired.'
            });
            return;
        }

        const accessToken = await signAccessToken(result.userId);

        setAuthCookies(res, accessToken, result.token, result.expiresAt);
        
        res.status(200).json({
            message: 'Access token refreshed successfully.'
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}