import * as z from 'zod'

export const signInSchema = z
    .object({
        email: z.email("Enter a valid email address"),
        password: z.string().min(8, "Use at least 8 characters"),
    })

export type signInInput = z.infer<typeof signInSchema>