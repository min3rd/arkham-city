import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { microserviceConfig } from 'src/config/microservice.config';
import { REQUEST_FIELDS } from 'src/config/request.config';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { MicroserviceResponse } from 'src/core/microservice/microservice.types';
import { CreateFirestoreRecordReqPayload } from 'src/microservices/ms-firestore/ms-firestore.interface';
import { MsWebSDKFirestoreQuerySchemaReqPayload } from 'src/microservices/ms-websdk/ms-websdk-firestore/ms-websdk-firestore.interface';

@Controller('websdk/firestore')
export class GwWebSDKFirestoreController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.websdk.firestore.name)
    private readonly clientProxy: ClientRedis,
  ) {
    super();
  }

  @Post(':schemaName')
  async createRecord(
    @Req() request: Request,
    @Param() params: any,
    @Body() data: any,
  ) {
    const payload: CreateFirestoreRecordReqPayload = {
      auth: request[REQUEST_FIELDS.auth],
      schemaName: params.schemaName,
      data: data,
    };
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.firestore.patterns.createRecord,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get(':schemaName')
  async querySchema(@Req() request: Request, @Param() params: any) {
    const payload: MsWebSDKFirestoreQuerySchemaReqPayload = {
      auth: request[REQUEST_FIELDS.auth],
      schemaName: params.schemaName,
    };
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.firestore.patterns.querySchema,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
