import type { Request, Response } from 'express';
import { signAccessToken } from '@/modules/auth/services/jwt.service';
import { createRefreshSession } from '@/modules/auth/services/refresh-token.service';
import { loginUser } from '@/modules/auth/services/login.service';
import { setAuthCookies } from '@/modules/auth/utils/auth-cookies';
import type { LoginInput } from '@shared/validation/login.schema';

export async function login(req: Request<{}, any, LoginInput>, res: Response): Promise<void> {
    try {
        const user = await loginUser({
            email: req.body.email,
            password: req.body.password
        });
        
        if (!user) {
            res.status(401).json({
                message: 'Invalid email or password.'
            });
            return;
        }

        const refreshSession = await createRefreshSession({
            userId: user.id,
            rememberMe: req.body.rememberMe ?? false
        });

        const accessToken = await signAccessToken(user.id);

        setAuthCookies(res, accessToken, refreshSession.token, refreshSession.expiresAt);

        res.status(200).json({
            message: 'Login successful.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                displayName: user.display_name,
                globalRole: user.global_role,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal server error.'
        });
    }
}