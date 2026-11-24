import { pool } from '@/config/database';

export interface AuthenticatedUser {
    id: string;
    email: string;
    username: string;
    display_name: string | null;
}

interface New42Profile{
    id: number;
    login: string;
    email: string;
    first_name: string;
    last_name: string;
}

export async function find42Account(providerUserId: string): Promise<AuthenticatedUser | null> {
    const result = await pool.query<AuthenticatedUser>(
        `SELECT
            users.id,
            users.email,
            users.username,
            users.display_name
        FROM oauth_accounts
        JOIN users ON oauth_accounts.user_id = users.id
        WHERE oauth_accounts.provider_user_id = $1
        AND oauth_accounts.provider = $2` ,
        [providerUserId, '42']
    );

    return result.rows[0] ?? null;
}

export async function create42Account(profile: New42Profile): Promise<AuthenticatedUser> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const displayName = `${profile.first_name} ${profile.last_name}`.trim();

        const userResult = await client.query<AuthenticatedUser>(
            `INSERT INTO users (email, username, display_name, global_role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, username, display_name` ,
            [
                profile.email,
                profile.login,
                displayName,
                `USER`
            ]
        )

        const user = userResult.rows[0];

        if (!user) {
            throw new Error('Failed to create Transcendence user account');
        }

        await client.query(
            `INSERT INTO oauth_accounts (user_id, provider, provider_user_id)
            VALUES ($1, $2, $3)` ,
            [
                user.id,
                '42',
                profile.id.toString()
            ]
        );

        await client.query('COMMIT');
        return user;
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
}