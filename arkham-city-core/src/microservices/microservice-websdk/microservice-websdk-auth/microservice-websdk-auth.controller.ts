import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { WebSDKAuthReqPayload } from './microservice-websdk-auth.interface';
import { AuthService } from 'src/modules/websdk/auth/auth.service';

@Controller('')
export class MicroserviceWebsdkAuthController {
  constructor(private readonly authService: AuthService) {}
  @MessagePattern(microserviceConfig.websdk.auth.patterns.authenticate)
  authenticate(@Payload() payload: WebSDKAuthReqPayload) {
    return this.authService.authenticate(
      payload.projectId,
      payload.appId,
      payload.secretKey,
    );
  }
}
