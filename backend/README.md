# Backend Setup

## Run

1. Install dependencies:
   npm install
2. Create environment file:
   copy .env.example .env
3. Update MONGO_URI in .env
4. Start development server:
   npm run dev

## Health Endpoint

- GET /api/health

Returns MongoDB connection state and backend health.

## Example Endpoints

- POST /api/users
- GET /api/users

Example create payload:

{
   "name": "Ada Lovelace",
   "email": "ada@example.com",
   "password": "secure-password",
   "role": "teacher"
}

## Database Error Handling

Database errors are mapped to structured error codes:

- DB_URI_MISSING
- DB_CONN_UNREACHABLE
- DB_SERVER_SELECTION_TIMEOUT
- DB_TIMEOUT
- DB_AUTH_FAILED
- DB_UNEXPECTED

These are returned in API responses and logged with technical context.

## Error Scenario Checklist

See backend/docs-db-error-scenarios.md for end-to-end checks.
