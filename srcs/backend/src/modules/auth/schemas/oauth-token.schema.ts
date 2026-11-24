import {z} from 'zod';

export const oauthTokenSchema = z.object({
    
   access_token: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'Access token is required.'
                : 'Access token must be a string.',
    }),
    token_type: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'Token type is required.'
                : 'Token type must be a string.',
    }),
    expires_in: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'Expires in is required.'
                : 'Expires in must be a number.',
    }),
    scope: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'Scope is required.'
                : 'Scope must be a string.',
    }),
    refresh_token: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'Refresh token is required.'
                : 'Refresh token must be a string.',
    }),
    created_at: z.number({
        error: (issue) =>
            issue.input === undefined
                ? 'Created at is required.'
                : 'Created at must be a number.',
    }),
})

export type OAuthToken = z.infer<typeof oauthTokenSchema>;