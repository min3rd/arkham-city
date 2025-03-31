import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { ClientRedis } from "@nestjs/microservices";
import { microserviceConfig } from "src/config/microservice.config";
import { CreateProjectAppReqDto, UpdateProjectAppReqDto } from "./app.type";
import { firstValueFrom } from "rxjs";
import {
  AllProjectAppReqPayload,
  CreateProjectAppReqPayload,
  DeleteProjectAppReqPayload,
  GetProjectAppReqPayload,
  UpdateProjectAppReqPayload,
} from "src/microservices/project/app/app.type";
import { GatewayController } from "src/core/gateway/gateway.controller";
import { MicroserviceResponse } from "src/core/microservice/microservice.type";

@Controller("projects")
export class AppController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.projects.apps.name)
    private readonly clientProxy: ClientRedis,
  ) {
    super();
  }

  @Post(":projectId/apps")
  async create(
    @Req() request: Request,
    @Param() params: any,
    @Body() data: CreateProjectAppReqDto,
  ) {
    const payload: CreateProjectAppReqPayload = {
      ...data,
      user: request["user"],
      projectId: params.projectId,
    };
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.projects.apps.patterns.create,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get(":projectId/apps")
  async all(@Req() request: Request, @Param() params: any) {
    const payload: AllProjectAppReqPayload = {
      user: request["user"],
      projectId: params.projectId,
    };
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.projects.apps.patterns.all,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get(":projectId/apps/:appId")
  async get(@Req() request: Request, @Param() params: any) {
    const payload: GetProjectAppReqPayload = {
      user: request["user"],
      projectId: params.projectId,
      appId: params.appId,
    };
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.projects.apps.patterns.get,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Patch(":projectId/apps/:appId")
  async update(
    @Req() request: Request,
    @Param() params: any,
    @Body() data: UpdateProjectAppReqDto,
  ) {
    const payload: UpdateProjectAppReqPayload = {
      ...data,
      user: request["user"],
      projectId: params.projectId,
      appId: params.appId,
    };
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.projects.apps.patterns.update,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Delete(":projectId/apps/:appId")
  async delete(@Req() request: Request, @Param() params: any) {
    const payload: DeleteProjectAppReqPayload = {
      user: request["user"],
      projectId: params.projectId,
      appId: params.appId,
    };
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.projects.apps.patterns.delete,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
