import {createUser, findUserByUsernameOrEmail} from '@/modules/auth/repositories/user.repository';
import {hashPassword} from '@/modules/auth/services/password.service';
import {isPasswordCompromised} from '@/modules/auth/services/password-policy.service';

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
    const badgeColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    const existingUser = await findUserByUsernameOrEmail(username, email);

    if (existingUser) {
        throw new Error('USERNAME_OR_EMAIL_ALREADY_EXISTS');
    }

    const passwordCompromised = await isPasswordCompromised(input.password);
    if (passwordCompromised) {
        throw new Error('PASSWORD_COMPROMISED');
    }

    const passwordHash = await hashPassword(input.password);

    try{
        return await createUser({
            username,
            email,
            passwordHash,
            badgeColor
        });
    }
    catch (error) {
        if (isUniqueViolation(error)) {
            throw new Error('USERNAME_OR_EMAIL_ALREADY_EXISTS');
        }
        throw error;
    }
}