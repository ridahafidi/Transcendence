import { SignJWT, jwtVerify } from 'jose';
import { jwtConfig } from '@/config/jwt';

export async function signAccessToken(userId: string): Promise<string> {
    return new SignJWT({})
        .setProtectedHeader({ alg: 'RS256' })
        .setSubject(userId)
        .setIssuer(jwtConfig.issuer)
        .setAudience(jwtConfig.audience)
        .setIssuedAt()
        .setExpirationTime(jwtConfig.expiresIn)
        .sign(jwtConfig.privateKey);
}

export async function verifyAccessToken(token: string) {
    const { payload } = await jwtVerify(token, jwtConfig.publicKey, {
        algorithms: ['RS256'],
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
    });

    if (!payload.sub) {
        throw new Error('Invalid token: subject (sub) claim is missing.');
    }

    return payload;
}