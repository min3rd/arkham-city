import { Body, Controller, Inject, Param, Post, Req } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { microserviceConfig } from 'src/config/microservice.config';
import { REQUEST_FIELDS } from 'src/config/request.config';
import { Public } from 'src/core/decorators/public';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { MicroserviceResponse } from 'src/core/microservice/microservice.types';
import { CreateFirestoreRecordReqPayload } from 'src/microservices/ms-firestore/ms-firestore.interface';

@Controller('firestore')
export class GwFirestoreController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.firestore.name)
    private readonly clientProxy: ClientRedis,
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
