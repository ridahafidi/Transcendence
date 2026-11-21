import { findUserByLogin } from '../repositories/user.repository.ts';
import { verifyPassword } from './password.service.ts';

export interface LoginInput {
    login: string;
    password: string;
}

export async function loginUser(input: LoginInput) {
    const identifier = input.login.trim();

    const user = await findUserByLogin(identifier);

    if (!user || !user.password_hash || !user.is_active) {
        return null;
    }

    const passwordValid = await verifyPassword(input.password, user.password_hash);

    if (!passwordValid) {
        return null;
    }

    return user;
}
