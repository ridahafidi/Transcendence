import type { CreatedUser } from '@/modules/auth/repositories/user.repository';
import type { PoolClient } from 'pg';

export interface CreateUserInput {
    username: string;
    email: string;
    passwordHash: string;
    globalRole: 'ADMIN' | 'USER';
    badgeColor: string;
}

export async function createUser(input: CreateUserInput, client: PoolClient): Promise<CreatedUser | null> {
    const result = await client.query<CreatedUser>(
        `INSERT INTO users (
            username,
            email,
        password_hash,
        global_role,
        badge_color
        )
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
        RETURNING
        id,
        username,
        email,
        display_name,
        global_role,
        created_at,
        badge_color`,
        [
            input.username,
            input.email,
            input.passwordHash,
            input.globalRole,
            input.badgeColor
        ]
    );
    if (result.rows.length === 0) {
        return null; // User already exists, return null
    }
    return result.rows[0];
}