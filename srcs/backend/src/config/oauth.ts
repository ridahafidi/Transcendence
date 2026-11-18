const clientId = process.env.FORTYTWO_CLIENT_ID;
const clientSecret = process.env.FORTYTWO_CLIENT_SECRET;
const redirectUri = process.env.FORTYTWO_REDIRECT_URI;
const tokenUrl = 'https://api.intra.42.fr/oauth/token';
const authUrl = 'https://api.intra.42.fr/oauth/authorize';


if (!clientId) {
    throw new Error('FORTYTWO_CLIENT_ID is not defined in the environment variables.');
}

if (!clientSecret) {
    throw new Error('FORTYTWO_CLIENT_SECRET is not defined in the environment variables.');
}

if (!redirectUri) {
    throw new Error('FORTYTWO_REDIRECT_URI is not defined in the environment variables.');
}

export const oauthConfig = {
    clientId,
    clientSecret,
    redirectUri,
    tokenUrl,
    authUrl
}


