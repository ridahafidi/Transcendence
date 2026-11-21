import {createUser, findUserByUsernameOrEmail} from '../repositories/user.repository.ts';
import {hashPassword} from './password.service.ts';

export interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

function isUniqueViolation(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
    );
}

export async function registerUser(input: RegisterInput) {
    const username = input.username.trim();
    const email = input.email.trim().toLowerCase();

    const existingUser = await findUserByUsernameOrEmail(username, email);

    if (existingUser) {
        throw new Error('USERNAME_OR_EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await hashPassword(input.password);

    try{
        return await createUser({
            username,
            email,
            passwordHash
        });
    }
    catch (error) {
        if (isUniqueViolation(error)) {
            throw new Error('USERNAME_OR_EMAIL_ALREADY_EXISTS');
        }
        throw error;
    }
}