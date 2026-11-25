import { findUserByLogin } from '@/modules/auth/repositories/user.repository';
import { verifyPassword } from '@/modules/auth/services/password.service';

export interface LoginInput {
    email: string;
    password: string;
}

export async function loginUser(input: LoginInput) {
    const email = input.email.trim().toLowerCase();

    const user = await findUserByLogin(email);

    if (!user || !user.password_hash || !user.is_active) {
        return null;
    }

    const passwordValid = await verifyPassword(input.password, user.password_hash);

    if (!passwordValid) {
        return null;
    }

    return user;
}