import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/jwt.service.ts';

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try
    {
        const token = req.cookies?.access_token;
        if (!token || typeof token !== 'string')
        {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        const payload = await verifyAccessToken(token);
        
        if (!payload.sub) {
            res.status(401).json({ message: 'Invalid access token.' });
            return;
        }

        req.user = { id: payload.sub };
        next();
    }
    catch
    {
        res.status(401).json({ message: 'Authentication required' });
    }
}