# Transcendence Backend — BE-02
# 42 OAuth 2.0 Authentication Integration

**Project:** Transcendence  
**Backend stack:** Node.js 26, TypeScript, Express 5, PostgreSQL  
**Authentication provider:** 42 Intra API  
**Architecture:** Router → Controller → Service → Repository  
**Status:** 42 OAuth authorization, token exchange, and user profile retrieval implemented and tested.

---

## 1. Overview

The purpose of this implementation is to integrate 42 OAuth 2.0 authentication into the Transcendence backend.

Instead of asking users to create a separate password for Transcendence, users authenticate through their existing 42 account.

Our backend communicates with the 42 OAuth authorization server to obtain permission to access the user's public profile.

Once the profile is retrieved, the backend will use the external identity to find or create an internal Transcendence user.

### Current implementation scope

Implemented:

- OAuth 2.0 Authorization Code Flow.
- 42 authorization URL generation.
- CSRF protection using the OAuth `state` parameter.
- Server-side session management using `express-session`.
- Authorization code exchange.
- Access token handling.
- 42 user profile retrieval.
- Runtime validation of external API responses.
- Express authentication routes and controllers.

Not yet implemented:

- Internal user lookup and creation.
- OAuth account persistence.
- JWT generation.
- JWT authentication middleware.
- Refresh token persistence and rotation.
- Production session storage.

---

# 2. OAuth 2.0 Fundamentals

OAuth 2.0 is an authorization framework that allows an application to access resources on behalf of a user without directly handling their provider credentials.

In our implementation, there are three main participants:

| Participant | Responsibility |
|---|---|
| Resource Owner | The user authenticating through 42 |
| Client | Our Transcendence backend |
| Authorization Server | 42 OAuth server |
| Resource Server | 42 API providing user information |

The authorization server and resource server are both operated by 42, but they have different responsibilities.

### Important distinction: Authentication vs Authorization

Authentication answers:

"Who is this user?"

Authorization answers:

"What is this application allowed to access?"

OAuth 2.0 primarily handles delegated authorization. In our implementation, we use the identity information returned by 42 to establish the user's identity in Transcendence.

### Authorization Code vs Access Token

These are two different credentials.

**Authorization Code**

- Returned by 42 after the user authorizes our application.
- Temporary.
- Intended to be exchanged for an access token.
- Cannot directly authenticate requests to `/v2/me`.

**Access Token**

- Returned by the token endpoint.
- Used to access authorized resources.
- Sent using the HTTP `Authorization` header.
- Must remain on the backend in our architecture.

Example:

```http
GET /v2/me HTTP/1.1
Host: api.intra.42.fr
Authorization: Bearer ACCESS_TOKEN
```

The access token belongs to 42's authorization system. It is not our application's authentication token.

Later, Transcendence will issue its own JWT.

---

# 3. Authorization Code Flow

Our implementation uses the OAuth 2.0 Authorization Code Flow.

The complete process:

```text
                 USER
                  |
                  |
                  v
       GET /api/auth/42
                  |
                  v
          EXPRESS BACKEND
                  |
          Generate random state
          Store state in session
                  |
                  v
       Redirect to 42 OAuth
                  |
                  v
        42 AUTHORIZATION SERVER
                  |
          User authenticates
          User authorizes app
                  |
                  v
       Redirect to callback URL
       ?code=...&state=...
                  |
                  v
          EXPRESS BACKEND
                  |
          Validate OAuth state
          Consume stored state
                  |
                  v
       POST /oauth/token
                  |
                  v
          42 TOKEN ENDPOINT
                  |
          Return access token
                  |
                  v
       GET /v2/me
       Authorization: Bearer ...
                  |
                  v
           42 RESOURCE API
                  |
          Return user profile
                  |
                  v
          EXPRESS BACKEND
                  |
          Return profile JSON
```

## Step 1: Initiate OAuth

