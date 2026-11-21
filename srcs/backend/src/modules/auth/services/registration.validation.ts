import type {RegisterInput} from './registration.service.ts';

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export function validateRegistrationInput(input: unknown): ValidationResult {
    const errors: string[] = [];

    if (typeof input !== 'object' || input === null || Array.isArray(input))
    {
        return {
            valid: false,
            errors: ['Request body must be an object.'],
        };
    }

    const data = input as Record<string, unknown>;

    if (typeof data.username !== 'string')
    {
        errors.push('Username is required.');
    }
    else
    {
        const username = data.username.trim();

        if (!USERNAME_REGEX.test(username)) 
        {
            errors.push(
                'Username must contain 3–30 characters and only letters, numbers, or underscores.'
            );
        }
    }

    if (typeof data.email !== 'string')
    {
        errors.push('Email is required.');
    }
    else
    {
        const email = data.email.trim();

        if (email.length > 255 || !EMAIL_REGEX.test(email)) {
            errors.push('Please provide a valid email address.');
        }
    }
    // no password regex for now, just length check , will add HIBP later instead of regex
    if (typeof data.password !== 'string')
    {
        errors.push('Password is required.');
    } 
    else
    {
        if (data.password.length < 12)
        {
            errors.push('Password must be at least 12 characters long.');
        }
        if (data.password.length > 128)
        {
            errors.push('Password must not exceed 128 characters.');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}