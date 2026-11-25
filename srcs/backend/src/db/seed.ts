import { hashPassword } from '@/modules/auth/services/password.service';
import {createUser} from '@/modules/auth/repositories/seed-user.repository';
import 'dotenv/config'; // Load environment variables from .env file
import { pool } from '@/config/database';
import type { PoolClient } from 'pg';

const SEED_PASSWORD = process.env.SEED_PASSWORD;

if (!SEED_PASSWORD) {
    throw new Error('SEED_PASSWORD environment variable is not set.');
}

const seedPasswordHash = await hashPassword(SEED_PASSWORD);

const seedAdmin = {
    email: 'admin@transcendence.local',
    username: 'admin',
    passwordHash: seedPasswordHash,
    globalRole: 'ADMIN' as const,
    badgeColor: '#FF0000', // Example badge color for admin
};

const seedUser1 = {
    email: 'user1@transcendence.local',
    username: 'user1',
    passwordHash: seedPasswordHash,
    globalRole: 'USER' as const,
    badgeColor: '#00FF00', // Example badge color for user1
};

const seedUser2 = {
    email: 'user2@transcendence.local',
    username: 'user2',
    passwordHash: seedPasswordHash,
    globalRole: 'USER' as const,
    badgeColor: '#0000FF', // Example badge color for user2
};

const seedUser3 = {
    email: 'user3@transcendence.local',
    username: 'user3',
    passwordHash: seedPasswordHash,
    globalRole: 'USER' as const,
    badgeColor: '#FFFF00', // Example badge color for user3
};

const seedUsers = [seedAdmin, seedUser1, seedUser2, seedUser3];

const client = await pool.connect();
try {
    await client.query('BEGIN');
    for (const user of seedUsers) {
    const createdUser = await createUser(user, client);
    if (createdUser) {
        console.log(`Seeded user: ${createdUser.username} (${createdUser.email})`);
    } else {
        console.log(`User already exists: ${user.username} (${user.email})`);
    }
    }
    await client.query('COMMIT');
} catch (error: unknown) {
    try {
        await client.query('ROLLBACK');
    } catch (rollbackError: unknown) {
        throw new AggregateError([error, rollbackError], 'Error during seeding and rollback');
    }
    throw error;
} finally {
    client.release();
}