The frontend redirects the browser to:

```http
GET /api/auth/42
```

Our backend generates a cryptographically secure random state:

```ts
const state = randomBytes(32).toString('hex');
```

This produces 32 random bytes represented as a hexadecimal string.

The state is stored in the user's server-side session:

```ts
req.session.oauthState = state;
```

The same state is included in the authorization URL.

This allows the backend to verify that the callback belongs to the browser session that initiated the OAuth flow.

## Step 2: Redirect to 42

The authorization endpoint is:

```text
https://api.intra.42.fr/oauth/authorize
```

Our backend constructs the authorization URL using the `URL` API:

```ts
const authUrl = new URL(oauthConfig.authUrl);
```

The following query parameters are added:

| Parameter | Purpose |
|---|---|
| `client_id` | Identifies our registered application |
| `redirect_uri` | Callback URL registered with 42 |
| `response_type` | Specifies `code` |
| `scope` | Requests the `public` scope |
| `state` | CSRF protection |

We use:

```ts
authUrl.searchParams.set('client_id', oauthConfig.clientId);
authUrl.searchParams.set('redirect_uri', oauthConfig.redirectUri);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', 'public');
authUrl.searchParams.set('state', state);
```

`URLSearchParams` handles query parameter encoding.

The browser is redirected using:

```ts
res.redirect(authUrl.toString());
```

## Step 3: 42 redirects to our callback

After authorization, 42 redirects the browser to our registered callback URL.

Current callback:

```text
http://localhost:3000/api/auth/42/callback
```

The callback contains:

```text
?code=AUTHORIZATION_CODE&state=RANDOM_STATE
```

The backend receives these parameters through Express:

```ts
const { code, state } = req.query;
```

## Step 4: Validate OAuth state

This is an important security step.

OAuth state protects against Cross-Site Request Forgery, particularly login CSRF.

An attacker could otherwise initiate an OAuth flow with their own account and trick another user into completing the callback using the attacker's authorization code.

Our backend verifies that the state returned by 42 matches the state stored in the initiating browser's session.

First, we validate the query parameter types:

```ts
if (
    typeof code !== 'string' ||
    typeof state !== 'string' ||
    !code ||
    !state
) {
    res.status(400).send('Invalid code or state parameter.');
    return;
}
```

This is necessary because Express query parameters aren't guaranteed to be strings. They can also be arrays or other parsed values.

Then we check the stored state:

```ts
if (!req.session.oauthState || req.session.oauthState !== state) {
    res.status(400).send('Invalid state parameter.');
    return;
}
```

If the values don't match, the request is rejected.

After successful validation, we consume the state:

```ts
req.session.oauthState = undefined;
```

We explicitly save the session before proceeding:

```ts
req.session.save((error) => {
    if (error) {
        res.status(500).send('Failed to save session.');
        return;
    }

    // Continue with token exchange.
});
```

This ensures the state removal is persisted before we continue.

---

# 4. Session Management

We use `express-session` to maintain server-side sessions.

A session allows the backend to associate multiple HTTP requests with the same browser.

This is particularly important during OAuth because the authorization flow involves multiple redirects and HTTP requests.

## Why sessions?

When the user initiates OAuth, we store the random state in their session.

When 42 redirects back, the browser sends its session cookie.

Express uses that cookie to retrieve the corresponding server-side session and its stored OAuth state.

The session cookie does not contain the OAuth state itself.

### Session cookie

The default cookie name is:

```text
connect.sid
```

The cookie contains a signed session identifier.

It is not the session data itself.

The browser automatically sends the cookie with eligible requests.

### Session middleware configuration

Our configuration is located in:

```text
src/config/session.ts
```

Current configuration:

```ts
import session from 'express-session';
import 'dotenv/config';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not defined in the environment variables.');
}

const isProduction = process.env.NODE_ENV === 'production';

export const sessionMiddleware = session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax'
    }
});
```

