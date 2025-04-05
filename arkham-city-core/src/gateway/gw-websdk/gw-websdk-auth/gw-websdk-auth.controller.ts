/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { WebSDKAuthReqDto } from './gw-websdk-auth.interface';
import { MicroserviceResponse } from 'src/core/microservice/microservice.type';
import { firstValueFrom } from 'rxjs';
import { GatewayController } from 'src/core/gateway/gateway.controller';

@Controller('websdk/auth')
export class GwWebsdkAuthController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.websdk.auth.name)
    private readonly clientProxy: ClientRedis,
  ) {
    super();
  }

  @Post('authenticate')
  async authenticate(@Body() dto: WebSDKAuthReqDto) {
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.auth.patterns.authenticate,
        dto,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
