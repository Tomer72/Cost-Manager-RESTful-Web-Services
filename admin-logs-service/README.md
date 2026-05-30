# Admin Logs Service

Runs on port **3001**.

## Endpoint

```
GET /api/logs
```

Returns a JSON array of all request logs saved to the shared `logs` collection in MongoDB, sorted newest first.

Each log entry includes:

```text
method     - HTTP verb (GET, POST, etc.)
url        - request path
status     - HTTP response status code
service    - name of the service that wrote the log
timestamp  - date and time of the request
```

## Environment Variables

```text
PORT=3001
MONGODB_URI=<your MongoDB Atlas connection string>
SERVICE_NAME=admin-logs-service
```

## Running

```bash
npm start
```
