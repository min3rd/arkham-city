# Roles & Permissions dashboard

The dashboard now includes a dedicated **Roles & Permissions** page (requires the `roles:write` permission) located at `/roles`.

## Capabilities
- List, search, and filter project roles (by name, default flag, or contained permission keys).
- Create or edit roles with overview details (name, description, default flag).
- Manage permission keys with a searchable list and quick add for custom keys.
- Assign or remove users from a role with scoped assignments (global, project, or resource).

## Usage
1. Open **Dashboard → Roles**. Use the search and filters on the left to find a role.
2. Select a role (or click **New role**) to open the detail drawer.
3. In the **Permissions** tab, toggle existing keys or add new ones (e.g., `project:read`, `project:storage:write`).
4. In the **Users** tab, search for a user, choose a scope (global/project/resource), and assign. Remove assignments from the same list.

Tabs mirror the Firestore layout pattern: Overview → Permissions → Users → Audit (placeholder for future history).
