import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { UserService } from './user.service';
import {
  LogInByEmailAndPassword,
  RegisterByEmailAndPasswordDto,
} from '../auth/auth.type';

@Controller('user')
export class UserController {
  constructor(
    @Inject(microserviceConfig.auth.name) private readonly client: ClientProxy,
    private readonly userService: UserService,
  ) {}

  @MessagePattern(microserviceConfig.auth.patterns.registerByEmailAndPassword)
  registerByEmailAndPassword(
    @Payload() payload: RegisterByEmailAndPasswordDto,
  ) {
    return this.userService.registerByEmailAndPassword(
      payload.email,
      payload.password,
    );
  }

  @MessagePattern(microserviceConfig.auth.patterns.logInByEmailAndPassword)
  logInByEmailAndPassword(@Payload() payload: LogInByEmailAndPassword) {
    return this.userService.findOneByEmailAndPassword(
      payload.email,
      payload.password,
    );
  }
}
