# Costs Service

Runs on port **3003**.

## Endpoints

### POST /api/add
Adds a new cost item. Validates that the user exists, the category is valid, the sum is positive, and the date is not in the past.

Request body:
```json
{
  "userid": 123123,
  "description": "milk",
  "category": "food",
  "sum": 8,
  "date": "2026-05-30"
}
```

`date` is optional — defaults to the current date if not provided.

Allowed categories: `food`, `health`, `housing`, `sports`, `education`.

Returns the saved cost document on success, or `{ id, message }` on error.

### GET /api/report
Returns a monthly report grouped by category for a specific user.

Query parameters: `id`, `year`, `month`

Example:
```
GET /api/report?id=123123&year=2026&month=5
```

Response:
```json
{
  "userid": 123123,
  "year": 2026,
  "month": 5,
  "costs": [
    { "food": [{ "sum": 8, "description": "milk", "day": 30 }] },
    { "education": [] },
    { "health": [] },
    { "housing": [] },
    { "sports": [] }
  ]
}
```

All five categories always appear, even if empty.

Reports for past months are cached using the **Computed Design Pattern** — the first request calculates and saves the report, subsequent requests return the cached version.

## Environment Variables

```text
PORT=3003
MONGODB_URI=<your MongoDB Atlas connection string>
SERVICE_NAME=costs-service
```

## Running

```bash
npm start
```
