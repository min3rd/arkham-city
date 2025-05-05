import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { microserviceConfig } from 'src/config/microservice.config';
import { REQUEST_FIELDS } from 'src/config/request.config';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { ServiceResponse } from 'src/core/microservice/microservice.types';
import { CreateFirestoreRecordReqPayload } from 'src/microservices/ms-firestore/ms-firestore.interface';

@Controller('firestore')
export class GwFirestoreController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.firestore.name)
    private readonly rmqClient: ClientRMQ,
  ) {
    super();
  }

  @Post(':schemaName')
  async create(
    @Req() request: Request,
    @Param() params: any,
    @Body() data: any,
  ) {
    const payload: CreateFirestoreRecordReqPayload = {
      auth: request[REQUEST_FIELDS.user],
      schemaName: params.schemaName,
      data: data,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.firestore.patterns.createRecord,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get('rules')
  async getRules(@Req() request: Request) {
    const payload = {
      auth: request[REQUEST_FIELDS.user],
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.firestore.patterns.getAllRuleTypes,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get('conditions')
  async getConditions(@Req() request: Request) {
    const payload = {
      auth: request[REQUEST_FIELDS.user],
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.firestore.patterns.getAllRuleConditionTypes,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
