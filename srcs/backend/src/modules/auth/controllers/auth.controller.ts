import { randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';
import { oauthConfig } from '../../../config/oauth.ts';
import { exchangeAuthorizationCode, get42UserProfile } from '../services/42-oauth.service.ts';
import { resolve42User } from '../services/42-oauth.service.ts';
import { signAccessToken } from '../services/jwt.service.ts';
import { createRefreshSession, rotateRefreshSession } from '../services/refresh-token.service.ts';
import { revokeRefreshSession } from '../services/refresh-token.service.ts';

function setAuthCookies(res: Response, accessToken: string, refreshToken: string, refreshExpiresAt: Date): void {
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
        path: '/api/auth',
        maxAge: Math.max(0, refreshExpiresAt.getTime() - Date.now()), // Set maxAge based on expiresAt
    });
}

function clearAuthCookies(res: Response): void {
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
        path: '/api/auth',
    });
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


export function handle42Callback(req: Request, res: Response): void {
    const { code, state } = req.query;

    if (typeof code !== 'string' || typeof state !== 'string' || !code || !state) {
        res.status(400).send('Invalid code or state parameter.');
        return;
    }

    if (!req.session.oauthState || req.session.oauthState !== state) {
        res.status(400).send('Invalid state parameter.');
        return;
    }
    
    req.session.oauthState = undefined;

    req.session.save((error) => {
        if (error) {
            res.status(500).send('Failed to save session.');
            return;
        }
        exchangeAuthorizationCode(code)
            .then((tokenResponse) => {
                return get42UserProfile(tokenResponse.access_token);
            })
            .then((userProfile) => {
                return resolve42User(userProfile);
            })
            .then(async (user) => {
                const refreshSession = await createRefreshSession({
                    userId: user.id,
                    rememberMe: false
                });

                const accessToken = await signAccessToken(user.id);

                setAuthCookies(res, accessToken, refreshSession.token, refreshSession.expiresAt);

                return res.status(200).json({
                    message: 'Authentication successful',
                });
            })
            .catch((error) => {
                console.error('Error occurred while fetching 42 user profile:', error);
                res.status(500).send('Error occurred while fetching 42 user profile.');
            });
    });
}

export function start42OAuth(req: Request, res: Response): void {
    const authUrl = new URL(oauthConfig.authUrl);
    const state = randomBytes(32).toString('hex');

    authUrl.searchParams.set('client_id', oauthConfig.clientId);
    authUrl.searchParams.set('redirect_uri', oauthConfig.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'public');
    authUrl.searchParams.set('state', state);

    req.session.oauthState = state;
    req.session.save((error) => {
        if (error) {
            res.status(500).send('Failed to initialize OAuth session.');
            return;
        }
        res.redirect(authUrl.toString());
    });
}

