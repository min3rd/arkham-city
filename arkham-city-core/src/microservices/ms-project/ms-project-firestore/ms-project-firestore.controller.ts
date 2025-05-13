import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from '../../../config/microservice.config';
import { ProjectFirestoreService } from '../../../modules/project/project-firestore/project-firestore.service';
import { MsQueryProjectFirestoreSchemaReqPayload } from './ms-project-firestore.types';

@Controller()
export class MsProjectFirestoreController {
  constructor(
    private readonly projectFirestoreService: ProjectFirestoreService,
  ) {}

  @MessagePattern(microserviceConfig.project.firestore.schema.patterns.query)
  querySchema(@Payload() payload: MsQueryProjectFirestoreSchemaReqPayload) {
    return this.projectFirestoreService.querySchemas(
      payload.projectId,
      payload.query,
      payload.page,
      payload.size,
    );
  }
}
