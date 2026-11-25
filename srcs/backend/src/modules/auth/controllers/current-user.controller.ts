import type { Request, Response } from 'express';
import { getCurrentUser } from '@/modules/auth/services/current-user.service';

export async function getMe(req: Request, res: Response): Promise<void> {
    try{
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Authentication required.' });
            return;
        }

        const user = await getCurrentUser(userId);

        if (!user) {
            res.status(401).json({ message: 'Authentication required.' });
            return;
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.display_name,
            globalRole: user.global_role,
            createdAt: user.created_at
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}