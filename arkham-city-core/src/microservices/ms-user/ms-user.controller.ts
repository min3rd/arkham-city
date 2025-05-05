import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { UserService } from '../../modules/user/user.service';
import {
  LogInByEmailAndPassword,
  LogInByRefreshToken,
  RegisterByEmailAndPasswordDto,
} from '../../modules/auth/auth.interface';

@Controller()
export class MsUserController {
  private readonly logger = new Logger(MsUserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern(microserviceConfig.auth.patterns.registerByEmailAndPassword)
  registerByEmailAndPassword(
    @Payload() payload: RegisterByEmailAndPasswordDto,
  ) {
    this.logger.debug('Registering user by email and password', payload);
    return this.userService.registerByEmailAndPassword(
      payload.email,
      payload.password,
      payload.firstName,
      payload.lastName,
    );
  }

  @MessagePattern(microserviceConfig.auth.patterns.logInByEmailAndPassword)
  logInByEmailAndPassword(@Payload() payload: LogInByEmailAndPassword) {
    return this.userService.findOneByEmailAndPassword(
      payload.email,
      payload.password,
    );
  }

  @MessagePattern(microserviceConfig.auth.patterns.logInByRefreshToken)
  logInByRefreshToken(@Payload() payload: LogInByRefreshToken) {
    return this.userService.findOneByRefreshToken(payload.refreshToken);
  }
}
