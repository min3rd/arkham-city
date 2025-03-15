import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { RegisterByEmailDto } from '../auth/auth.controller';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    @Inject(microserviceConfig.auth.name) private readonly client: ClientProxy,
    private readonly userService: UserService,
  ) {}

  @MessagePattern(microserviceConfig.auth.patterns.registerByEmail)
  registerByEmail(@Payload() payload: RegisterByEmailDto) {
    return this.userService.registerByEmail(payload.email, payload.password);
  }
}
