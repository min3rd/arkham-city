import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { microserviceConfig } from 'src/config/microservice.config';
import { REQUEST_FIELDS } from 'src/config/request.config';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { ServiceResponse } from 'src/core/microservice/microservice.types';
import { CreateFirestoreRecordReqPayload } from 'src/microservices/ms-firestore/ms-firestore.interface';
import {
  MsWebSDKFirestoreDeleteByIdReqPayload,
  MsWebSDKFirestoreFindByIdReqPayload,
  MsWebSDKFirestoreQuerySchemaReqPayload,
  MsWebSDKFirestoreUpdateReqPayload,
} from 'src/microservices/ms-websdk/ms-websdk-firestore/ms-websdk-firestore.interface';

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
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.firestore.patterns.createRecord,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Post(':schemaName/query')
  async querySchema(
    @Req() request: Request,
    @Param() params: any,
    @Body() query: any,
  ) {
    const payload: MsWebSDKFirestoreQuerySchemaReqPayload = {
      auth: request[REQUEST_FIELDS.auth],
      schemaName: params.schemaName,
      query: query,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.firestore.patterns.querySchema,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get(':schemaName/:id')
  async findById(@Req() request: Request, @Param() params: any) {
    const payload: MsWebSDKFirestoreFindByIdReqPayload = {
      auth: request[REQUEST_FIELDS.auth],
      schemaName: params.schemaName,
      id: params.id,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.firestore.patterns.findById,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Put(':schemaName/:id')
  async update(
    @Req() request: Request,
    @Param() params: any,
    @Body() data: any,
  ) {
    const payload: MsWebSDKFirestoreUpdateReqPayload = {
      auth: request[REQUEST_FIELDS.auth],
      schemaName: params.schemaName,
      id: params.id,
      data: data,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.firestore.patterns.update,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Patch(':schemaName/:id')
  async partialUpdate(
    @Req() request: Request,
    @Param() params: any,
    @Body() data: any,
  ) {
    const payload: MsWebSDKFirestoreUpdateReqPayload = {
      auth: request[REQUEST_FIELDS.auth],
      schemaName: params.schemaName,
      id: params.id,
      data: data,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.firestore.patterns.partialUpdate,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Delete(':schemaName/:id')
  async deleteById(@Req() request: Request, @Param() params: any) {
    const payload: MsWebSDKFirestoreDeleteByIdReqPayload = {
      auth: request[REQUEST_FIELDS.auth],
      schemaName: params.schemaName,
      id: params.id,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.websdk.firestore.patterns.deleteById,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
