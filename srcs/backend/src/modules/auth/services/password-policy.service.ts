import { createHash } from 'node:crypto';

const HIBP_RANGE_URL = 'https://api.pwnedpasswords.com/range/';
const HIBP_TIMEOUT_MS = 5000;


export async function isPasswordCompromised(password: string): Promise<boolean> {
    const hash = createHash('sha1')
        .update(password, 'utf8')
        .digest('hex')
        .toUpperCase();

    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const response = await fetch(`${HIBP_RANGE_URL}${prefix}`, {
        method: 'GET',
        headers: {
            'User-Agent': 'Transcendence-Password-Checker',
            'Add-Padding': 'true'
        },
        signal: AbortSignal.timeout(HIBP_TIMEOUT_MS)
    });

    if (!response.ok) {
        throw new Error('PASSWORD_BREACH_CHECK_UNAVAILABLE');
    }

    const results = await response.text();

    return results.split(/\r?\n/).some((line) => {
        const [returnedSuffix, count] = line.split(':');

        return (
            returnedSuffix?.toUpperCase() === suffix &&
            Number(count) > 0
        );
    });
}
