import { Injectable } from '@nestjs/common';
import { User } from '../user/user.type';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload, LogInResponseDto } from './auth.interface';

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
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const response: LogInResponseDto = {
      accessToken: accessToken,
      refreshToken: ignoreRefreshToken ? undefined : user?.refreshToken,
      metadata: {
        ...user,
        refreshToken: undefined, //ignore refreshToken
      },
    };
    return response;
  }
}
