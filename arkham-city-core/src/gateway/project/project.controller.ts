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
import { NewProjectReqPayload } from 'src/microservices/project/project.type';
import { NewProjectDto } from './project.type';
import { JWTPayload } from 'src/modules/auth/auth.type';
import { MicroserviceResponse } from 'src/core/microservice/microservice.type';
import { firstValueFrom } from 'rxjs';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { Project } from 'src/modules/project/project.type';

@Controller('projects')
export class ProjectController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.projects.name)
    private readonly clientProxy: ClientRedis,
  ) {
    super();
  }

  @Post('new-project')
  async create(
    @Req() request: Request,
    @Body() body: NewProjectDto,
  ): Promise<Project | undefined> {
    const data: NewProjectReqPayload = {
      user: request['user'] as JWTPayload,
      name: body.name,
      description: body?.description as string,
    };
    const res: MicroserviceResponse<Project> = await firstValueFrom(
      this.clientProxy.send(microserviceConfig.projects.patterns.create, data),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get()
  async all(@Req() request: Request) {
    const res: MicroserviceResponse<Project[]> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.projects.patterns.all,
        request['user'] as JWTPayload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get(':id')
  async get(@Req() request: Request, @Param() params: any) {
    const res: MicroserviceResponse<Project> = await firstValueFrom(
      this.clientProxy.send(microserviceConfig.projects.patterns.get, {
        user: request['user'] as JWTPayload,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        projectId: params.id,
      }),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
