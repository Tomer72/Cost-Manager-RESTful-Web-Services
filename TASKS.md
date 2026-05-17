# Basic Project Tasks

This project should stay simple. Use four separate Node.js services because the course requires four processes, but keep each service small.

Do not create controller/route/service layers unless the team really wants them. For the basic version, each service can define its endpoints directly in `app.js`.

Each service should use a real `.env` file with:

```text
PORT
MONGODB_URI
SERVICE_NAME
```

The about service also needs team member names in `.env`.

Each service should use Pino and save request logs to the shared MongoDB `logs` collection.

## Teammate 1: Users Service

Folder: `users-service`

Endpoints:

```text
POST /api/add
GET /api/users
GET /api/users/:id
```

Goal: handle users.

Input:

- Add user: `id`, `first_name`, `last_name`, `birthday`
- Get specific user: `id` in URL

Output:

- Added user JSON
- List of users
- Specific user JSON with `first_name`, `last_name`, `id`, `total`

Explanation:

This service should validate user data, prevent duplicate users, list users, and return one user with total costs.

Required models:

- `user.model.js`
- `cost.model.js` only for calculating total costs
- `log.model.js` for saving request logs

## Teammate 2: Costs Service

Folder: `costs-service`

Endpoints:

```text
POST /api/add
GET /api/report?id=123123&year=2026&month=1
```

Goal: handle costs and reports.

Input:

- Add cost: `description`, `category`, `userid`, `sum`, optional `date`
- Report: `id`, `year`, `month`

Output:

- Added cost JSON
- Monthly report grouped by category

Explanation:

This service should validate costs, verify that the user exists, reject invalid categories, reject past dates, and create monthly reports.

Required models:

- `cost.model.js`
- `user.model.js`
- `report.model.js`
- `log.model.js` for saving request logs

Computed Design Pattern:

For past months, save the calculated report in `reports`. If the same past report is requested again, return the saved report.

## Teammate 3: Logs, About, Tests, Deployment

Folders:

- `admin-logs-service`
- `about-service`
- `tests`

Endpoints:

```text
GET /api/logs
GET /api/about
```

Goal: handle logs, team details, tests, and deployment.

Input:

- Logs: no input
- About: no input

Output:

- Logs JSON array
- Team members array with only `first_name` and `last_name`

Explanation:

Use Pino for logging. Logs should be saved to MongoDB. About data should be hardcoded or loaded from `.env`, not saved in MongoDB.

Every service should use:

```text
pino
pino-http
models/log.model.js
```

This keeps logging simple and satisfies the requirement that every HTTP request is logged to MongoDB.

For `admin-logs-service`, the only model needed is:

```text
log.model.js
```

For `about-service`, the only model needed is:

```text
log.model.js
```

The about service does not store team members in MongoDB. It only connects to MongoDB so it can save logs.

## Required Unit Tests

Test every endpoint:

- Add user
- Duplicate user
- List users
- Get user by ID
- Add cost
- Invalid category
- Non-existing user in cost
- Monthly report with empty categories
- Monthly report with grouped costs
- About endpoint
- Logs endpoint
- Verify that requests create log records

## Required Dependencies

For services that use MongoDB:

```text
express
mongoose
dotenv
pino
pino-http
cors
```

For the about service:

```text
express
dotenv
mongoose
pino
pino-http
cors
```

The about service needs `mongoose` only because it writes logs to MongoDB.

For tests:

```text
jest
supertest
nodemon
```

## Deployment

Use one EC2 instance with Docker Compose.

```text
admin-logs-service -> port 3001
users-service      -> port 3002
costs-service      -> port 3003
about-service      -> port 3004
```

MongoDB should be MongoDB Atlas.
