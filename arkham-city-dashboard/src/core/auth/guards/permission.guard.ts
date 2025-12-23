import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';

export const permissionGuard: CanActivateChildFn = (childRoute) => {
  const requiredPermissions = childRoute.data?.['permissions'] as
    | string[]
    | undefined;
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return of(true);
  }
  const authService: AuthService = inject(AuthService);
  return of(authService.hasAllPermissions(requiredPermissions));
};
