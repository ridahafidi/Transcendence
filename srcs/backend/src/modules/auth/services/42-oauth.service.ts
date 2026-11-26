import { oauthConfig } from '@/config/oauth';
import { find42Account, create42Account } from '@/modules/auth/repositories/oauth.repository';
import { oauthProfileSchema, oauthTokenSchema, type OAuthToken, type OAuthProfile } from '@repo/shared';

export async function resolve42User(profile: OAuthProfile) {
    const existingUser = await find42Account(String(profile.id));

    if (existingUser) {
        return existingUser;
    }

    return await create42Account(profile);
}


export async function exchangeAuthorizationCode(code: string): Promise<OAuthToken> {
    const form = new FormData();
    form.append('grant_type', 'authorization_code');
    form.append('client_id', oauthConfig.clientId);
    form.append('client_secret', oauthConfig.clientSecret);
    form.append('code', code);
    form.append('redirect_uri', oauthConfig.redirectUri);


    const response = await fetch(oauthConfig.tokenUrl, {
        method: 'POST',
        body: form
    })

    let data: unknown;

    try {
        data = await response.json();
    }
    catch (error) {
        throw new Error(`42 returned invalid JSON (HTTP ${response.status})`);
    }
    if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.statusText}`);
    }
    let result = oauthTokenSchema.safeParse(data);
    if (!result.success) {
        throw new Error("42 returned an unexpected token response");
    }
    return result.data;
}



export async function get42UserProfile(accessToken: string): Promise<OAuthProfile> {
    const response = await fetch("https://api.intra.42.fr/v2/me", {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    let data: unknown;
    try {
        data = await response.json();
    }
    catch (error) {
        throw new Error(`42 returned invalid JSON (HTTP ${response.status})`);
    }
    if (!response.ok) {
        throw new Error("Failed to fetch user profile from 42 API");
    }
    let result = oauthProfileSchema.safeParse(data);
    if (!result.success) {
        throw new Error("42 returned an unexpected user profile response");
    }
    return result.data;
}