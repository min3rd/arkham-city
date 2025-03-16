import { Body, Controller, Post } from '@nestjs/common';
import {
  LogInByEmailAndPassword,
  RegisterByEmailAndPasswordDto,
} from './auth.type';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController extends GatewayController {
  constructor(private readonly authService: AuthService) {
    super();
  }
  @Post('register-by-email-and-password')
  registerByEmail(@Body() payload: RegisterByEmailAndPasswordDto) {
    return this.authService.registerByEmailAndPassword(
      payload.email,
      payload.password,
    );
  }

  @Post('log-in-by-email-and-password')
  logInByEmailAndPassword(@Body() payload: LogInByEmailAndPassword) {
    return this.authService.logInByEmailAndPassword(
      payload.email,
      payload.password,
    );
  }
}
