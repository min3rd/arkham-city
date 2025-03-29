import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { ProjectService } from 'src/modules/project/project.service';
import { NewProjectReqPayload } from './project.type';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern(microserviceConfig.project.patterns.create)
  create(@Payload() payload: NewProjectReqPayload) {
    console.log(payload);

    return this.projectService.create(
      payload.user,
      payload.name,
      payload.description,
    );
  }
}
