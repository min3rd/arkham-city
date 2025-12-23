import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const REQUIRE_PERMISSION_KEY = PERMISSIONS_KEY;
export const REQUIRE_PERMISSION_SCOPABLE_KEY = 'permissions_scopable';

export type ScopedPermissionMetadata = {
  permission: string;
  scopeField: string;
  scopeType?: 'project' | 'resource';
};

export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(REQUIRE_PERMISSION_KEY, permissions);

export const RequirePermissionScopable = (
  permission: string,
  scopeField: string,
  scopeType: 'project' | 'resource' = 'project',
) =>
  SetMetadata(REQUIRE_PERMISSION_SCOPABLE_KEY, {
    permission,
    scopeField,
    scopeType,
  });

export const Permissions = (...permissions: string[]) =>
  RequirePermission(...permissions);
