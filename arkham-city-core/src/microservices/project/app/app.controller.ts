import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { microserviceConfig } from "src/config/microservice.config";
import {
  AllProjectAppReqPayload,
  CreateProjectAppReqPayload,
  DeleteProjectAppReqPayload,
  GetProjectAppReqPayload,
  UpdateProjectAppReqPayload,
} from "./app.type";
import { AppService } from "src/modules/project/app/app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern(microserviceConfig.projects.apps.patterns.create)
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

  @MessagePattern(microserviceConfig.projects.apps.patterns.all)
  all(@Payload() payload: AllProjectAppReqPayload) {
    return this.appService.all(payload.user, payload.projectId);
  }

  @MessagePattern(microserviceConfig.projects.apps.patterns.update)
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

  @MessagePattern(microserviceConfig.projects.apps.patterns.delete)
  delete(@Payload() payload: DeleteProjectAppReqPayload) {
    return this.appService.delete(
      payload.user,
      payload.projectId,
      payload.appId,
    );
  }

  @MessagePattern(microserviceConfig.projects.apps.patterns.get)
  get(@Payload() payload: GetProjectAppReqPayload) {
    return this.appService.get(payload.user, payload.projectId, payload.appId);
  }
}
