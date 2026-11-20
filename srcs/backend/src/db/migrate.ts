import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { pool } from '../config/database.ts';

const migrationName = '001_initial_schema.sql';

const migrationPath = new URL(
    `./migrations/${migrationName}`,
    import.meta.url
);

const client = await pool.connect();

try {
    await client.query('BEGIN');

    await client.query('SELECT pg_advisory_xact_lock(421337)');

    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    const result = await client.query(
        'SELECT name FROM schema_migrations WHERE name = $1',
        [migrationName]
    );

    if (result.rows.length > 0) {
        console.log(`Migration already applied: ${migrationName}`);
    } else {
        const sql = await readFile(migrationPath, 'utf8');

        await client.query(sql);

        await client.query(
            'INSERT INTO schema_migrations (name) VALUES ($1)',
            [migrationName]
        );

        console.log(`Migration applied: ${migrationName}`);
    }

    await client.query('COMMIT');
} catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);

    console.error('Migration failed:', error);
    process.exitCode = 1;
} finally {
    client.release();
    await pool.end();
}