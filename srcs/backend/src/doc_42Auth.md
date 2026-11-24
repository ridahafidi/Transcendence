# Transcendence — Backend Authentication V1

## 1. Overview

The authentication module provides account registration, credential-based login, 42 OAuth authentication, JWT-based access control, refresh-token rotation, logout, and retrieval of the currently authenticated user.

### Technology stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- `pg` for database access
- Argon2id for password hashing
- `jose` for JWT signing and verification
- `express-session` for OAuth state management
- `cookie-parser` for reading authentication cookies

The backend follows a layered architecture:

```text
Router → Controller → Service → Repository → PostgreSQL
```

Each layer has a specific responsibility:

- **Router:** Defines HTTP endpoints and middleware.
- **Controller:** Handles HTTP requests, responses, and status codes.
- **Service:** Implements authentication and business logic.
- **Repository:** Executes SQL queries and interacts with PostgreSQL.

---

## 2. API versioning

Authentication endpoints are grouped under:

`/api/v1/auth`

The protected test endpoint is:

`/api/v1/test/protected`

The 42 OAuth callback URI was updated to:

`http://localhost:3000/api/v1/auth/42/callback`

The configured redirect URI must match the URI registered in the 42 application.

Operational health endpoints remain outside API versioning:

- `GET /health`
- `GET /health/db`

---

## 3. Implemented authentication endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new account |
| POST | `/api/v1/auth/login` | Authenticate using username/email and password |
| POST | `/api/v1/auth/logout` | Revoke the current refresh-token session |
| POST | `/api/v1/auth/refresh` | Rotate refresh token and issue a new access JWT |
| GET | `/api/v1/auth/42` | Start 42 OAuth authentication |
| GET | `/api/v1/auth/42/callback` | Handle the OAuth callback |
| GET | `/api/v1/auth/me` | Retrieve the authenticated user's profile |
| GET | `/api/v1/test/protected` | Protected authentication test endpoint |

---

## 4. Registration

**Endpoint:** `POST /api/v1/auth/register`

Registration creates a local user account and automatically authenticates the newly registered user.

### Request

```json
{
  "username": "test_user_02",
  "email": "test_user_02@example.com",
  "password": "YourStrongPassword123!"
}
```

### Validation

- Username must satisfy the configured length and character restrictions.
- Email must have a valid format.
- Password must contain between 12 and 128 characters.
- Passwords are not trimmed.
- Email addresses are normalized to lowercase.
- Username and email are checked for existing accounts.

### Password security

Passwords are hashed using Argon2id before being stored.

Configuration:

```ts
{
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1
}
```

Plaintext passwords are never stored in PostgreSQL.

### Account creation

The repository inserts the user with the `USER` global role explicitly.

```sql
INSERT INTO users (
    username,
    email,
    password_hash,
    global_role
)
VALUES ($1, $2, $3, 'USER')
RETURNING
    id,
    username,
    email,
    display_name,
    global_role,
    created_at;
```

Newly registered users cannot assign themselves administrative privileges.

### Successful response

HTTP `201 Created`.

The controller creates a refresh-token session, signs an access JWT, and sets the authentication cookies.

The response contains the public user profile, not the password hash.

### Error handling

- `400 Bad Request`: Invalid registration data.
- `409 Conflict`: Username or email already exists.
- `500 Internal Server Error`: Unexpected infrastructure or server error.

PostgreSQL unique-constraint violations (`23505`) are also handled to protect against concurrent duplicate registrations.

---

## 5. Login

**Endpoint:** `POST /api/v1/auth/login`

Users can authenticate using either their username or email address.

### Request

```json
{
  "login": "test_user_02",
  "password": "YourStrongPassword123!",
  "rememberMe": false
}
```

`rememberMe` is optional and defaults to `false`.

### Authentication process

