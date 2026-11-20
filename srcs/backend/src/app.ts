import { sessionMiddleware } from './config/session.ts';
import authRoutes from './modules/auth/auth.routes.ts';

import express, {
    type Express,
    type Request,
    type Response
} from 'express';

import { pool } from './config/database.ts';

const app: Express = express();

app.use(sessionMiddleware);
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok'
    });
});

app.get('/health/db', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.status(200).json({
            status: 'ok',
            database: result.rows[0]
        });
    } catch (error) {
        console.error('Database health check failed:', error);

        res.status(503).json({
            status: 'error',
            database: 'unavailable'
        });
    }
});

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend listening on port ${PORT}`);
});
