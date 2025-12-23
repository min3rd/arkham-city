import { Role } from '../role/role.type';
import { User } from './user.type';

export interface PermissionScopes {
  system: string[];
  project: string[];
}

const PROJECT_SCOPE_PREFIX = 'project:';

const isRoleDocument = (role: Role | string): role is Role =>
  typeof role !== 'string';

const classifyScope = (permission: string): keyof PermissionScopes =>
  permission.startsWith(PROJECT_SCOPE_PREFIX) ? 'project' : 'system';

export const aggregatePermissionScopes = (
  user?: User & { roles?: (Role | string)[] },
): PermissionScopes => {
  const scopes: PermissionScopes = { system: [], project: [] };
  if (!user) {
    return scopes;
  }
  const addPermission = (permission: string) => {
    const scope = classifyScope(permission);
    if (!scopes[scope].includes(permission)) {
      scopes[scope].push(permission);
    }
  };
  (user.permissions ?? []).forEach(addPermission);
  (user.roles as (Role | string)[] | undefined)?.forEach((role) => {
    if (!isRoleDocument(role)) {
      return;
    }
    role.permissions?.forEach(addPermission);
  });
  return scopes;
};

export const aggregatePermissions = (
  user?: User & { roles?: (Role | string)[] },
): string[] => {
  const { system, project } = aggregatePermissionScopes(user);
  return [...system, ...project];
};
