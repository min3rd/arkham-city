import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { microserviceConfig } from 'src/config/microservice.config';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { MicroserviceResponse } from 'src/core/microservice/microservice.type';
import { CreateFirestoreRecord } from 'src/microservices/firestore/firestore.type';

@Controller('firestore')
export class FirestoreController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.firestore.name)
    private readonly clientProxy: ClientRedis,
  ) {
    super();
  }
  @Post(':schemaName')
  async create(@Param() params: any, @Body() data: any) {
    const payload: CreateFirestoreRecord = {
      schemaName: params.schemaName,
      data: data,
    };
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.firestore.patterns.createRecord,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
