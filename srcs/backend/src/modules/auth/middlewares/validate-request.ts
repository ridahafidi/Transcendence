import { z } from 'zod';
import type {Request, Response, NextFunction, RequestHandler} from 'express';

export function validateRequest<T extends z.ZodType>(schema: T): RequestHandler {
    function middleware(req: Request, res: Response, next: NextFunction): void {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.length > 0
                    ? issue.path.join('.')
                    : 'body',
                message: issue.message,
            }));

            res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Request validation failed.',
                    errors,
                },
            });

            return;
        }

        req.body = result.data;

        next();
    }

    return middleware;
}
