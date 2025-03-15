import {
  Body,
  Controller,
  Get,
  Inject,
  OnApplicationBootstrap,
  Post,
} from '@nestjs/common';
import { ClientRedis, MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { UserService } from '../user/user.service';

export interface RegisterByEmailDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController implements OnApplicationBootstrap {
  constructor(
    @Inject(microserviceConfig.auth.name)
    private readonly client: ClientRedis,
    private readonly userService: UserService,
  ) {}
  async onApplicationBootstrap() {
    await this.client.connect();
  }
  @Post('register-by-email')
  registerByEmail(@Body() payload: RegisterByEmailDto) {
    console.log(payload);
    return this.client.send(
      microserviceConfig.auth.patterns.registerByEmail,
      payload,
    );
  }

  @MessagePattern(microserviceConfig.auth.patterns.registerByEmail)
  _registerByEmail(@Payload() payload: RegisterByEmailDto) {
    return this.userService.register(payload);
  }
}
