import { findUserById } from '../repositories/user.repository.ts';
import type { UserProfile } from '../repositories/user.repository.ts';

export async function getCurrentUser(userId: string): Promise<UserProfile | null> {
    const user = await findUserById(userId);

    if (!user || !user.is_active) {
        return null;
    }

    return user;
}