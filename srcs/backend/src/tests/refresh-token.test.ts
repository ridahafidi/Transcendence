import { pool } from '@/config/database';
import {
    createRefreshSession,
    hashRefreshToken,
    rotateRefreshSession
} from '@/modules/auth/services/refresh-token.service';

async function main() {
    try {
        // TEST 5: Concurrent refresh requests
        console.log('\n--- TEST 5: Concurrent refresh requests ---');

        const concurrentSession = await createRefreshSession({
            userId: '1',
            rememberMe: false
        });

        const [request1, request2] = await Promise.all([
            rotateRefreshSession(concurrentSession.token),
            rotateRefreshSession(concurrentSession.token)
        ]);

        console.log('Request 1:', request1.status);
        console.log('Request 2:', request2.status);

        const statuses = [request1.status, request2.status];

        const rotatedCount = statuses.filter(
            status => status === 'ROTATED'
        ).length;

        const reusedCount = statuses.filter(
            status => status === 'REUSED'
        ).length;

        if (rotatedCount !== 1 || reusedCount !== 1) {
            throw new Error('Concurrent rotation protection failed');
        }

        const concurrentResult = await pool.query(
            `
            SELECT id, revoked_at, replaced_by_id
            FROM refresh_tokens
            WHERE family_id = $1
            ORDER BY id
            `,
            [concurrentSession.familyId]
        );

        console.table(concurrentResult.rows);

        const concurrentFamilyRevoked = concurrentResult.rows.every(
            row => row.revoked_at !== null
        );

        if (!concurrentFamilyRevoked) {
            throw new Error('Concurrent reuse did not revoke the family');
        }

        console.log('Concurrent refresh test passed!');

        // TEST 6: Expired refresh token
        console.log('\n--- TEST 6: Expired refresh token ---');

        const expiredSession = await createRefreshSession({
            userId: '1',
            rememberMe: false
        });

        await pool.query(
            `
            UPDATE refresh_tokens
            SET expires_at = NOW() - INTERVAL '1 minute'
            WHERE token_hash = $1
            `,
            [hashRefreshToken(expiredSession.token)]
        );

        const expiredResult = await rotateRefreshSession(expiredSession.token);

        console.log('Expired token result:', expiredResult.status);

        if (expiredResult.status !== 'EXPIRED') {
            throw new Error('Expired token was incorrectly accepted');
        }

        console.log('Expiration test passed!');
        console.log('\n--- TEST 7: Ordinary token revocation ---');

const revokedSession = await createRefreshSession({
    userId: '1',
    rememberMe: false
});

// Simulate logout.
await pool.query(
    `
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE token_hash = $1
    `,
    [hashRefreshToken(revokedSession.token)]
);

const revokedResult = await rotateRefreshSession(revokedSession.token);

console.log('Revoked token result:', revokedResult.status);

if (revokedResult.status !== 'REVOKED') {
    throw new Error('Ordinary revocation was incorrectly classified');
}

console.log('Ordinary revocation test passed!');
        console.log('\nAll tests passed!');

    } catch (error) {
        console.error('Test failed:', error);
        process.exitCode = 1;

    } finally {
        // Close the pool exactly once, after all tests.
        await pool.end();
    }
}

await main();
