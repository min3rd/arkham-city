import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import {
  LogInByEmailAndPassword,
  RegisterByEmailAndPasswordDto,
} from './auth.type';
import { firstValueFrom } from 'rxjs';
import { MicroserviceResponse } from 'src/core/microservice/microservice.type';
import { User } from '../user/user.type';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.auth.name)
    private readonly client: ClientRedis,
    private readonly authService: AuthService,
  ) {
    super();
  }
  @Post('register-by-email-and-password')
  async registerByEmail(@Body() payload: RegisterByEmailAndPasswordDto) {
    const res: MicroserviceResponse<User> = await firstValueFrom(
      this.client.send(
        microserviceConfig.auth.patterns.registerByEmailAndPassword,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res;
  }

  @Post('log-in-by-email-and-password')
  async logInByEmailAndPassword(@Body() payload: LogInByEmailAndPassword) {
    return this.authService.logInByEmailAndPassword(
      payload.email,
      payload.password,
    );
  }
}