### Configuration explanation

**secret**

Used to sign the session identifier cookie.

It must be private and sufficiently random.

**resave: false**

Avoids saving sessions that haven't changed.

**saveUninitialized: false**

Prevents untouched new sessions from being saved.

It does not mean sessions cannot be created.

**httpOnly: true**

Prevents JavaScript from reading the cookie through `document.cookie`.

The browser can still send it automatically.

**secure**

When enabled, the browser sends the cookie only over HTTPS.

For local HTTP development, it is disabled.

For production HTTPS, it should be enabled.

**sameSite: 'lax'**

Controls when the browser sends cookies in cross-site requests.

Lax permits cookies on top-level cross-site GET navigations, which is important for our OAuth callback.

It provides additional CSRF protection but does not replace OAuth state validation.

### Session middleware registration

In `app.ts`:

```ts
app.use(sessionMiddleware);
```

It must be registered before the authentication routes.

### Important production limitation

The default `express-session` MemoryStore is suitable for local development and learning only.

It is not appropriate for production because:

- Sessions disappear when the backend restarts.
- Sessions are not shared between multiple backend instances.
- It is not designed for production workloads.

A persistent session store will be needed later.

---

# 5. Environment Configuration

Our OAuth credentials are stored in environment variables.

File:

```text
srcs/backend/.env
```

Configuration:

```env
FORTYTWO_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID
FORTYTWO_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET
FORTYTWO_REDIRECT_URI=http://localhost:3000/api/auth/42/callback

SESSION_SECRET=YOUR_RANDOM_SESSION_SECRET
```

Never commit this file to Git.

The client secret must remain on the backend.

The frontend must never receive it.

### 42 application configuration

The redirect URI registered in the 42 application settings must exactly match:

```text
http://localhost:3000/api/auth/42/callback
```

The following must match:

- Protocol.
- Hostname.
- Port.
- Path.
- Trailing slash, if present.

For example, these are different:

```text
http://localhost:3000/auth/42/callback
http://localhost:3000/api/auth/42/callback
```

Our application uses the second one.

---

# 6. OAuth Configuration Module

File:

```text
src/config/oauth.ts
```

Current implementation:

```ts
import dotenv from 'dotenv';

dotenv.config();

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
};
```

### Why centralize configuration?

Instead of scattering OAuth credentials and URLs throughout the application, we centralize them.

This provides:

- One place to manage OAuth configuration.
- Environment variable validation.
- Easier maintenance.
- Less duplicated configuration.

The client ID and secret are read when the configuration module is initialized.

---

# 7. OAuth Service

File:

```text
src/modules/auth/services/42-oauth.service.ts
```

The service handles communication with the external 42 API.

It is responsible for:

1. Exchanging authorization codes for access tokens.
2. Retrieving the authenticated user's profile.

The controller should not contain the implementation details of HTTP communication with 42.

This separation follows our layered architecture.

## 7.1 Authorization code exchange

The backend sends a POST request to:

```text
https://api.intra.42.fr/oauth/token
```

The request includes:

| Field | Value |
|---|---|
| `grant_type` | `authorization_code` |
| `client_id` | Our 42 application client ID |
| `client_secret` | Our 42 application secret |
| `code` | Authorization code received in callback |
| `redirect_uri` | Registered callback URL |

We use Node.js native `fetch()`.

We use `FormData` to construct the request body.

The service checks `response.ok` before processing the response.

This is important because `fetch()` does not automatically reject its Promise when an HTTP server returns an error such as 400 or 500.

The response is validated at runtime before being treated as a token response.

## 7.2 Token response validation

TypeScript interfaces do not validate data received from external APIs.

An external server can return unexpected JSON, so the backend should validate the response at runtime.

We use `unknown` and type guards to verify the returned data.

The token response interface describes fields such as:

```ts
interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    refresh_token?: string;
}
```

The exact fields returned by the provider should be verified against the actual response.

