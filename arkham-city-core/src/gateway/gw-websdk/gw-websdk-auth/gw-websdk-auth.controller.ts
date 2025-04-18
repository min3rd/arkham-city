import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import {
  GwWebSDKAuthLogInDto,
  GwWebSDKAuthRegisterDto,
  GwWebSDKAuthReqDto,
} from './gw-websdk-auth.interface';
import { ServiceResponse } from 'src/core/microservice/microservice.types';
import { firstValueFrom } from 'rxjs';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { Public } from 'src/core/decorators/public';
import {
  MsWebSDKAuthLogInReqPayload,
  MsWebSDKAuthRegisterReqPayload,
  MsWebSDKAuthReqPayload,
} from 'src/microservices/ms-websdk/ms-websdk-auth/ms-websdk-auth.interface';
import { REQUEST_FIELDS } from 'src/config/request.config';
import { SDKJwtPayload } from 'src/modules/websdk/websdk-auth/websdk-auth.interface';

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
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.auth.patterns.authenticate,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Post('log-in-by-email-and-password')
  async logInByEmailAndPassword(
    @Req() request: Request,
    @Body() dto: GwWebSDKAuthLogInDto,
  ) {
    const payload: MsWebSDKAuthLogInReqPayload = {
      auth: request[REQUEST_FIELDS.auth] as SDKJwtPayload,
      email: dto.email,
      password: dto.password,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.auth.patterns.logInByEmailAndPassword,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Post('register-by-email-and-password')
  async registerByEmailAndPassword(
    @Req() request: Request,
    @Body() dto: GwWebSDKAuthRegisterDto,
  ) {
    const payload: MsWebSDKAuthRegisterReqPayload = {
      auth: request[REQUEST_FIELDS.auth] as SDKJwtPayload,
      email: dto.email,
      password: dto.password,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.auth.patterns.registerByEmailAndPassword,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
