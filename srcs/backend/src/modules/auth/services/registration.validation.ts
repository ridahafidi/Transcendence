import type {RegisterInput} from './registration.service.ts';

export interface ValidationError {
    field: 'username' | 'email' | 'password' | 'body';
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

const USERNAME_REGEX = /^[a-zA-Z0-9\_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export function validateRegistrationInput(input: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (typeof input !== 'object' || input === null || Array.isArray(input))
    {
        return {
            valid: false,
            errors: [{ field: 'body', message: 'Request body must be an object.' }],
        };
    }

    const data = input as Record<string, unknown>;

    if (typeof data.username !== 'string')
    {
        errors.push({ field: 'username', message: 'Username is required.' });
    }
    else
    {
        const username = data.username.trim();

        if (!USERNAME_REGEX.test(username)) 
        {
            errors.push({
                field: 'username',
                message: 'Username must contain 3-20 characters and only letters, numbers, or underscores.'
            });
        }
    }

    if (typeof data.email !== 'string')
    {
        errors.push({ field: 'email', message: 'Email is required.' });
    }
    else
    {
        const email = data.email.trim();

        if (email.length > 255 || !EMAIL_REGEX.test(email)) {
            errors.push({ field: 'email', message: 'Please provide a valid email address.' });
        }
    }
    // no password regex for now, just length check , will add HIBP later instead of regex
    if (typeof data.password !== 'string')
    {
        errors.push({ field: 'password', message: 'Password is required.' });
    } 
    else
    {
        if (data.password.length < 12)
        {
            errors.push({ field: 'password', message: 'Password must be at least 12 characters long.' });
        }
        if (data.password.length > 128)
        {
            errors.push({ field: 'password', message: 'Password must not exceed 128 characters.' });
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}