import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import {
  AllProjectAppReqPayload,
  CreateProjectAppReqPayload,
  DeleteProjectAppReqPayload,
  GetProjectAppReqPayload,
  GetProjectAppSecretReqPayload,
  UpdateProjectAppReqPayload,
} from './ms-project-app.interface';
import { ProjectAppService } from 'src/modules/project/app/project-app.service';

@Controller()
export class MsProjectAppController {
  constructor(private readonly appService: ProjectAppService) {}

  @MessagePattern(microserviceConfig.project.app.patterns.create)
  create(@Payload() payload: CreateProjectAppReqPayload) {
    return this.appService.create(
      payload.user,
      payload.projectId,
      payload.name,
      payload.type,
      payload.callback,
      payload.description,
    );
  }

  @MessagePattern(microserviceConfig.project.app.patterns.all)
  all(@Payload() payload: AllProjectAppReqPayload) {
    return this.appService.all(payload.user, payload.projectId);
  }

  @MessagePattern(microserviceConfig.project.app.patterns.update)
  update(@Payload() payload: UpdateProjectAppReqPayload) {
    return this.appService.update(
      payload.user,
      payload.projectId,
      payload.appId,
      payload.name,
      payload.type,
      payload.callback,
      payload.description,
    );
  }

  @MessagePattern(microserviceConfig.project.app.patterns.delete)
  delete(@Payload() payload: DeleteProjectAppReqPayload) {
    return this.appService.delete(
      payload.user,
      payload.projectId,
      payload.appId,
    );
  }

  @MessagePattern(microserviceConfig.project.app.patterns.get)
  get(@Payload() payload: GetProjectAppReqPayload) {
    return this.appService.get(payload.user, payload.projectId, payload.appId);
  }

  @MessagePattern(microserviceConfig.project.app.patterns.getSecret)
  getSecret(@Payload() payload: GetProjectAppSecretReqPayload) {
    return this.appService.getSecret(
      payload.user,
      payload.projectId,
      payload.appId,
    );
  }
}
