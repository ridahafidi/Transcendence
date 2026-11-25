import { z } from 'zod';

export const loginSchema = z.object({
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

    password: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'Password is required.'
                : 'Password must be a string.',
    })
        .min(1, 'Password is required.'),

    rememberMe: z.boolean({
        error: 'Remember me must be a boolean.',
    }).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;