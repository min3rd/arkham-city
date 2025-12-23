import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { REQUEST_FIELDS } from 'src/config/request.config';
import { PERMISSIONS_KEY } from 'src/core/decorators/permissions';
import { JWTPayload } from 'src/modules/auth/auth.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request[REQUEST_FIELDS.user] as JWTPayload | undefined;
    if (!user?.sub) {
      throw new ForbiddenException();
    }
    const permissions = user.permissions ?? [];
    const hasPermission = requiredPermissions.every((permission) =>
      permissions.includes(permission),
    );
    if (!hasPermission) {
      throw new ForbiddenException();
    }
    return true;
  }
}
