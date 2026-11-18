import { randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';
import { oauthConfig } from '../../config/oauth.ts';
import { exchangeAuthorizationCode, get42UserProfile } from './services/42-oauth.service.ts';

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
                // Do something with the user profile, e.g., create a new user or update an existing one
                res.json(userProfile);
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