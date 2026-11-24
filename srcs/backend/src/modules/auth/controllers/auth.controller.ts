import { randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';
import { oauthConfig } from '@/config/oauth';
import { exchangeAuthorizationCode, get42UserProfile } from '@/modules/auth/services/42-oauth.service';
import { resolve42User } from '@/modules/auth/services/42-oauth.service';
import { signAccessToken } from '@/modules/auth/services/jwt.service';
import { createRefreshSession } from '@/modules/auth/services/refresh-token.service';
import { setAuthCookies } from '@/modules/auth/utils/auth-cookies';


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
                await new Promise<void>((resolve, reject) => {
                    req.session.regenerate((error) => {
                        if (error) 
                        {
                            reject(error);
                            return;
                        }

                    resolve();
                    });
                });

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

