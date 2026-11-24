import { registerSchema } from '../schemas/register.schema.ts';

export interface ValidationError {
    field: 'username' | 'email' | 'password' | 'body';
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

export function validateRegistrationInput(input: unknown): ValidationResult {
    const result = registerSchema.safeParse(input);

    if (!result.success) {
        const errors: ValidationError[] = result.error.issues.map((issue) => {
            const field = issue.path[0];

            if (
                field === 'username' ||
                field === 'email' ||
                field === 'password'
            ) {
                return {
                    field,
                    message: issue.message,
                };
            }

            return {
                field: 'body',
                message: 'Request body must be an object.',
            };
        });

        return {
            valid: false,
            errors,
        };
    }

    return {
        valid: true,
        errors: [],
    };
}