The `refresh_token` field should not be assumed to exist in every response.

## 7.3 Retrieve the 42 user profile

After obtaining the access token, we call:

```text
GET https://api.intra.42.fr/v2/me
```

The request includes:

```ts
headers: {
    Authorization: `Bearer ${accessToken}`
}
```

The `Bearer` authorization scheme tells the resource server that the request is authenticated using the supplied access token.

The returned profile includes information such as:

```json
{
    "id": 194960,
    "email": "user@example.com",
    "login": "example",
    "first_name": "Example",
    "last_name": "User",
    "usual_full_name": "Example User",
    "url": "https://api.intra.42.fr/v2/users/example",
    "image": {
        "link": "https://cdn.intra.42.fr/users/example.jpg"
    }
}
```

This is an illustrative response structure. Actual profile fields and values depend on the 42 account and API response.

The service validates the external response before returning it to the controller.

---

# 8. Authentication Controller

File:

```text
src/modules/auth/auth.controller.ts
```

The controller handles incoming HTTP requests and coordinates the authentication process.

It currently contains two functions.

## 8.1 start42OAuth()

Responsibilities:

- Generate random OAuth state.
- Store state in the user's session.
- Construct the authorization URL.
- Persist the session.
- Redirect the browser to 42.

Implementation:

```ts
export function start42OAuth(req: Request, res: Response): void {
    const authUrl = new URL(oauthConfig.authUrl);
    const state = randomBytes(32).toString('hex');

    authUrl.searchParams.set('client_id', oauthConfig.clientId);
    authUrl.searchParams.set('redirect_uri', oauthConfig.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'public');
    authUrl.searchParams.set('state', state);

    req.session.oauthState = state;

    req.session.save((error) => {
        if (error) {
            res.status(500).send('Failed to initialize OAuth session.');
            return;
        }

        res.redirect(authUrl.toString());
    });
}
```

We save the session before redirecting because the browser will leave our application and communicate with 42.

We need the session state to be persisted before the callback arrives.

## 8.2 handle42Callback()

Responsibilities:

- Receive the authorization code and state.
- Validate the query parameter types.
- Validate the session state.
- Consume the state.
- Persist the updated session.
- Exchange the authorization code.
- Retrieve the 42 profile.
- Return the profile for testing.

Implementation:

```ts
export function handle42Callback(req: Request, res: Response): void {
    const { code, state } = req.query;

    if (
        typeof code !== 'string' ||
        typeof state !== 'string' ||
        !code ||
        !state
    ) {
        res.status(400).send('Invalid code or state parameter.');
        return;
    }

    if (!req.session.oauthState || req.session.oauthState !== state) {
        res.status(400).send('Invalid state parameter.');
        return;
    }

    req.session.oauthState = undefined;

    req.session.save((error) => {
        if (error) {
            res.status(500).send('Failed to save session.');
            return;
        }

        exchangeAuthorizationCode(code)
            .then((tokenResponse) => {
                return get42UserProfile(tokenResponse.access_token);
            })
            .then((userProfile) => {
                res.json(userProfile);
            })
            .catch((error) => {
                console.error(
                    'Error occurred while fetching 42 user profile:',
                    error
                );

                res.status(500).send(
                    'Error occurred while fetching 42 user profile.'
                );
            });
    });
}
```

### Promise chain explanation

The service calls are asynchronous.

`exchangeAuthorizationCode(code)` returns a Promise containing the token response.

The first `.then()` extracts the access token and passes it to `get42UserProfile()`.

The second `.then()` receives the user profile.

The `.catch()` handles errors from either asynchronous operation.

Conceptually:

```text
Authorization Code
        |
        v
exchangeAuthorizationCode()
        |
        v
Token Response
        |
        v
Extract access_token
        |
        v
get42UserProfile()
        |
        v
User Profile
        |
        v
Return JSON
```

