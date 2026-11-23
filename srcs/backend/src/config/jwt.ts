import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { importPKCS8, importSPKI } from 'jose';

const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH;
const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;

if (!privateKeyPath || !publicKeyPath) {
    throw new Error('JWT_PRIVATE_KEY_PATH and JWT_PUBLIC_KEY_PATH must be defined.');
}

const [privateKeyPem, publicKeyPem] = await Promise.all([
    readFile(privateKeyPath, 'utf8'),
    readFile(publicKeyPath, 'utf8'),
]);

export const jwtConfig = {
    privateKey: await importPKCS8(privateKeyPem, 'RS256'),
    publicKey: await importSPKI(publicKeyPem, 'RS256'),
    issuer: 'Nexa',
    audience: 'Nexa-api',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
};
