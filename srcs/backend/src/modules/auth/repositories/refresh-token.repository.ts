import { pool } from '../../../config/database.ts';
import type { PoolClient } from 'pg';

interface CreateRefreshTokenInput {
    userId: string;
    tokenHash: string;
    familyId: string;
    expiresAt: Date;
}

export interface RefreshTokenRecord {
    id: string;
    user_id: string;
    token_hash: string;
    family_id: string;
    expires_at: Date;
    revoked_at: Date | null;
    replaced_by_id: string | null;
    created_at: Date;
}

interface RotateRefreshTokenInput {
    currentTokenHash: string;
    newTokenHash: string;
}

export async function createRefreshToken(input: CreateRefreshTokenInput): Promise<void> {

    await pool.query(
        `
        INSERT INTO refresh_tokens (
            user_id,
            token_hash,
            family_id,
            expires_at
        ) VALUES ($1, $2, $3, $4)
        `,
        [
            input.userId,
            input.tokenHash,
            input.familyId,
            input.expiresAt
        ]
    );
}

export async function findRefreshToken(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const result = await pool.query<RefreshTokenRecord>(
        `
        SELECT
            id,
            user_id,
            token_hash,
            family_id,
            expires_at,
            revoked_at,
            replaced_by_id,
            created_at
        FROM refresh_tokens
        WHERE token_hash = $1
        `,
        [tokenHash]
    );
    return result.rows[0] ?? null;
}

export async function revokeRefreshToken(tokenHash: string): Promise<boolean> {
    const result = await pool.query(
        `
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE token_hash = $1 AND revoked_at IS NULL
        RETURNING id
        `,
        [tokenHash]
    );
    return result.rowCount !== null && result.rowCount > 0;
}

export async function revokeTokenFamily(familyId: string): Promise<number> {
    const result = await pool.query(
        `
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE family_id = $1 AND revoked_at IS NULL
        RETURNING id
        `,
        [familyId]
    );
    return result.rowCount ?? 0;
}

export async function rotateRefreshToken(client: PoolClient, input: RotateRefreshTokenInput): Promise<
    | { status: 'ROTATED'; newTokenId: string; userId: string; familyId: string; expiresAt: Date }
    | { status: 'NOT_FOUND' | 'REVOKED' | 'EXPIRED' | 'REUSED' }> {
    // 1. Find and lock the token's database row.
    const result = await client.query<RefreshTokenRecord>(
        `
        SELECT
            id,
            user_id,
            token_hash,
            family_id,
            expires_at,
            revoked_at,
            replaced_by_id,
            created_at
        FROM refresh_tokens
        WHERE token_hash = $1
        FOR UPDATE
        `,
        [input.currentTokenHash]
    );

    const current = result.rows[0];

    if (!current) {
        return { status: 'NOT_FOUND' };
    }

    // 2. Detect reuse of an already-rotated token.
    if (current.replaced_by_id !== null) {
        await revokeFamilyOnReuse(client, current.family_id);
        return { status: 'REUSED' };
    }

    // 3. Check whether the token was revoked independently.
    if (current.revoked_at !== null) {
        return { status: 'REVOKED' };
    }

    // 4. Check expiration.
    if (current.expires_at <= new Date()) {
        return { status: 'EXPIRED' };
    }

    // 5. Create the replacement token in the same family.
    const newToken = await client.query<{ id: string }>(
        `
        INSERT INTO refresh_tokens (
            user_id,
            token_hash,
            family_id,
            expires_at
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [
            current.user_id,
            input.newTokenHash,
            current.family_id,
            current.expires_at
        ]
    );

    const newTokenId = newToken.rows[0].id;

    // 6. Mark the old token as revoked and link it to its replacement.
    await client.query(
        `
        UPDATE refresh_tokens
        SET revoked_at = NOW(),
            replaced_by_id = $1
        WHERE id = $2
        `,
        [newTokenId, current.id]
    );

    return {
        status: 'ROTATED',
        newTokenId,
        userId: current.user_id,
        familyId: current.family_id,
        expiresAt: current.expires_at
    };
}

export async function revokeFamilyOnReuse(client: PoolClient, familyId: string): Promise<number>{
    const result = await client.query(
        `
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE family_id = $1 AND revoked_at IS NULL
        `,
        [familyId]
    );
    return result.rowCount ?? 0;
}