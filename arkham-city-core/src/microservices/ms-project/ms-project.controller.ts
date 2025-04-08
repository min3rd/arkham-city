import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { ProjectService } from 'src/modules/project/project.service';
import {
  GetProjectByIdReqPayload,
  NewProjectReqPayload,
} from './ms-project.interface';
import { JWTPayload } from 'src/modules/auth/auth.interface';

@Controller()
export class MsProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern(microserviceConfig.projects.patterns.create)
  create(@Payload() payload: NewProjectReqPayload) {
    return this.projectService.create(
      payload.user,
      payload.name,
      payload.description,
    );
  }

  @MessagePattern(microserviceConfig.projects.patterns.all)
  all(@Payload() payload: JWTPayload) {
    return this.projectService.all(payload);
  }

  @MessagePattern(microserviceConfig.projects.patterns.get)
  get(@Payload() payload: GetProjectByIdReqPayload) {
    return this.projectService.findById(payload.user, payload.projectId);
  }
}
