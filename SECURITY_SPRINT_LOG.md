# Security Hardening Sprint Log

**Branch:** `security/full-hardening-sprint`
**Started:** 2026-05-06
**Engineer:** Autonomous Security Sprint

---

## Phase 1: Reconnaissance & Backup — COMPLETE

### Findings
- `express-status-monitor` present in dependencies — exposes `/status` publicly, ships bundled Socket.IO
- `routes/users.js` accepts raw `req.body` for user creation — mass-assignment vulnerability
- `models/User.js` has no password hashing
- No authentication / JWT middleware
- No rate limiting
- No CORS configuration
- No input sanitisation / helmet headers
- Health route leaks DB host and name
- No `.env.example` file
- `security-report.json` is untracked (should be gitignored)
- Logger writes comments in source (minor)

---

## Phase 2: Dependency Cleanup

### 2026-05-06T00:00 — Remove express-status-monitor
- Uninstalled `express-status-monitor` from `backend/package.json`
- Removed usage from `backend/app.js`

### 2026-05-06T00:01 — Add security dependencies
Installed:
- `helmet` — HTTP security headers
- `express-rate-limit` — rate limiting
- `cors` — CORS policy
- `bcryptjs` — password hashing
- `jsonwebtoken` — JWT auth
- `express-mongo-sanitize` — NoSQL injection prevention
- `joi` — input validation
- `jest` + `supertest` — testing framework

---

## Phase 3: Security Hardening

### 2026-05-06T00:02 — Helmet + CORS + rate limiting added to app.js
### 2026-05-06T00:03 — Password hashing added to User model
### 2026-05-06T00:04 — Input validation middleware created
### 2026-05-06T00:05 — Auth middleware (JWT) created
### 2026-05-06T00:06 — Auth routes (register/login) created
### 2026-05-06T00:07 — Users route secured (auth + input validation)
### 2026-05-06T00:08 — Health route hardened (no host/DB name leak in production)
### 2026-05-06T00:09 — .env.example created
### 2026-05-06T00:10 — .gitignore updated
### 2026-05-06T00:11 — Tests written for auth and users routes
### 2026-05-06T00:12 — CHANGELOG updated
