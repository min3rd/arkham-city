import { Injectable } from '@nestjs/common';
import { User } from '../user/user.type';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload, LogInResponseDto } from './auth.interface';
import { Role } from '../role/role.type';
import { aggregatePermissionScopes } from '../user/user.permissions';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async compileLogInResponse(
    user: User | undefined,
    ignoreRefreshToken: boolean = false,
  ): Promise<LogInResponseDto> {
    const permissionScopes = aggregatePermissionScopes(
      user as User & { roles?: Role[] },
    );
    const permissions = [...permissionScopes.system, ...permissionScopes.project];
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
    return (
      (user.roles as (Role | string)[] | undefined)?.map((role) =>
        typeof role === 'string' ? role : role._id,
      ) ?? []
    );
  }
}
