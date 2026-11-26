import { loginSchema } from '@repo/shared';

export interface LoginValidationError {
    field: 'email' | 'password' | 'rememberMe' | 'body';
    message: string;
}

export interface LoginValidationResult {
    valid: boolean;
    errors: LoginValidationError[];
}

export function validateLoginInput(input: unknown): LoginValidationResult {
    const result = loginSchema.safeParse(input);

    if (!result.success) {
        const errors: LoginValidationError[] = result.error.issues.map((issue) => {
            const field = issue.path[0];

            if (
                field === 'email' ||
                field === 'password' ||
                field === 'rememberMe'
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
