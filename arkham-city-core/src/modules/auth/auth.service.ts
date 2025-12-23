import { Injectable } from '@nestjs/common';
import { User } from '../user/user.type';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload, LogInResponseDto } from './auth.interface';
import { Role } from '../role/role.type';
import { aggregatePermissions } from '../user/user.permissions';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async compileLogInResponse(
    user: User | undefined,
    ignoreRefreshToken: boolean = false,
  ): Promise<LogInResponseDto> {
    const payload: JWTPayload = {
      type: 'dashboard',
      sub: user?._id,
      username: user?.username,
      email: user?.email,
      roles: this.extractRoleIds(user),
      permissions: aggregatePermissions(user as User & { roles?: Role[] }),
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const response: LogInResponseDto = {
      accessToken: accessToken,
      refreshToken: ignoreRefreshToken ? undefined : user?.refreshToken,
      metadata: {
        ...user,
        refreshToken: undefined, //ignore refreshToken
        permissions: aggregatePermissions(user as User & { roles?: Role[] }),
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
