# Unit Tests Plan

Use this folder for endpoint tests.

Recommended stack:

- Jest
- Supertest

## About Service Tests

- `GET /api/about` returns status 200.
- Response is an array.
- Each item includes only `first_name` and `last_name`.

## Users Service Tests

- `POST /api/add` creates a valid user.
- `POST /api/add` rejects missing fields.
- `POST /api/add` rejects duplicate `id`.
- `GET /api/users` returns an array.
- `GET /api/users/:id` returns user details.
- `GET /api/users/:id` includes `total`.
- `GET /api/users/:id` returns error JSON for an unknown user.

## Costs Service Tests

- `POST /api/add` creates a valid cost.
- `POST /api/add` rejects invalid category.
- `POST /api/add` rejects missing fields.
- `POST /api/add` rejects non-existing `userid`.
- `POST /api/add` rejects past date.
- `POST /api/add` uses current date if date is missing.
- `GET /api/report` returns grouped categories.
- `GET /api/report` includes empty categories.
- `GET /api/report` returns `sum`, `description`, and `day`.
- `GET /api/report` returns error JSON for invalid query params.
- Past-month report is saved and reused.

## Logs Service Tests

- Calling any endpoint creates a log.
- `GET /api/logs` returns an array.
- Logs include useful fields such as method, URL, message, and date.
- Errors are also logged.

