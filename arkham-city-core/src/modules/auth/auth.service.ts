import { Inject, Injectable } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { User } from '../user/user.type';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload, LogInResponseDto } from './auth.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(microserviceConfig.auth.name) private readonly client: ClientRedis,
    private readonly jwtService: JwtService,
  ) {}

  async compileLogInResponse(
    user: User | undefined,
    ignoreRefreshToken: boolean = false,
  ): Promise<LogInResponseDto> {
    const payload: JWTPayload = {
      sub: user?.username,
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