The current `res.json(userProfile)` is for integration testing, not the final authentication response.

---

# 9. Express Routes

File:

```text
src/modules/auth/auth.routes.ts
```

Current implementation:

```ts
import { Router } from 'express';
import {
    handle42Callback,
    start42OAuth
} from './auth.controller.ts';

const router = Router();

router.get('/42', start42OAuth);
router.get('/42/callback', handle42Callback);

export default router;
```

The router defines two routes:

| Method | Route | Controller |
|---|---|---|
| GET | `/42` | `start42OAuth` |
| GET | `/42/callback` | `handle42Callback` |

The router is mounted in `app.ts`:

```ts
app.use('/api/auth', authRoutes);
```

Express combines the mount path and router paths.

Therefore, the actual endpoints are:

```text
GET /api/auth/42
GET /api/auth/42/callback
```

---

# 10. Application Initialization

File:

```text
src/app.ts
```

The application registers middleware before its routes.

Relevant registration:

```ts
app.use(sessionMiddleware);
app.use(express.json());

app.use('/api/auth', authRoutes);
```

Middleware order matters.

The session middleware must execute before the authentication routes because those controllers access:

```ts
req.session
```

The JSON middleware parses incoming JSON request bodies.

The authentication routes are registered after these middleware functions.

The backend runs using:

```bash
npm run dev
```

The project uses Node.js 26 native TypeScript type stripping through:

```json
{
    "dev": "node --watch src/app.ts"
}
```

TypeScript is checked separately using:

```bash
npm run check
```

---

# 11. TypeScript Session Augmentation

Express-session does not know about our custom `oauthState` property by default.

We extended its session type through module augmentation.

File:

```text
src/types/express-session.d.ts
```

Implementation:

```ts
import 'express-session';

declare module 'express-session' {
    interface SessionData {
        oauthState?: string;
    }
}
```

The optional property means the session may or may not contain an OAuth state.

This is appropriate because users can have sessions without initiating OAuth.

The type declaration allows TypeScript to recognize:

```ts
req.session.oauthState
```

without producing a type error.

---

# 12. Security Decisions

Security has been considered throughout the implementation.

## 12.1 Keep the client secret on the backend

The 42 client secret must never be exposed to frontend JavaScript.

It is stored in the backend environment configuration.

## 12.2 Use cryptographically secure random state

We use:

```ts
randomBytes(32).toString('hex');
```

We do not use `Math.random()` for security-sensitive values.

## 12.3 Validate state

The callback state must match the state stored in the initiating browser's session.

A mismatch causes the request to be rejected.

## 12.4 Consume state

After successful validation, we clear the stored state.

This prevents the same state from being reused for another callback.

## 12.5 Use HTTP-only session cookies

The cookie is configured with:

```ts
httpOnly: true
```

This prevents JavaScript from directly reading the cookie.

It does not prevent malicious JavaScript from making authenticated requests through the browser.

## 12.6 Use SameSite cookies

We configured:

```ts
sameSite: 'lax'
```

This helps restrict cross-site cookie sending while permitting the top-level GET navigation used by our OAuth callback.

## 12.7 Keep provider tokens out of the frontend

The 42 access token is used by the backend to communicate with 42.

The frontend should not receive it.

Later, our backend will issue its own authentication credential.

## 12.8 Validate external API responses

We cannot trust the shape of external JSON simply because TypeScript interfaces describe it.

We validate external responses at runtime.

## 12.9 Avoid leaking sensitive information

Never log:

- Client secrets.
- Access tokens.
- Session cookies.
- Authorization codes.
- OAuth state values in production.

Temporary debugging logs should be removed after troubleshooting.

---

# 13. Problems Encountered and Solutions

During implementation, we encountered several integration problems.

### Problem 1: Unknown OAuth client

Error:

```text
Client authentication failed due to unknown client,
no client authentication included, or unsupported authentication method.
```

Cause:

