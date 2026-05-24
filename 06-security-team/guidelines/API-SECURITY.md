# API Security Guidelines

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Authentication Endpoints

| Endpoint | Method | Auth Required | Notes |
|----------|--------|--------------|-------|
| [BASE_PATH]/auth/login | POST | No | Issues access + refresh tokens |
| [BASE_PATH]/auth/logout | POST | Yes | Invalidates server-side session |
| [BASE_PATH]/auth/refresh | POST | No (refresh token) | Rotates refresh token on use |
| [BASE_PATH]/auth/me | GET | Yes | Returns current user profile |

**Token format:** [JWT / opaque token / session cookie — choose one]
**Access token lifetime:** [e.g., 15 minutes]
**Refresh token lifetime:** [e.g., 7 days]

Rules:
- Validate token signature and expiry on every protected request.
- Reject requests with missing, malformed, or expired tokens with HTTP 401.
- Rotate refresh tokens on use (one-time-use refresh tokens).
- Invalidate all refresh tokens on password change or logout.

---

## Authorization Middleware

Every protected route must pass through authorization middleware that:

1. Extracts and validates the authentication token.
2. Loads the user record and their roles/permissions.
3. Checks that the user has the required permission for the requested resource and action.
4. Returns HTTP 403 if the user is authenticated but not authorized.
5. Returns HTTP 401 if the user is not authenticated.

Do not perform authorization checks inline within route handlers — always delegate to middleware or a permission helper.

---

## Rate Limiting

| Endpoint Type | Limit | Window | Response |
|--------------|-------|--------|---------|
| Login / Auth | [N] requests | [WINDOW] | HTTP 429, Retry-After header |
| Password reset | [N] requests | [WINDOW] | HTTP 429 |
| Public read endpoints | [N] requests | [WINDOW] | HTTP 429 |
| Authenticated read endpoints | [N] requests | [WINDOW] | HTTP 429 |
| Write endpoints (POST/PUT/PATCH) | [N] requests | [WINDOW] | HTTP 429 |
| File upload endpoints | [N] requests | [WINDOW] | HTTP 429 |

Rules:
- Rate limit by IP for unauthenticated endpoints.
- Rate limit by user ID for authenticated endpoints.
- Return `Retry-After` header indicating when the client may retry.
- Log rate-limit violations for monitoring.

---

## Input Validation

- Validate all request parameters (path, query, body, headers) before processing.
- Reject requests with unexpected or disallowed fields (strict schema validation).
- Enforce maximum lengths on all string inputs.
- Enforce numeric ranges where applicable.
- Return HTTP 400 with a structured error body on validation failure.

**Validation error response format:**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "fields": {
    "[FIELD_NAME]": "[ERROR_DESCRIPTION]"
  }
}
```

---

## Error Responses

- Never expose stack traces, internal error messages, database errors, or file paths in API responses.
- Use generic, user-safe error messages for all 5xx responses.
- Use structured error codes so clients can handle specific cases programmatically.

**Standard error response format:**
```json
{
  "error": "[ERROR_CODE]",
  "message": "[HUMAN_READABLE_MESSAGE]"
}
```

**Common error codes:**

| HTTP Status | Error Code | Meaning |
|-------------|-----------|---------|
| 400 | `VALIDATION_ERROR` | Request body or params failed validation |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 403 | `FORBIDDEN` | Authenticated but not authorized |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | State conflict (e.g., duplicate record) |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error (generic) |

---

## CORS Configuration

- Restrict `Access-Control-Allow-Origin` to known, trusted origins. Do not use `*` in production.
- Allow only the HTTP methods required by the API (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`).
- Allow only the headers used by the API (`Content-Type`, `Authorization`, etc.).
- Set `Access-Control-Max-Age` to reduce preflight request frequency.

**Content Forge-specific allowed origins:**
```
[ORIGIN_1]   (e.g., https://app.example.com)
[ORIGIN_2]   (e.g., https://admin.example.com)
```

---

## Security Headers

The following headers must be set on all API responses:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Enforce HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `Content-Security-Policy` | [CSP_VALUE] | Restrict resource loading |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | [POLICY_VALUE] | Restrict browser feature access |
| `Cache-Control` | `no-store` | Prevent caching of sensitive responses |

> For the CSP and Permissions-Policy values, configure them to match the resources actually loaded by the application.

---

## JWT Best Practices

If using JWTs:

- Sign tokens with a strong algorithm: RS256 or ES256 (asymmetric) preferred over HS256.
- Never accept the `alg: none` algorithm.
- Validate `iss`, `aud`, `exp`, and `iat` claims on every request.
- Keep the JWT payload minimal — do not store sensitive data in the payload (it is base64-encoded, not encrypted).
- Store the signing key in a secrets manager, not in application code or config files.
