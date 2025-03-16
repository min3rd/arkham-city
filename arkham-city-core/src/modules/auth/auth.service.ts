import { Inject, Injectable } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { MicroserviceResponse } from 'src/core/microservice/microservice.type';
import { User } from '../user/user.type';
import { firstValueFrom } from 'rxjs';
import { BaseService } from 'src/core/base/base.service';
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
  ): Promise<RegisterResponseDto> {
    const res: MicroserviceResponse<User> = await firstValueFrom(
      this.client.send(
        microserviceConfig.auth.patterns.registerByEmailAndPassword,
        { email: email, password: password },
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
    const payload: JWTPayload = {
      sub: res.data?.username,
      username: res.data?.username,
      email: res.data?.email,
    };
    const response: LogInResponseDto = {
      accessToken: await this.jwtService.signAsync(payload),
    };
    return response;
  }
}
