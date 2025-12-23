import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { REQUEST_FIELDS } from 'src/config/request.config';
import {
  REQUIRE_PERMISSION_KEY,
  REQUIRE_PERMISSION_SCOPABLE_KEY,
  ScopedPermissionMetadata,
} from 'src/core/decorators/permissions';
import { JWTPayload } from 'src/modules/auth/auth.interface';
import { RoleAssignmentService } from 'src/modules/role/role-assignment.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleAssignmentService: RoleAssignmentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(REQUIRE_PERMISSION_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];
    const scopedRequirement = this.reflector.getAllAndOverride<
      ScopedPermissionMetadata | undefined
    >(REQUIRE_PERMISSION_SCOPABLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requiredPermissions.length === 0 && !scopedRequirement) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request[REQUEST_FIELDS.user] as JWTPayload | undefined;
    if (!user?.sub) {
      throw new ForbiddenException();
    }
    if (user.superAdmin) {
      return true;
    }
    const scopeOptions = this.buildScopeOptions(request, scopedRequirement);
    const scopes = await this.roleAssignmentService.resolvePermissionScopes(
      user.sub,
      scopeOptions,
    );
    const effective = new Set(scopes.effective);
    if (
      requiredPermissions.length > 0 &&
      !requiredPermissions.every((permission) => effective.has(permission))
    ) {
      throw new ForbiddenException();
    }
    if (scopedRequirement) {
      const scopedPermissions =
        scopedRequirement.scopeType === 'resource'
          ? new Set([...scopes.system, ...scopes.project, ...scopes.resource])
          : new Set([...scopes.system, ...scopes.project]);
      if (!scopedPermissions.has(scopedRequirement.permission)) {
        throw new ForbiddenException();
      }
    }
    return true;
  }

  private extractScopeValue(
    request: Request,
    scopedRequirement?: ScopedPermissionMetadata,
  ): string | undefined {
    if (!scopedRequirement) {
      return undefined;
    }
    return (
      (request.params?.[scopedRequirement.scopeField] as string | undefined) ??
      (request.query?.[scopedRequirement.scopeField] as string | undefined) ??
      (request.body?.[scopedRequirement.scopeField] as string | undefined)
    );
  }

  private buildScopeOptions(
    request: Request,
    scopedRequirement?: ScopedPermissionMetadata,
  ) {
    const projectIdFromRequest =
      (request.params?.projectId as string | undefined) ??
      (request.query?.projectId as string | undefined) ??
      (request.body?.projectId as string | undefined);
    const scopeValue = this.extractScopeValue(request, scopedRequirement);
    return {
      projectId:
        scopedRequirement?.scopeType === 'resource'
          ? projectIdFromRequest
          : (projectIdFromRequest ?? scopeValue),
      resourceId:
        scopedRequirement?.scopeType === 'resource' ? scopeValue : undefined,
    };
  }
}
