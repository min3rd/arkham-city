import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { microserviceConfig } from 'src/config/microservice.config';
import { Public } from 'src/core/decorators/public';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { MicroserviceResponse } from 'src/core/microservice/microservice.type';
import { CreateFirestoreRecord } from 'src/microservices/ms-firestore/ms-firestore.interface';

@Controller('firestore')
export class GwFirestoreController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.firestore.name)
    private readonly clientProxy: ClientRedis,
  ) {
    super();
  }
  @Public()
  @Post(':schemaName')
  async create(@Param() params: any, @Body() data: any) {
    const payload: CreateFirestoreRecord = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      schemaName: params.schemaName,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: data,
    };
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.firestore.patterns.createRecord,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.data;
  }
}
