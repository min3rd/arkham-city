import { Body, Controller, Post } from '@nestjs/common';
import {
  LogInByEmailAndPassword,
  RegisterByEmailAndPasswordDto,
} from './auth.type';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { AuthService } from './auth.service';
import { Public } from 'src/core/decorators/public';

@Controller('auth')
export class AuthController extends GatewayController {
  constructor(private readonly authService: AuthService) {
    super();
  }
  @Public()
  @Post('register-by-email-and-password')
  registerByEmail(@Body() payload: RegisterByEmailAndPasswordDto) {
    return this.authService.registerByEmailAndPassword(
      payload.email,
      payload.password,
    );
  }

  @Public()
  @Post('log-in-by-email-and-password')
  logInByEmailAndPassword(@Body() payload: LogInByEmailAndPassword) {
    return this.authService.logInByEmailAndPassword(
      payload.email,
      payload.password,
    );
  }
}
