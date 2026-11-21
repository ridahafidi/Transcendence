export interface LoginValidationResult {
    valid: boolean;
    errors: string[];
}

export function validateLoginInput(input: unknown): LoginValidationResult {
    const errors: string[] = [];

    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        return {
            valid: false,
            errors: ['Request body must be an object.'],
        };
    }

    const data = input as Record<string, unknown>;

    if (typeof data.login !== 'string' || data.login.trim().length === 0) {
        errors.push('Username or email is required.');
    }

    if (typeof data.password !== 'string' || data.password.length === 0) {
        errors.push('Password is required.');
    }

    if (data.rememberMe !== undefined && typeof data.rememberMe !== 'boolean') {
        errors.push('Remember me must be a boolean.');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}