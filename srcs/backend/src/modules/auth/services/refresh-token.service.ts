import { randomBytes, createHash } from 'node:crypto';
import { randomUUID } from 'node:crypto';
import { createRefreshToken as insertRefreshToken, revokeRefreshToken } from '../repositories/refresh-token.repository.ts';
import { pool } from '@/config/database';
import { rotateRefreshToken } from '@/modules/auth/repositories/refresh-token.repository';

interface CreateSessionInput {
    userId: string;
    rememberMe: boolean;
}

interface CreateRefreshSession {
    token: string;
    familyId: string;
    expiresAt: Date;
}

export function generateRefreshToken(): string {
    return randomBytes(32).toString('hex');
}

export function hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}

export async function createRefreshSession(input: CreateSessionInput): Promise<CreateRefreshSession> {

    const token = generateRefreshToken();
    const tokenHash = hashRefreshToken(token);
    const familyId = randomUUID();
    const lifetimeDays = input.rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + lifetimeDays * 24 * 60 * 60 * 1000);

    await insertRefreshToken({
        userId: input.userId,
        tokenHash,
        familyId,
        expiresAt
    })

    return {
        token,
        familyId,
        expiresAt
    };

}

export async function rotateRefreshSession(token: string) {
    const newToken = generateRefreshToken();

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await rotateRefreshToken(client, {
            currentTokenHash: hashRefreshToken(token),
            newTokenHash: hashRefreshToken(newToken)
        });

        await client.query('COMMIT');

        if (result.status !== 'ROTATED') {
            return result;
        }

        return {
            status: 'ROTATED' as const,
            token: newToken,
            userId: result.userId,
            familyId: result.familyId,
            expiresAt: result.expiresAt
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function revokeRefreshSession(token: string): Promise<boolean> {
    const tokenHash = hashRefreshToken(token);
    return revokeRefreshToken(tokenHash);
}