The environment variables still contained placeholder values:

```env
FORTYTWO_CLIENT_ID=your_client_id
FORTYTWO_CLIENT_SECRET=your_client_secret
```

Solution:

Use the actual UID and Secret from the 42 application settings.

### Problem 2: Incorrect redirect URI

The initial redirect URI was:

```text
http://localhost:3000/auth/42/callback
```

However, our router was mounted under `/api/auth`.

The correct URI became:

```text
http://localhost:3000/api/auth/42/callback
```

The URI in `.env` and the URI registered with 42 must match exactly.

### Problem 3: Cannot GET /auth/42/callback

Cause:

The browser was redirected to the old callback path.

Solution:

Update the redirect URI in both the environment configuration and 42 application settings.

### Problem 4: Invalid redirect URI

Cause:

The redirect URI sent to 42 did not match the registered callback URL.

Solution:

Make both values character-for-character identical.

### Problem 5: Invalid state parameter

Cause:

The session state was missing or did not match the state returned by 42.

Potential causes include:

- Session cookie not sent.
- Different hostnames used (`localhost` vs `127.0.0.1`).
- Session not persisted.
- State overwritten by another OAuth initiation.

Solution:

We inspected the session cookie and added temporary diagnostic logging.

The session cookie is named:

```text
connect.sid
```

After resolving the session issue, the state validation succeeded and the complete profile retrieval flow worked.

---

# 14. Current Project Structure

Relevant authentication files:

```text
srcs/
└── backend/
    ├── src/
    │   ├── app.ts
    │   │
    │   ├── config/
    │   │   ├── database.ts
    │   │   ├── oauth.ts
    │   │   └── session.ts
    │   │
    │   ├── types/
    │   │   └── express-session.d.ts
    │   │
    │   └── modules/
    │       └── auth/
    │           ├── auth.routes.ts
    │           ├── auth.controller.ts
    │           │
    │           └── services/
    │               └── 42-oauth.service.ts
    │
    ├── .env
    ├── package.json
    └── tsconfig.json
```

---

# 15. Testing the OAuth Integration

The current implementation can be tested manually.

### Test 1: Start OAuth

Open:

```text
http://localhost:3000/api/auth/42
```

Expected:

- Backend generates state.
- Session is created or updated.
- Browser receives a session cookie.
- Browser redirects to 42.

### Test 2: Authorize through 42

Authenticate using your 42 account and authorize the application.

Expected:

42 redirects to:

```text
http://localhost:3000/api/auth/42/callback
```

with `code` and `state` parameters.

### Test 3: Validate callback

Expected:

- Code and state are strings.
- Session state exists.
- Both states match.
- Stored state is consumed.
- Session update is saved.

### Test 4: Exchange authorization code

Expected:

Backend sends a POST request to the 42 token endpoint and receives an access token.

### Test 5: Retrieve profile

Expected:

Backend calls `/v2/me` and receives the authenticated user's profile.

The integration was successfully tested, returning a profile containing fields such as:

- 42 user ID.
- Login.
- Email.
- First and last name.
- Display name.
- Profile URL.
- Profile image.

---

# 16. Current Architecture vs Target Architecture

The current implementation ends after retrieving the external profile.

The next stage is to integrate that identity into our own database and authentication system.

Target architecture:

```text
             42 OAUTH
                 |
                 v
         Retrieve 42 Profile
                 |
                 v
          AUTH CONTROLLER
                 |
                 v
           AUTH SERVICE
                 |
                 v
       OAUTH ACCOUNT REPOSITORY
                 |
          Find provider account
                 |
          +------+------+
          |             |
        Found         Not Found
          |             |
          v             v
      Get User      Create User
          |             |
          |       Create OAuth Account
          |             |
          +------+------+
                 |
                 v
           Internal User
                 |
                 v
            JWT SERVICE
                 |
                 v
            Generate JWT
                 |
                 v
        Authentication Middleware
                 |
                 v
       Protected Transcendence API
```

