# Role-based access control

- Roles are stored in the metadata database using the `Role` schema (`name`, optional `description`, `permissions`, `default` flag, timestamps).
- Users reference roles and support permission overrides via the `roles` and `permissions` fields on the `User` document.
- New REST endpoints (gateway):
  - `GET /roles` — list roles.
  - `POST /roles` — create a role.
  - `PUT /roles/:id` — update a role.
  - `DELETE /roles/:id` — delete a role.
- Microservice patterns live under `microserviceConfig.role.*` for role CRUD.
- Use the `@Permissions(...permissions)` decorator to mark HTTP handlers; `PermissionsGuard` enforces them using the permissions embedded in JWTs or fetched from the user record.
- A bootstrap safeguard assigns the `roles:write` permission to the first registered user when no default roles exist so role management remains reachable.
