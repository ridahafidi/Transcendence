import { findUserById } from '@/modules/auth/repositories/user.repository';
import type { UserProfile } from '@/modules/auth/repositories/user.repository';

export async function getCurrentUser(userId: string): Promise<UserProfile | null> {
    const user = await findUserById(userId);

    if (!user || !user.is_active) {
        return null;
    }

    return user;
}