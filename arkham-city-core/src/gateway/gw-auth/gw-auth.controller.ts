import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import {
  LogInByEmailAndPassword,
  LogInByRefreshToken,
  RegisterByEmailAndPasswordDto,
} from '../../modules/auth/auth.interface';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { AuthService } from '../../modules/auth/auth.service';
import { Public } from 'src/core/decorators/public';
import { microserviceConfig } from 'src/config/microservice.config';
import { ClientRMQ } from '@nestjs/microservices';
import { ServiceResponse } from 'src/core/microservice/microservice.types';
import { User } from 'src/modules/user/user.type';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class GwAuthController extends GatewayController {
  private readonly logger = new Logger(GwAuthController.name);

  constructor(
    @Inject(microserviceConfig.auth.name)
    private readonly rmqClient: ClientRMQ,
    private readonly authService: AuthService,
  ) {
    super();
  }

  @Public()
  @Post('register-by-email-and-password')
  async registerByEmail(@Body() payload: RegisterByEmailAndPasswordDto) {
    this.logger.debug('Registering user by email and password', payload);
    const res: ServiceResponse<User> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.auth.patterns.registerByEmailAndPassword,
        {
          email: payload.email,
          password: payload.password,
          firstName: payload.firstName,
          lastName: payload.lastName,
        },
      ),
    );
    this.afterCallMicroservice(res);
    return {
      username: res.data?.username,
      email: res.data?.email,
    };
  }

  @Public()
  @Post('log-in-by-email-and-password')
  async logInByEmailAndPassword(@Body() payload: LogInByEmailAndPassword) {
    const res: ServiceResponse<User> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.auth.patterns.logInByEmailAndPassword,
        { email: payload.email, password: payload.password },
      ),
    );
    this.afterCallMicroservice(res);
    return await this.authService.compileLogInResponse(res.data, false);
  }

  @Public()
  @Post('log-in-by-refresh-token')
  async logInByRefreshToken(@Body() payload: LogInByRefreshToken) {
    const res: ServiceResponse<User> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.auth.patterns.logInByRefreshToken,
        {
          refreshToken: payload.refreshToken,
        },
      ),
    );
    this.afterCallMicroservice(res);
    return await this.authService.compileLogInResponse(res.data, false);
  }
}
