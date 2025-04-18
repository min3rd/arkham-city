import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { Request } from 'express';
import { microserviceConfig } from 'src/config/microservice.config';
import { NewProjectReqPayload } from 'src/microservices/ms-project/ms-project.interface';
import { NewProjectDto } from './gw-project.interface';
import { JWTPayload } from 'src/modules/auth/auth.interface';
import { ServiceResponse } from 'src/core/microservice/microservice.types';
import { firstValueFrom } from 'rxjs';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { Project } from 'src/modules/project/project.types';
import { REQUEST_FIELDS } from 'src/config/request.config';

@Controller('projects')
export class GwProjectController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.projects.name)
    private readonly clientProxy: ClientRedis,
  ) {
    super();
  }

  @Post()
  async create(
    @Req() request: Request,
    @Body() body: NewProjectDto,
  ): Promise<Project | undefined> {
    const data: NewProjectReqPayload = {
      user: request[REQUEST_FIELDS.user] as JWTPayload,
      name: body.name,
      description: body?.description as string,
    };
    const res: ServiceResponse<Project> = await firstValueFrom(
      this.clientProxy.send(microserviceConfig.projects.patterns.create, data),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get()
  async all(@Req() request: Request) {
    const res: ServiceResponse<Project[]> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.projects.patterns.all,
        request[REQUEST_FIELDS.user] as JWTPayload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get(':id')
  async get(@Req() request: Request, @Param() params: any) {
    const res: ServiceResponse<Project> = await firstValueFrom(
      this.clientProxy.send(microserviceConfig.projects.patterns.get, {
        user: request[REQUEST_FIELDS.user] as JWTPayload,

        projectId: params.id,
      }),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
