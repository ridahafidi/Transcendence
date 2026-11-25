import { z } from 'zod';

export const oauthProfileSchema = z.object({
    id: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'ID is required.'
                : 'ID must be a number.',
    }),
    login: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'Login is required.'
                : 'Login must be a string.',
    }),
    email: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'Email is required.'
                : 'Email must be a string.',
    }).email('Please provide a valid email address.'),
    first_name: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'First name is required.'
                : 'First name must be a string.',
    }),
    last_name: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'Last name is required.'
                : 'last name must be a string.',
    }),
    url: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'URL is required.'
                : 'URL must be a string.',
    }).url('Please provide a valid URL.'),
    image: z.object({
        link: z.string({
            error: (issue) =>
                issue.input === undefined
                    ? 'Image link is required.'
                    : 'Image link must be a string.',
        }).url('Please provide a valid image URL.'),
    }),
});

export type OAuthProfile = z.infer<typeof oauthProfileSchema>;