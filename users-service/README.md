# Users Service

Runs on port **3002**.

## Endpoints

### POST /api/add
Adds a new user. Rejects duplicate IDs.

Request body:
```json
{
  "id": 123123,
  "first_name": "mosh",
  "last_name": "israeli",
  "birthday": "1990-01-01"
}
```

Returns the saved user document on success, or `{ id, message }` on error.

### GET /api/users
Returns a JSON array of all users in the database.

### GET /api/users/:id
Returns a specific user by their numeric `id`, including their total costs.

Response:
```json
{
  "first_name": "mosh",
  "last_name": "israeli",
  "id": 123123,
  "total": 42
}
```

Returns `{ id, message }` if the user is not found.

## Environment Variables

```text
PORT=3002
MONGODB_URI=<your MongoDB Atlas connection string>
SERVICE_NAME=users-service
```

## Running

```bash
npm start
```
