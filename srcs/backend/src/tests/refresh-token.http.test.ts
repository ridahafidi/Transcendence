import { pool } from '@/config/database';
import {
    createRefreshSession
} from '@/modules/auth/services/refresh-token.service';

const BASE_URL = 'http://localhost:3000';

async function main() {
    try {
        console.log('\n--- HTTP TEST: Refresh token replay ---');

        // Create a fresh session for our test user.
        const session = await createRefreshSession({
            userId: '1',
            rememberMe: false
        });

        // Simulate the browser's cookie header.
        const cookie = `refresh_token=${session.token}`;

        // First request: should rotate successfully.
        const firstResponse = await fetch(
            `${BASE_URL}/api/auth/refresh`,
            {
                method: 'POST',
                headers: { Cookie: cookie }
            }
        );

        console.log('First request:', firstResponse.status);
        await firstResponse.json();

        if (firstResponse.status !== 200) {
            throw new Error('First refresh request should succeed.');
        }

        // Second request: reuse the original token.
        const secondResponse = await fetch(
            `${BASE_URL}/api/auth/refresh`,
            {
                method: 'POST',
                headers: { Cookie: cookie }
            }
        );

        console.log('Second request:', secondResponse.status);
        await secondResponse.json();

        if (secondResponse.status !== 401) {
            throw new Error('Replayed token should be rejected.');
        }

        // Verify that the entire token family was revoked.
        const result = await pool.query(
            `SELECT id, revoked_at, replaced_by_id
             FROM refresh_tokens
             WHERE family_id = $1
             ORDER BY id`,
            [session.familyId]
        );

        console.table(result.rows);

        const allRevoked = result.rows.every(
            (token) => token.revoked_at !== null
        );

        if (!allRevoked) {
            throw new Error('Not all tokens in the family were revoked.');
        }

        console.log('\nReplay detection HTTP test passed!');
    } catch (error) {
        console.error('HTTP test failed:', error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

await main();
