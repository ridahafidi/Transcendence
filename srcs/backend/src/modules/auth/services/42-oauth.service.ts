import { oauthConfig }  from '../../../config/oauth.ts';
import { randomBytes } from 'node:crypto';
import {find42Account, create42Account} from '../repositories/oauth.repository.ts';

interface TokenResponse {
    access_token : string;
    token_type : string;
    expires_in : number;
    scope : string;
    refresh_token : string;
    created_at : number;
}

interface UserProfile{
    id: number;
    login: string;
    email: string;
    first_name: string;
    last_name: string;
    url: string;
    image: {
        link: string;
    };
}

export async function resolve42User(profile: UserProfile){
    const existingUser = await find42Account(String(profile.id));

    if (existingUser) {
        return existingUser;
    }

    return await create42Account(profile);
}

function isTokenResponse(data: unknown): data is TokenResponse 
{    
    if (typeof data === 'object' && data !== null && !Array.isArray(data))
    {
        const tokenResponse = data as Record<string, unknown>;
        return (
            typeof tokenResponse.access_token === 'string' &&
            typeof tokenResponse.token_type === 'string' &&
            typeof tokenResponse.expires_in === 'number' &&
            typeof tokenResponse.scope === 'string' &&
            typeof tokenResponse.refresh_token === 'string' &&
            typeof tokenResponse.created_at === 'number'
        );
    }
    return false;
}


export async function exchangeAuthorizationCode(code: string): Promise<TokenResponse> {
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

    let data : unknown;

    try 
    {
        data  = await response.json();
    }
    catch (error)
    {
        throw new Error(`42 returned invalid JSON (HTTP ${response.status})`);
    }
    if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.statusText}`);
    }

    if (!isTokenResponse(data)) {
        throw new Error('42 returned an unexpected token response');
    }

    return data;
}

function isUserProfile(data: unknown): data is UserProfile {
    
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return false;
    }
    const userProfile = data as Record<string, unknown>;
    const image = userProfile.image;
    if(!image || typeof image !== 'object' || image === null || Array.isArray(image)) {
        return false;
    }
    const imageData = image as Record<string, unknown>;

    if (typeof data === 'object' && data != null && !Array.isArray(data))
    {
        const userProfile = data as Record<string, unknown>;
        return (
            typeof userProfile.id === 'number' &&
            typeof userProfile.login === 'string' &&
            typeof userProfile.email === 'string' &&
            typeof userProfile.first_name === 'string' &&
            typeof userProfile.last_name === 'string' &&
            typeof userProfile.url === 'string' &&
            typeof imageData.link === 'string'
        )
    }
    return false;
}

export async function get42UserProfile(accessToken: string): Promise<UserProfile>{
    const response = await fetch("https://api.intra.42.fr/v2/me",{
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    let data: unknown;
    try
    {
        data = await response.json();
    }
    catch(error)
    {
        throw new Error(`42 returned invalid JSON (HTTP ${response.status})`);
    }
    if (!response.ok){
        throw new Error("Failed to fetch user profile from 42 API");
    }
    if (!isUserProfile(data)){
        throw new Error("42 returned an unexpected user profile response");
    }

    return data;
}