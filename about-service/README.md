# About Service

Runs on port **3004**.

## Endpoint

```
GET /api/about
```

Returns a JSON array of team members with only `first_name` and `last_name`.
Names are loaded from `.env` and are not stored in the database.

## Environment Variables

```text
PORT=3004
MONGODB_URI=<your MongoDB Atlas connection string>
SERVICE_NAME=about-service
TEAM_MEMBER_1_FIRST_NAME=
TEAM_MEMBER_1_LAST_NAME=
TEAM_MEMBER_2_FIRST_NAME=
TEAM_MEMBER_2_LAST_NAME=
TEAM_MEMBER_3_FIRST_NAME=
TEAM_MEMBER_3_LAST_NAME=
```

## Notes

- Connects to MongoDB only to write request logs to the shared `logs` collection.
- Does not store team member data in the database.

## Running

```bash
npm start
```
