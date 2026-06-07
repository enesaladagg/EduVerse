# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — 2026-05-06

### Security
- **Removed** `express-status-monitor` — exposed an unauthenticated `/status` WebSocket dashboard
- **Added** `helmet` — sets 11 HTTP security response headers (CSP, HSTS, X-Frame-Options, etc.)
- **Added** `cors` — strict origin allowlist via `CORS_ORIGINS` env var; rejects unlisted origins
- **Added** `express-rate-limit` — global 100 req/15 min limit; tighter 20 req/15 min limit on auth endpoints
- **Added** `express-mongo-sanitize` — strips `$` and `.` operators from request bodies to prevent NoSQL injection
- **Added** `bcryptjs` — passwords hashed at cost factor 12 before storage; plaintext never persisted
- **Added** `jsonwebtoken` — stateless JWT authentication; tokens signed with `JWT_SECRET` env var
- **Added** `joi` — server-side input validation with schema enforcement and `stripUnknown` to prevent mass assignment
- **Added** `JWT_SECRET` validation on startup — server refuses to start in production without a 32+ char secret
- **Hardened** `GET /api/health` — host and database name are now omitted in production responses
- **Fixed** `POST /api/users` — removed unauthenticated user creation endpoint (was a mass-assignment vulnerability)

### Added
- `POST /api/auth/register` — validated user registration with password hashing and JWT response
- `POST /api/auth/login` — credential verification with constant-time comparison; returns JWT
- `GET /api/users` — now requires Bearer JWT and teacher role
- `backend/middleware/auth.js` — `authenticate` and `authorize` middleware
- `backend/middleware/validate.js` — Joi-based request validation factory
- `backend/routes/auth.js` — register and login routes
- `backend/tests/auth.test.js` — 10 integration tests covering registration, login, validation, and NoSQL injection
- `backend/tests/users.test.js` — 8 integration tests covering auth guards, RBAC, and security headers
- `backend/.env.example` — updated with `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGINS`
- `SECURITY_SPRINT_LOG.md` — full audit trail of changes made during this sprint

### Changed
- `backend/models/User.js` — added `pre('save')` bcrypt hook, `comparePassword()` method, `toSafeObject()` helper; password field is `select: false` by default
- `backend/config/env.js` — added `jwtSecret` and `jwtExpiresIn`; validates JWT_SECRET length in production
- `backend/app.js` — removed `express-status-monitor`; added helmet, cors, rate limiters, mongo-sanitize; reduced JSON body limit from 1 MB to 50 KB
- `backend/routes/health.js` — production responses omit `host` and `name` fields
- `.gitignore` — added `backend/security-report.json` and `backend/logs/`

### Removed
- `express-status-monitor` dependency
- Unauthenticated `POST /api/users` endpoint
