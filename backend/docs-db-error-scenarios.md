# DB Error Scenarios

This checklist helps verify improved database error handling.

## 1) Missing URI

- Remove MONGO_URI from .env
- Run npm start
- Expected: process exits with DB_URI_MISSING

## 2) Unreachable Database

- Set MONGO_URI to a non-existing host or stop MongoDB
- Run npm start
- Expected: retry attempts and DB_CONN_UNREACHABLE or DB_SERVER_SELECTION_TIMEOUT

## 3) Authentication Failure

- Set invalid username/password in MONGO_URI
- Run npm start
- Expected: DB_AUTH_FAILED

## 4) Duplicate User Email

- Start MongoDB
- Create same user twice via POST /api/users
- Expected second request: DUPLICATE_RESOURCE (409)
