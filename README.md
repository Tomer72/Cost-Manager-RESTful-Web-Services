# Cost Manager Final Project

Basic repository structure for the Node.js final project.

The project uses four separate services because the course requires four separate processes:

```text
admin-logs-service -> GET /api/logs
users-service      -> POST /api/add, GET /api/users, GET /api/users/:id
costs-service      -> POST /api/add, GET /api/report
about-service      -> GET /api/about
```

Keep the implementation simple. Each service can put its route logic directly in `app.js`.

## Required Stack

```text
Node.js
Express.js
JavaScript
MongoDB Atlas
Mongoose
Pino
dotenv
Jest
Supertest
Docker
Docker Compose
```

Each service has a real `.env` file because the project requires using dotenv.
Before running the project, replace the placeholder `MONGODB_URI` with the MongoDB Atlas connection string.

Each service also has `pino` and `pino-http` dependencies. Every service should log incoming requests into the shared `logs` collection.

## Main Planning File

See [TASKS.md](/Users/tomerdahan/Desktop/final-project/TASKS.md).

## EC2 Ports

```text
3001 -> admin logs
3002 -> users
3003 -> costs
3004 -> about
```

## Submission Database State

Before submission, the database should contain only this imaginary user:

```text
id: 123123
first_name: mosh
last_name: israeli
```