1. Validate the request body.
2. Find the account using the supplied username or email.
3. Reject nonexistent, inactive, or passwordless accounts.
4. Verify the submitted password against the stored Argon2id hash.
5. Create a refresh-token session.
6. Sign a JWT access token.
7. Set the authentication cookies.
8. Return the public user profile.

### Credential error handling

Invalid credentials return the same generic response:

```json
{
  "message": "Invalid username/email or password."
}
```

HTTP `401 Unauthorized`.

This avoids revealing whether a particular username or email exists.

OAuth-only accounts without a password hash cannot authenticate through the password-login endpoint.

### Remember Me

| Setting | Refresh-token lifetime |
|---|---:|
| `false` | 7 days |
| `true` | 30 days |

The access JWT remains short-lived regardless of this setting.

---

## 6. Current authenticated user

**Endpoint:** `GET /api/v1/auth/me`

This endpoint returns the profile of the currently authenticated user.

It requires the `authenticate` middleware.

### Authentication flow

```text
HTTP Request
    |
    v
Read access_token cookie
    |
    v
Verify JWT signature and claims
    |
    v
Extract user ID from JWT subject
    |
    v
Attach user ID to req.user
    |
    v
Query PostgreSQL using user ID
    |
    v
Check user exists and is active
    |
    v
Return public user profile
```

### Middleware

The `authenticate` middleware:

- Reads `access_token` from the parsed cookies.
- Rejects missing or malformed tokens.
- Verifies the JWT using `verifyAccessToken`.
- Checks that the token contains a subject.
- Attaches the authenticated user's ID to `req.user`.
- Returns `401 Unauthorized` when authentication fails.

The middleware does not trust a user ID supplied by the client.

### Database lookup

The repository retrieves the user using the authenticated ID:

```sql
SELECT
    id,
    username,
    email,
    display_name,
    global_role,
    created_at,
    is_active
FROM users
WHERE id = $1
LIMIT 1;
```

The service rejects missing or inactive accounts.

### Successful response

HTTP `200 OK`.

Example:

```json
{
  "id": "4",
  "username": "test_user_02",
  "email": "test_user_02@example.com",
  "displayName": null,
  "globalRole": "USER",
  "createdAt": "2026-11-21T18:49:27.053Z"
}
```

Sensitive database fields such as `password_hash` are not returned.

### Error responses

- `401 Unauthorized`: Missing or invalid access token.
- `401 Unauthorized`: User no longer exists or is inactive.
- `500 Internal Server Error`: Unexpected database or server error.

---

## 7. JWT access-token architecture

Access tokens are signed using `jose` with the HS256 algorithm.

The signing secret is provided through `JWT_SECRET`.

Configuration includes:

- Expiration: `15m`
- Issuer: `Nexa`
- Audience: `Nexa-api`
- Subject: Internal Nexa user ID

The JWT is stored in an HttpOnly cookie.

Cookie properties:

- `HttpOnly`
- `Secure` in production
- `SameSite=Lax`
- Path `/`
- Maximum age: 15 minutes

The access token is not stored in the database. Its signature and claims are verified by the backend.

---

## 8. Refresh-token architecture

Refresh tokens are opaque cryptographically random tokens generated using:

```ts
randomBytes(32).toString('hex');
```

Only their SHA-256 hashes are stored in PostgreSQL.

### Rotation

Every successful refresh:

1. Hashes the presented refresh token.
2. Finds the corresponding database record.
3. Validates its expiration and revocation status.
4. Revokes the old token.
5. Creates a replacement token.
6. Links the old token to its replacement through `replaced_by_id`.
7. Returns a new access JWT and refresh cookie.

### Token families

Each login session has its own `family_id`.

This allows independent sessions across different devices.

If an already-rotated refresh token is reused, the backend detects replay and revokes the active tokens belonging to that family.

Other device sessions are not affected.

### Expiration policy

The refresh-token lifetime is absolute, not sliding.

A replacement token inherits the original session's expiration date. Refreshing a session does not extend its lifetime indefinitely.

---

## 9. 42 OAuth

The OAuth flow uses the 42 API to authenticate users.

