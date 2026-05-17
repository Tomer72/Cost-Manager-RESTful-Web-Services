# Users Service

Basic service for:

```text
POST /api/add
GET /api/users
GET /api/users/:id
```

Put the endpoints directly in `app.js`.

Use `models/user.model.js`.

Use `models/cost.model.js` only to calculate total costs for `GET /api/users/:id`.
