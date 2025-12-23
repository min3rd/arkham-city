import { Role } from '../role/role.type';
import { User } from './user.type';

const isRoleDocument = (role: Role | string): role is Role =>
  typeof role !== 'string';

export const aggregatePermissions = (
  user?: User & { roles?: (Role | string)[] },
): string[] => {
  if (!user) {
    return [];
  }
  const permissions = new Set<string>();
  (user.permissions ?? []).forEach((permission) => permissions.add(permission));
  (user.roles as (Role | string)[] | undefined)?.forEach((role) => {
    if (!isRoleDocument(role)) {
      return;
    }
    role.permissions?.forEach((permission) => permissions.add(permission));
  });
  return Array.from(permissions);
};
