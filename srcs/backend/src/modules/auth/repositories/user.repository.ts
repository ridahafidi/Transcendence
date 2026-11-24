import { pool } from '@/config/database';

export interface CreateUserInput {
    username: string;
    email: string;
    passwordHash: string;
    badgeColor: string;
}

export interface CreatedUser {
    id: string;
    username: string;
    email: string;
    display_name: string | null;
    global_role: string;
    created_at: Date;
    badge_color: string;
}

export interface LoginUser {
    id: string;
    username: string;
    email: string;
    display_name: string | null;
    password_hash: string | null;
    global_role: string;
    created_at: Date;
    is_active: boolean;
    badge_color: string;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    display_name: string | null;
    global_role: string;
    created_at: Date;
    is_active: boolean;
    badge_color: string;
}

export async function findUserById(id: string): Promise<UserProfile | null> {
    const result = await pool.query<UserProfile>(
        `SELECT
            id,
            username,
            email,
            display_name,
            global_role,
            created_at,
            is_active,
            badge_color
         FROM users
         WHERE id = $1
         LIMIT 1`,
        [id]
    );

    return result.rows[0] ?? null;
}

export async function findUserByLogin(identifier: string): Promise<LoginUser | null> {
    const result = await pool.query<LoginUser>(
        `SELECT
            id,
            username,
            email,
            password_hash,
            display_name,
            global_role,
            created_at,
            is_active,
            badge_color
         FROM users
         WHERE email = $1
         LIMIT 1`,
        [identifier]
    );

    return result.rows[0] ?? null;
}

export async function createUser(input: CreateUserInput): Promise<CreatedUser> {
    const result = await pool.query<CreatedUser>(
        `INSERT INTO users (
            username,
            email,
            password_hash,
            global_role,
            badge_color
        )
        VALUES ($1, $2, $3, 'USER', $4)
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
            input.badgeColor
        ]
    );

    return result.rows[0];
}

export async function findUserByUsernameOrEmail(username: string, email: string): Promise<boolean> {
    const result = await pool.query(
        `SELECT 1
         FROM users
         WHERE username = $1 OR email = $2
         LIMIT 1`,
        [username, email]
    );

    return result.rowCount !== null && result.rowCount > 0;
}