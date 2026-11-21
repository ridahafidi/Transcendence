import 'dotenv/config';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

export const jwtConfig = {
    secret: new TextEncoder().encode(jwtSecret),
    issuer: 'Nexa',
    audience: 'Nexa-api',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
}