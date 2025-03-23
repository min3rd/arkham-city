import { Inject, Injectable } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { MicroserviceResponse } from 'src/core/microservice/microservice.type';
import { User } from '../user/user.type';
import { firstValueFrom } from 'rxjs';
import { BaseService } from 'src/modules/base/base.service';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload, LogInResponseDto, RegisterResponseDto } from './auth.type';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    @Inject(microserviceConfig.auth.name) private readonly client: ClientRedis,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async registerByEmailAndPassword(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<RegisterResponseDto> {
    const res: MicroserviceResponse<User> = await firstValueFrom(
      this.client.send(
        microserviceConfig.auth.patterns.registerByEmailAndPassword,
        {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        },
      ),
    );
    this.afterCallMicroservice(res);
    return {
      username: res.data?.username,
      email: res.data?.email,
    };
  }

  async logInByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<LogInResponseDto> {
    const res: MicroserviceResponse<User> = await firstValueFrom(
      this.client.send(
        microserviceConfig.auth.patterns.logInByEmailAndPassword,
        { email: email, password: password },
      ),
    );

    this.afterCallMicroservice(res);
    return await this.compileLogInResponse(res.data);
  }

  async logInByRefreshToken(refreshToken) {
    const res: MicroserviceResponse<User> = await firstValueFrom(
      this.client.send(microserviceConfig.auth.patterns.logInByRefreshToken, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        refreshToken: refreshToken,
      }),
    );
    this.afterCallMicroservice(res);
    return await this.compileLogInResponse(res.data, true);
  }

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
