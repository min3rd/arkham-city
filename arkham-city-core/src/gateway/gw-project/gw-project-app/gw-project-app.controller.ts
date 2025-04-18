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
} from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import {
  CreateProjectAppReqDto,
  UpdateProjectAppReqDto,
} from './gw-project-app.type';
import { firstValueFrom } from 'rxjs';
import {
  AllProjectAppReqPayload,
  CreateProjectAppReqPayload,
  DeleteProjectAppReqPayload,
  GetProjectAppReqPayload,
  GetProjectAppSecretReqPayload,
  UpdateProjectAppReqPayload,
} from 'src/microservices/ms-project/ms-project-app/ms-project-app.interface';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { ServiceResponse } from 'src/core/microservice/microservice.types';
import { REQUEST_FIELDS } from 'src/config/request.config';

@Controller('projects')
export class GwProjectAppController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.project.app.name)
    private readonly clientProxy: ClientRedis,
  ) {
    super();
  }

  @Post(':projectId/apps')
  async create(
    @Req() request: Request,
    @Param() params: any,
    @Body() data: CreateProjectAppReqDto,
  ) {
    const payload: CreateProjectAppReqPayload = {
      ...data,
      user: request[REQUEST_FIELDS.user],
      projectId: params.projectId,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.project.app.patterns.create,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get(':projectId/apps')
  async all(@Req() request: Request, @Param() params: any) {
    const payload: AllProjectAppReqPayload = {
      user: request[REQUEST_FIELDS.user],
      projectId: params.projectId,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.project.app.patterns.all,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get(':projectId/apps/:appId')
  async get(@Req() request: Request, @Param() params: any) {
    const payload: GetProjectAppReqPayload = {
      user: request[REQUEST_FIELDS.user],
      projectId: params.projectId,
      appId: params.appId,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.project.app.patterns.get,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Patch(':projectId/apps/:appId')
  async update(
    @Req() request: Request,
    @Param() params: any,
    @Body() data: UpdateProjectAppReqDto,
  ) {
    const payload: UpdateProjectAppReqPayload = {
      ...data,
      user: request[REQUEST_FIELDS.user],
      projectId: params.projectId,
      appId: params.appId,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.project.app.patterns.update,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Delete(':projectId/apps/:appId')
  async delete(@Req() request: Request, @Param() params: any) {
    const payload: DeleteProjectAppReqPayload = {
      user: request[REQUEST_FIELDS.user],
      projectId: params.projectId,
      appId: params.appId,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.project.app.patterns.delete,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get(':projectId/apps/:appId/secret')
  async getSecret(@Req() request: Request, @Param() params: any) {
    const payload: GetProjectAppSecretReqPayload = {
      user: request[REQUEST_FIELDS.user],
      projectId: params.projectId,
      appId: params.appId,
    };
    const res: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.project.app.patterns.getSecret,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
