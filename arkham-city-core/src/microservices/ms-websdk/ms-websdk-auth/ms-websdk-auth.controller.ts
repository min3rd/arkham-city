import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import {
  MsWebSDKAuthLogInReqPayload,
  MsWebSDKAuthRegisterReqPayload,
  MsWebSDKAuthReqPayload,
} from './ms-websdk-auth.interface';
import { WebSDKAuthService } from 'src/modules/websdk/websdk-auth/websdk-auth.service';

@Controller('')
export class MsWebsdkAuthController {
  constructor(private readonly authService: WebSDKAuthService) {}
  @MessagePattern(microserviceConfig.websdk.auth.patterns.authenticate)
  authenticate(@Payload() payload: MsWebSDKAuthReqPayload) {
    return this.authService.authenticate(
      payload.projectId,
      payload.appId,
      payload.secretKey,
      payload.userToken,
    );
  }

  @MessagePattern(
    microserviceConfig.websdk.auth.patterns.logInByEmailAndPassword,
  )
  logInByEmailAndPassword(@Payload() payload: MsWebSDKAuthLogInReqPayload) {
    return this.authService.logInByEmailAndPassword(
      payload.auth,
      payload.email,
      payload.password,
    );
  }

  @MessagePattern(
    microserviceConfig.websdk.auth.patterns.registerByEmailAndPassword,
  )
  registerByEmailAndPassword(
    @Payload() payload: MsWebSDKAuthRegisterReqPayload,
  ) {
    return this.authService.registerByEmailAndPassword(
      payload.auth,
      payload.email,
      payload.password,
    );
  }
}
