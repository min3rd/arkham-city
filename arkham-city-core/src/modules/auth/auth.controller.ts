import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';

export interface RegisterByEmailDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(microserviceConfig.auth.name)
    private readonly client: ClientRedis,
  ) {}
  @Post('register-by-email')
  registerByEmail(@Body() payload: RegisterByEmailDto) {
    return this.client.send(
      microserviceConfig.auth.patterns.registerByEmail,
      payload,
    );
  }
}