The flow:

1. Generate a random OAuth state.
2. Store the state in the Express session.
3. Redirect the user to 42.
4. Receive the authorization code and state.
5. Validate the returned state against the stored state.
6. Exchange the authorization code for an access token.
7. Fetch the user's 42 profile.
8. Resolve or create the corresponding local user and OAuth account.
9. Create a refresh-token session.
10. Issue the access JWT and authentication cookies.

The Express session is used for OAuth state management, not as the application's primary authentication mechanism.

JWTs provide authenticated API access.

---

## 10. Cookie and frontend integration

The frontend must send cookies with requests.

For Fetch:

```ts
fetch('/api/v1/auth/me', {
    credentials: 'include'
});
```

For Axios:

```ts
axios.defaults.withCredentials = true;
```

Because the cookies are HttpOnly, frontend JavaScript cannot read their values directly.

The frontend should use `/api/v1/auth/me` to retrieve the current authenticated user's profile.

When the access token expires, the frontend can call the refresh endpoint and retry the original request after successful renewal.

Concurrent refresh requests should be coordinated to avoid unnecessary token rotation and replay detection.

---

## 11. Verification and testing completed

### Registration

- Valid registration.
- Invalid username.
- Invalid email.
- Invalid password.
- Duplicate username/email.
- Argon2id hash stored in PostgreSQL.
- Successful registration creates an authenticated session.

### Login

- Login using username.
- Login using email.
- Incorrect password.
- Nonexistent username.
- OAuth-only account without a password.
- Remember Me enabled and disabled.

Invalid credentials consistently return `401 Unauthorized`.

### Refresh tokens

- Successful token rotation.
- Concurrent refresh requests.
- Refresh-token replay detection.
- Revocation of the affected token family.
- Expired token rejection.
- HTTP replay test.

### Current-user endpoint

| Test | Expected | Actual |
|---|---:|---:|
| Valid access-token cookie | 200 | 200 |
| Missing access-token cookie | 401 | 401 |
| Invalid access-token cookie | 401 | 401 |

The TypeScript check also passed:

```bash
npm run check
```

---

## 12. Current implementation status

The following functionality is implemented:

- [x] 42 OAuth authentication
- [x] JWT access-token generation and verification
- [x] Authentication middleware
- [x] Refresh-token persistence
- [x] Refresh-token rotation
- [x] Refresh-token replay detection
- [x] Logout
- [x] API versioning (`/api/v1`)
- [x] User registration
- [x] Argon2id password hashing
- [x] Username/email login
- [x] Remember Me
- [x] Current-user endpoint (`/me`)
- [x] Basic endpoint tests for registration, login, refresh, and `/me`

### Remaining security and authentication work

These are not yet considered completed:

- Login rate limiting and brute-force protection.
- CSRF protection review for cookie-authenticated endpoints.
- Express session regeneration after successful OAuth authentication.
- Email verification.
- Two-factor authentication (2FA).
- More comprehensive automated integration tests.
- Frontend authentication and refresh coordination.

**Important:** Email verification and 2FA are separate features. Email verification proves control of an email address; 2FA requires an additional authentication factor.

---

## 13. Relevant source structure

```text
src/modules/auth/
├── controllers/
│   └── auth.controller.ts
├── routes/
│   └── auth.routes.ts
├── repositories/
│   ├── oauth.repository.ts
│   ├── refresh-token.repository.ts
│   └── user.repository.ts
├── services/
│   ├── 42-oauth.service.ts
│   ├── jwt.service.ts
│   ├── refresh-token.service.ts
│   ├── password.service.ts
│   ├── registration.service.ts
│   ├── registration.validation.ts
│   ├── login.service.ts
│   ├── login.validation.ts
│   └── current-user.service.ts
├── middlewares/
│   └── authenticate.ts
└── types/
    └── express.d.ts
```

The exact repository structure may contain additional files for OAuth configuration, database configuration, and application setup.
