import { Injectable } from '@nestjs/common';
import { User } from '../user/user.type';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload, LogInResponseDto } from './auth.interface';
import { Role } from '../role/role.type';
import { RoleAssignmentService } from '../role/role-assignment.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roleAssignmentService: RoleAssignmentService,
  ) {}

  async compileLogInResponse(
    user: User | undefined,
    ignoreRefreshToken: boolean = false,
  ): Promise<LogInResponseDto> {
    const permissionScopes =
      (user as any)?.permissionScopes ??
      (await this.roleAssignmentService.resolvePermissionScopes(
        user?._id as string,
        {
          baseUser: user as User & { roles?: Role[] },
        },
      ));
    const permissions =
      (user as any)?.permissions ?? permissionScopes.effective;
    const payload: JWTPayload = {
      type: 'dashboard',
      sub: user?._id,
      username: user?.username,
      email: user?.email,
      roles: this.extractRoleIds(user),
      permissions,
      permissionScopes,
      superAdmin: user?.superAdmin,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const response: LogInResponseDto = {
      accessToken: accessToken,
      refreshToken: ignoreRefreshToken ? undefined : user?.refreshToken,
      metadata: {
        ...user,
        refreshToken: undefined, //ignore refreshToken
        permissions,
        permissionScopes,
        superAdmin: user?.superAdmin,
      },
    };
    return response;
  }

  private extractRoleIds(user?: User): string[] {
    if (!user) {
      return [];
    }
    const ids =
      user.roles?.map((role) => (typeof role === 'string' ? role : role._id)) ??
      [];
    return ids.filter((id): id is string => typeof id === 'string');
  }
}
