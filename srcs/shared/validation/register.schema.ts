import { z } from 'zod';

export const passwordSchema = z.string({
    error: (issue) =>
        issue.input === undefined
            ? 'Password is required.'
            : 'Password must be a string.',
})
    .min(12, 'Password must be at least 12 characters long.')
    .max(128, 'Password must not exceed 128 characters.');

export const registerSchema = z.object({
    username: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'Username is required.'
                : 'Username must be a string.',
    })
        .trim()
        .min(3, 'Username must contain at least 3 characters.')
        .max(20, 'Username must not exceed 20 characters.')
        .regex(
            /^[a-zA-Z0-9_]+$/,
            'Username can only contain letters, numbers, and underscores.',
        ),

    email: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'Email is required.'
                : 'Email must be a string.',
    })
        .trim()
        .min(1, 'Email is required.')
        .max(255, 'Email must not exceed 255 characters.')
        .email('Please provide a valid email address.'),

    password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
