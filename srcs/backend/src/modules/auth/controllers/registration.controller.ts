import type { Request, Response } from 'express';
import { signAccessToken } from '@/modules/auth/services/jwt.service';
import { createRefreshSession } from '@/modules/auth/services/refresh-token.service';
import { registerUser } from '@/modules/auth/services/registration.service';
import { setAuthCookies } from '@/modules/auth/utils/auth-cookies';
import type { RegisterInput } from '@repo/shared';

export async function register(req: Request<{}, any, RegisterInput>, res: Response): Promise<void> {
    try {
        const user = await registerUser(req.body);

        const refreshSession = await createRefreshSession({
            userId: user.id,
            rememberMe: false
        });

        const accessToken = await signAccessToken(user.id);

        setAuthCookies(res, accessToken, refreshSession.token, refreshSession.expiresAt);

        res.status(201).json({
            message: 'Account created successfully.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                displayName: user.display_name,
                globalRole: user.global_role,
                createdAt: user.created_at
            }
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'USERNAME_OR_EMAIL_ALREADY_EXISTS') {
                res.status(409).json({
                    message: 'Username or email already exists.'
                });
                return;
            }

            if (error.message === 'PASSWORD_COMPROMISED') {
                res.status(400).json({
                    error: {
                        code: 'PASSWORD_COMPROMISED',
                        message: 'This password has appeared in known data breaches. Please choose a different password.'
                    }
                });
                return;
            }

            if (error.message === 'PASSWORD_BREACH_CHECK_UNAVAILABLE') {
                res.status(503).json({
                    error: {
                        code: 'PASSWORD_BREACH_CHECK_UNAVAILABLE',
                        message: 'Password security verification is temporarily unavailable. Please try again later.'
                    }
                });
                return;
            }
        }

        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Internal server error.'
        });
    }
}