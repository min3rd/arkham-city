import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from '@src/config/microservice.config';
import { ProjectFirestoreService } from '@modules/project/project-firestore/project-firestore.service';
import {
  MsCreateProjectFirestoreSchemaRecordReqPayload,
  MsDeleteProjectFirestoreSchemaRecordReqPayload,
  MsGetProjectFirestoreSchemaRecordReqPayload,
  MsQueryProjectFirestoreSchemaRecordsReqPayload,
  MsQueryProjectFirestoreSchemaReqPayload,
  MsUpdateProjectFirestoreSchemaRecordReqPayload,
} from './ms-project-firestore.types';

@Controller()
export class MsProjectFirestoreController {
  private readonly logger = new Logger(MsProjectFirestoreController.name);

  constructor(
    private readonly projectFirestoreService: ProjectFirestoreService,
  ) {}

  @MessagePattern(microserviceConfig.project.firestore.schema.patterns.query)
  querySchemas(@Payload() payload: MsQueryProjectFirestoreSchemaReqPayload) {
    this.logger.log('querySchemas', payload);
    return this.projectFirestoreService.querySchemas(
      payload.projectId,
      JSON.parse(payload.query as any),
      payload.page,
      payload.size,
    );
  }

  @MessagePattern(
    microserviceConfig.project.firestore.record.patterns.queryRecord,
  )
  querySchemaRecords(
    @Payload() payload: MsQueryProjectFirestoreSchemaRecordsReqPayload,
  ) {
    this.logger.log('querySchemaRecords', payload);
    return this.projectFirestoreService.querySchemaRecords(
      payload.projectId,
      payload.schemaName,
      JSON.parse(payload.query as any),
      payload.page,
      payload.size,
    );
  }

  @MessagePattern(microserviceConfig.project.firestore.record.patterns.findById)
  findSchemaRecordById(
    @Payload() payload: MsGetProjectFirestoreSchemaRecordReqPayload,
  ) {
    this.logger.log('findSchemaRecordById', payload);
    return this.projectFirestoreService.getSchemaRecordById(
      payload.projectId,
      payload.schemaName,
      payload.id,
    );
  }

  @MessagePattern(
    microserviceConfig.project.firestore.record.patterns.createRecord,
  )
  createRecord(
    @Payload() payload: MsCreateProjectFirestoreSchemaRecordReqPayload,
  ) {
    this.logger.log('createRecord', payload);
    return this.projectFirestoreService.createSchemaRecord(
      payload.projectId,
      payload.schemaName,
      payload.data,
    );
  }

  @MessagePattern(
    microserviceConfig.project.firestore.record.patterns.updateRecord,
  )
  updateRecord(
    @Payload() payload: MsUpdateProjectFirestoreSchemaRecordReqPayload,
  ) {
    this.logger.log('updateRecord', payload);
    return this.projectFirestoreService.updateSchemaRecord(
      payload.projectId,
      payload.schemaName,
      payload.id,
      payload.data,
    );
  }

  @MessagePattern(
    microserviceConfig.project.firestore.record.patterns.deleteRecord,
  )
  deleteRecord(
    @Payload() payload: MsDeleteProjectFirestoreSchemaRecordReqPayload,
  ) {
    this.logger.log('deleteRecord', payload);
    return this.projectFirestoreService.deleteSchemaRecord(
      payload.projectId,
      payload.schemaName,
      payload.id,
    );
  }
}
