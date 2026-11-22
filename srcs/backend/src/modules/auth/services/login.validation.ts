export interface LoginValidationError {
    field: 'login' | 'password' | 'rememberMe' | 'body';
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

    if (typeof data.login !== 'string' || data.login.trim().length === 0) {
        errors.push({ field: 'login', message: 'Username or email is required.' });
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