### Why have a separate oauth_accounts table?

Our database separates internal users from external authentication identities.

For example:

```text
users
-----
id
username
email
created_at
```

```text
oauth_accounts
--------------
id
user_id
provider
provider_user_id
created_at
```

This makes it possible for one internal user to have multiple external authentication providers.

For example:

```text
Internal User #15
       |
       +---- 42 account: 194960
       |
       +---- Google account: google-subject-id
```

The stable provider identity is used to identify the external account.

We should not rely exclusively on email addresses for account matching because email addresses can change or have different verification guarantees.

---

# 17. Next Development Tasks

The remaining BE-02 work is:

### BE-02.1 — Authentication foundation

- [x] Configure 42 OAuth credentials.
- [x] Configure session middleware.
- [x] Create authentication routes.
- [x] Implement OAuth state generation and validation.
- [x] Implement callback handler.

### BE-02.2 — OAuth token exchange

- [x] Exchange authorization code.
- [x] Validate token response.
- [x] Retrieve 42 profile.
- [x] Validate profile response.

### BE-02.3 — Internal user integration

- [ ] Create user repository.
- [ ] Create OAuth account repository.
- [ ] Find an existing OAuth account.
- [ ] Create an internal user when needed.
- [ ] Associate the external identity with the internal user.
- [ ] Handle database transactions and uniqueness conflicts.

### BE-02.4 — JWT authentication

- [ ] Implement JWT generation.
- [ ] Define JWT payload.
- [ ] Configure signing secret.
- [ ] Define expiration.
- [ ] Implement authentication middleware.
- [ ] Protect authenticated endpoints.

### BE-02.5 — Refresh token management

- [ ] Design refresh token persistence.
- [ ] Store refresh tokens securely.
- [ ] Implement refresh token rotation.
- [ ] Detect refresh token reuse.
- [ ] Implement logout and revocation.

### Additional improvements

- [ ] Handle OAuth authorization denial (`error` callback parameter).
- [ ] Handle expired and invalid authorization codes.
- [ ] Consider PKCE if supported by the provider.
- [ ] Replace MemoryStore with persistent session storage if sessions remain part of the production design.
- [ ] Remove temporary debugging logs.
- [ ] Add automated OAuth controller and service tests.
- [ ] Review cookie settings and deployment configuration.

---

# 18. Important Concepts Learned

| Concept | What it does |
|---|---|
| OAuth 2.0 | Delegated authorization framework |
| Authorization Code | Temporary credential exchanged for a token |
| Access Token | Credential used to access protected resources |
| Bearer Authentication | Sends access token in HTTP Authorization header |
| OAuth State | Protects the OAuth flow against CSRF |
| Express Router | Maps HTTP methods and paths to handlers |
| Controller | Handles incoming HTTP requests and responses |
| Service | Contains business logic and external API communication |
| Middleware | Executes during the Express request lifecycle |
| Session | Maintains server-side state across requests |
| Cookie | Allows the browser to identify its session |
| HTTP-only | Prevents direct JavaScript access to a cookie |
| SameSite | Restricts cross-site cookie sending |
| Type Guard | Validates values at runtime |
| Promise | Represents an asynchronous operation |
| Fetch | Performs HTTP requests from Node.js |

---

# Conclusion

The first major milestone of BE-02 is complete.

The backend can now:

1. Initiate authentication through 42.
2. Maintain OAuth state in a server-side session.
3. Validate the callback and protect against login CSRF.
4. Exchange the authorization code for an access token.
5. Use the access token to retrieve the authenticated user's 42 profile.

The most important architectural distinction going forward is that **42 establishes the external identity, while Transcendence must establish and manage its own internal authenticated user**.

The next milestone is connecting the retrieved profile to PostgreSQL through the `users` and `oauth_accounts` tables, before implementing JWT authentication.
