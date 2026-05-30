# Cost Manager RESTful Web Services

Final project for the Asynchronous Server-Side Development course.

The project is built as four separate Node.js microservices, each running as an independent process on a different port.

## Services

| Service | Port | Endpoints |
|---|---|---|
| admin-logs-service | 3001 | `GET /api/logs` |
| users-service | 3002 | `POST /api/add`, `GET /api/users`, `GET /api/users/:id` |
| costs-service | 3003 | `POST /api/add`, `GET /api/report` |
| about-service | 3004 | `GET /api/about` |

## Stack

- Node.js + Express.js
- MongoDB Atlas + Mongoose
- Pino + pino-http (request logging)
- dotenv
- Jest + Supertest (unit tests)
- Docker + Docker Compose

## Running Locally

```bash
docker compose up --build
```

Each service requires a `.env` file with:

```text
PORT
MONGODB_URI
SERVICE_NAME
```

The `about-service` also requires team member names:

```text
TEAM_MEMBER_1_FIRST_NAME
TEAM_MEMBER_1_LAST_NAME
TEAM_MEMBER_2_FIRST_NAME
TEAM_MEMBER_2_LAST_NAME
TEAM_MEMBER_3_FIRST_NAME
TEAM_MEMBER_3_LAST_NAME
```

## Running Tests

```bash
cd tests
npm test
```

## Submission Database State

Before submission, the database should contain only this imaginary user:

```text
id: 123123
first_name: mosh
last_name: israeli
```
