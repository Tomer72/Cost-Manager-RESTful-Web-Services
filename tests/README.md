# Tests

Unit tests for all four services using Jest and the native `fetch` API.

## Running

```bash
npm test
```

Services must be running locally (via `docker compose up`) before running the tests.

## Test Files

| File | Service |
|---|---|
| `about.test.js` | about-service (port 3004) |
| `logs.test.js` | admin-logs-service (port 3001) |
| `users.test.js` | users-service (port 3002) |
| `costs.test.js` | costs-service (port 3003) |

## Coverage

- `GET /api/about` — returns 200, array, only first_name and last_name
- `GET /api/logs` — returns 200, array, correct fields, new log created per request
- `POST /api/add` (users) — valid user, duplicate user, missing fields
- `GET /api/users` — returns array
- `GET /api/users/:id` — returns user with total, unknown user error
- `POST /api/add` (costs) — valid cost, invalid category, missing fields, non-existing user, past date
- `GET /api/report` — grouped categories, empty categories, sum/description/day fields, invalid params, computed pattern cache
