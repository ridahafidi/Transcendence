import { oauthConfig }  from '../../../config/oauth.ts';

interface TokenResponse {
    access_token : string;
    token_type : string;
    expires_in : number;
    scope : string;
    refresh_token : string;
    created_at : number;
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