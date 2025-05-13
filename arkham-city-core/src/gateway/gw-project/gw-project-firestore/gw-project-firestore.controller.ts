import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { GwQueryReqDto } from '../../../core/gateway/gateway.types';
import { microserviceConfig } from '../../../config/microservice.config';
import { ClientRMQ } from '@nestjs/microservices';
import { GatewayController } from '../../../core/gateway/gateway.controller';
import { ServiceResponse } from '../../../core/microservice/microservice.types';
import { firstValueFrom } from 'rxjs';
import {
  MsCreateProjectFirestoreSchemaRecordReqPayload,
  MsDeleteProjectFirestoreSchemaRecordReqPayload,
  MsGetProjectFirestoreSchemaRecordReqPayload,
  MsQueryProjectFirestoreSchemaRecordsReqPayload,
  MsQueryProjectFirestoreSchemaReqPayload,
  MsUpdateProjectFirestoreSchemaRecordReqPayload,
} from '../../../microservices/ms-project/ms-project-firestore/ms-project-firestore.types';
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
    @Query() queryDto: GwQueryReqDto,
  ) {
    this.logger.debug('querySchemas', projectId, queryDto);
    console.log(request);
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

  @Get(':projectId/schemas/:schemaName/records')
  async querySchemaRecords(
    @Req() request: Request,
    @Param('projectId') projectId: string,
    @Param('schemaName') schemaName: string,
    @Body() queryDto: GwQueryReqDto,
  ) {
    this.logger.debug('querySchemaRecords', projectId, schemaName, queryDto);
    const payload: MsQueryProjectFirestoreSchemaRecordsReqPayload = {
      auth: request[REQUEST_FIELDS.user],
      projectId: projectId,
      schemaName: schemaName,
      query: queryDto.query,
      page: queryDto.page,
      size: queryDto.size,
    };
    const response: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.project.firestore.record.patterns.queryRecord,
        payload,
      ),
    );
    this.afterCallMicroservice(response);
    return response.data;
  }

  @Get(':projectId/schemas/:schemaName/records/:recordId')
  async findSchemaRecordById(
    @Req() request: Request,
    @Param('projectId') projectId: string,
    @Param('schemaName') schemaName: string,
    @Param('recordId') recordId: string,
  ) {
    this.logger.debug('findSchemaRecordById', projectId, schemaName, recordId);
    const payload: MsGetProjectFirestoreSchemaRecordReqPayload = {
      auth: request[REQUEST_FIELDS.user],
      projectId: projectId,
      schemaName: schemaName,
      id: recordId,
    };
    const response: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.project.firestore.record.patterns.findById,
        payload,
      ),
    );
    this.afterCallMicroservice(response);
    return response.data;
  }

  @Post(':projectId/schemas/:schemaName/records')
  async createRecord(
    @Req() request: Request,
    @Param('projectId') projectId: string,
    @Param('schemaName') schemaName: string,
    @Body() body: any,
  ) {
    this.logger.debug('createRecord', projectId, schemaName, body);
    const payload: MsCreateProjectFirestoreSchemaRecordReqPayload = {
      auth: request[REQUEST_FIELDS.user],
      projectId: projectId,
      schemaName: schemaName,
      data: body,
    };
    const response: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.project.firestore.record.patterns.createRecord,
        payload,
      ),
    );
    this.afterCallMicroservice(response);
    return response.data;
  }

  @Put(':projectId/schemas/:schemaName/records/:recordId')
  async updateRecord(
    @Req() request: Request,
    @Param('projectId') projectId: string,
    @Param('schemaName') schemaName: string,
    @Param('recordId') recordId: string,
    @Body() body: any,
  ) {
    this.logger.debug('updateRecord', projectId, schemaName, recordId, body);
    const payload: MsUpdateProjectFirestoreSchemaRecordReqPayload = {
      auth: request[REQUEST_FIELDS.user],
      projectId: projectId,
      schemaName: schemaName,
      id: recordId,
      data: body,
    };
    const response: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.project.firestore.record.patterns.updateRecord,
        payload,
      ),
    );
    this.afterCallMicroservice(response);
    return response.data;
  }

  @Delete(':projectId/schemas/:schemaName/records/:recordId')
  async deleteRecord(
    @Req() request: Request,
    @Param('projectId') projectId: string,
    @Param('schemaName') schemaName: string,
    @Param('recordId') recordId: string,
  ) {
    this.logger.debug('deleteRecord', projectId, schemaName, recordId);
    const payload: MsDeleteProjectFirestoreSchemaRecordReqPayload = {
      auth: request[REQUEST_FIELDS.user],
      projectId: projectId,
      schemaName: schemaName,
      id: recordId,
    };
    const response: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.project.firestore.record.patterns.deleteRecord,
        payload,
      ),
    );
    this.afterCallMicroservice(response);
    return response.data;
  }
}
