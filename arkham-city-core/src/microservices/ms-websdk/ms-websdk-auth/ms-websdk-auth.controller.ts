import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { WebSDKAuthReqPayload } from './ms-websdk-auth.interface';
import { WebSDKAuthService } from 'src/modules/websdk/websdk-auth/websdk-auth.service';

@Controller('')
export class MsWebsdkAuthController {
  constructor(private readonly authService: WebSDKAuthService) {}
  @MessagePattern(microserviceConfig.websdk.auth.patterns.authenticate)
  authenticate(@Payload() payload: WebSDKAuthReqPayload) {
    return this.authService.authenticate(
      payload.projectId,
      payload.appId,
      payload.secretKey,
      payload.userToken,
    );
  }
}
