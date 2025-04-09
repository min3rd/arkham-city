/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { GwWebSDKAuthReqDto } from './gw-websdk-auth.interface';
import { MicroserviceResponse } from 'src/core/microservice/microservice.types';
import { firstValueFrom } from 'rxjs';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { Public } from 'src/core/decorators/public';
import { MsWebSDKAuthReqPayload } from 'src/microservices/ms-websdk/ms-websdk-auth/ms-websdk-auth.interface';

@Controller('websdk/auth')
export class GwWebsdkAuthController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.websdk.auth.name)
    private readonly clientProxy: ClientRedis,
  ) {
    super();
  }
  @Public()
  @Post('authenticate')
  async authenticate(@Body() dto: GwWebSDKAuthReqDto) {
    const payload: MsWebSDKAuthReqPayload = {
      projectId: dto.projectId,
      appId: dto.appId,
      secretKey: dto.secretKey,
      userToken: dto.userToken,
    };
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.auth.patterns.authenticate,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
