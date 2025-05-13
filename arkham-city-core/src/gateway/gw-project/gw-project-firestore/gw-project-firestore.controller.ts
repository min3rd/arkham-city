import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Req,
} from '@nestjs/common';
import { GwQueryReqDto } from '../../../core/gateway/gateway.types';
import { microserviceConfig } from '../../../config/microservice.config';
import { ClientRMQ } from '@nestjs/microservices';
import { GatewayController } from '../../../core/gateway/gateway.controller';
import { ServiceResponse } from '../../../core/microservice/microservice.types';
import { firstValueFrom } from 'rxjs';
import { MsQueryProjectFirestoreSchemaReqPayload } from '../../../microservices/ms-project/ms-project-firestore/ms-project-firestore.types';
import { REQUEST_FIELDS } from '../../../config/request.config';

@Controller('projects')
export class GwProjectFirestoreController extends GatewayController {
  private readonly logger = new Logger(GwProjectFirestoreController.name);

  constructor(
    @Inject(microserviceConfig.project.firestore.schema.name)
    private readonly rmqClient: ClientRMQ,
  ) {
    super();
  }

  @Get(':projectId/schemas')
  async querySchemas(
    @Req() request: Request,
    @Param('projectId') projectId: string,
    @Body() queryDto: GwQueryReqDto,
  ) {
    this.logger.debug('querySchemas', projectId, queryDto);
    const payload: MsQueryProjectFirestoreSchemaReqPayload = {
      auth: request[REQUEST_FIELDS.user],
      projectId: projectId,
      query: queryDto.query,
      page: queryDto.page,
      size: queryDto.size,
    };
    const response: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.project.firestore.schema.patterns.query,
        payload,
      ),
    );
    this.afterCallMicroservice(response);
    return response.data;
  }
}
