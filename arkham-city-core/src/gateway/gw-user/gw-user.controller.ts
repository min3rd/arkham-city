import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { microserviceConfig } from 'src/config/microservice.config';
import { REQUEST_FIELDS } from 'src/config/request.config';
import { RequirePermission } from 'src/core/decorators/permissions';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { ServiceResponse } from 'src/core/microservice/microservice.types';
import {
  GwAssignRolesDto,
  GwCreateUserDto,
  GwListUsersDto,
  GwSetUserStatusDto,
  GwUpdateUserDto,
} from './gw-user.interface';

@Controller('users')
export class GwUserController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.user.name)
    private readonly rmqClient: ClientRMQ,
  ) {
    super();
  }

  @Get()
  @RequirePermission('roles:write')
  async list(@Query() query: GwListUsersDto) {
    const res: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.user.patterns.list, query),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get(':id')
  @RequirePermission('roles:write')
  async get(@Param('id') id: string) {
    const res: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.user.patterns.get, {
        userId: id,
      }),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Post()
  @RequirePermission('roles:write')
  async create(@Body() body: GwCreateUserDto, @Req() req: Request) {
    const res: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.user.patterns.create, {
        ...body,
        actorId: (req as any)?.[REQUEST_FIELDS.user]?.sub,
      }),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Put(':id')
  @RequirePermission('roles:write')
  async update(
    @Param('id') id: string,
    @Body() body: GwUpdateUserDto,
    @Req() req: Request,
  ) {
    const res: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.user.patterns.update, {
        ...body,
        userId: id,
        actorId: (req as any)?.[REQUEST_FIELDS.user]?.sub,
      }),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Patch(':id/status')
  @RequirePermission('roles:write')
  async setStatus(
    @Param('id') id: string,
    @Body() body: GwSetUserStatusDto,
    @Req() req: Request,
  ) {
    const res: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.user.patterns.setStatus, {
        ...body,
        userId: id,
        actorId: (req as any)?.[REQUEST_FIELDS.user]?.sub,
      }),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Post(':id/roles')
  @RequirePermission('roles:write')
  async assignRoles(
    @Param('id') id: string,
    @Body() body: GwAssignRolesDto,
    @Req() req: Request,
  ) {
    const res: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.user.patterns.assignRoles, {
        ...body,
        userId: id,
        actorId: (req as any)?.[REQUEST_FIELDS.user]?.sub,
      }),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Delete(':id')
  @RequirePermission('roles:write')
  async delete(@Param('id') id: string) {
    const res: ServiceResponse<any> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.user.patterns.delete, {
        userId: id,
      }),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
