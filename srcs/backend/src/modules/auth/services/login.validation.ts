export interface LoginValidationError {
    field: 'email' | 'password' | 'rememberMe' | 'body';
    message: string;
}

export interface LoginValidationResult {
    valid: boolean;
    errors: LoginValidationError[];
}

export function validateLoginInput(input: unknown): LoginValidationResult {
    const errors: LoginValidationError[] = [];

    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        return {
            valid: false,
            errors: [{ field: 'body', message: 'Request body must be an object.' }],
        };
    }

    const data = input as Record<string, unknown>;

    if (typeof data.email !== 'string' || data.email.trim().length === 0) {
        errors.push({ field: 'email', message: 'Email is required.' });
    }

    if (typeof data.password !== 'string' || data.password.length === 0) {
        errors.push({ field: 'password', message: 'Password is required.' });
    }

    if (data.rememberMe !== undefined && typeof data.rememberMe !== 'boolean') {
        errors.push({ field: 'rememberMe', message: 'Remember me must be a boolean.' });
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}