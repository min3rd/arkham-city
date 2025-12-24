# User Management

## API surface

Gateway routes (guarded with `roles:write`):

- `GET /users` — list with `search`, `roles[]`, `status`, `page`, `limit`, `sortBy`, `sortOrder`.
- `GET /users/:id` — fetch a single user with roles and effective permissions.
- `POST /users` — create admin-created user (email, optional password, names, phone, roles, permissions, status, metadata).
- `PUT /users/:id` — update profile fields, roles, permissions or status.
- `PATCH /users/:id/status` — enable/disable account.
- `POST /users/:id/roles` — replace assigned roles.
- `DELETE /users/:id` — delete user.

Microservice patterns (RabbitMQ) mirror the same operations under `microserviceConfig.user.patterns`.

## RBAC and audit

- All admin actions require `roles:write`.
- `status: 'disabled'` blocks login and refresh-token flows.
- `createdBy`/`updatedBy` are set from the acting user when provided.

## Migration

Existing users should be backfilled with `status: 'active'` (default) and optional `metadata`. Example Mongo script:

```js
db.users.updateMany({ status: { $exists: false } }, { $set: { status: 'active' } });
```

Ensure admin roles include `roles:write` to access the new endpoints.
