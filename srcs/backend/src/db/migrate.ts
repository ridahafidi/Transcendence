import 'dotenv/config';
import { readFile, readdir } from 'node:fs/promises';
import { pool } from '@/config/database';

const migrationsDirectory = new URL('./migrations/', import.meta.url);

const client = await pool.connect();

try {
    await client.query('BEGIN');

    // Prevent two migration runners from applying migrations simultaneously.
    await client.query('SELECT pg_advisory_xact_lock(421337)');

    // Create migration history if it doesn't exist.
    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    // Discover and sort all SQL migration files.
    const migrationFiles = (await readdir(migrationsDirectory))
        .filter((file) => file.endsWith('.sql'))
        .sort();

    if (migrationFiles.length === 0) {
        console.log('No migration files found.');
    }

    // Retrieve migrations that have already been applied.
    const result = await client.query(
        'SELECT name FROM schema_migrations'
    );

    const appliedMigrations = new Set(
        result.rows.map((row) => row.name)
    );

    // Apply each migration that hasn't been applied yet.
    for (const migrationName of migrationFiles) {
        if (appliedMigrations.has(migrationName)) {
            console.log(`Migration already applied: ${migrationName}`);
            continue;
        }

        const migrationPath = new URL(
            `./migrations/${migrationName}`,
            import.meta.url
        );

        const sql = await readFile(migrationPath, 'utf8');

        await client.query(sql);

        await client.query(
            'INSERT INTO schema_migrations (name) VALUES ($1)',
            [migrationName]
        );

        console.log(`Migration applied: ${migrationName}`);
    }

    await client.query('COMMIT');

    console.log('Migration process completed.');
} catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);

    console.error('Migration failed:', error);
    process.exitCode = 1;
} finally {
    client.release();
    await pool.end();
}