import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { microserviceConfig } from 'src/config/microservice.config';
import { Permissions } from 'src/core/decorators/permissions';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { ServiceResponse } from 'src/core/microservice/microservice.types';
import { UpdateRoleDto, UpsertRoleDto } from 'src/modules/role/role.interface';
import { Role } from 'src/modules/role/role.type';
import { GwUpsertRoleDto } from './gw-role.interface';

@Controller('roles')
export class GwRoleController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.role.name)
    private readonly rmqClient: ClientRMQ,
  ) {
    super();
  }

  @Get()
  async list(): Promise<Role[] | undefined> {
    const res: ServiceResponse<Role[]> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.role.patterns.list, {}),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Post()
  @Permissions('roles:write')
  async create(@Body() body: GwUpsertRoleDto): Promise<Role | undefined> {
    const payload: UpsertRoleDto = body;
    const res: ServiceResponse<Role> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.role.patterns.create, payload),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Put(':id')
  @Permissions('roles:write')
  async update(
    @Param('id') id: string,
    @Body() body: GwUpsertRoleDto,
  ): Promise<Role | undefined> {
    const payload: UpdateRoleDto & { roleId: string } = {
      ...body,
      roleId: id,
    };
    const res: ServiceResponse<Role> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.role.patterns.update, payload),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Delete(':id')
  @Permissions('roles:write')
  async delete(@Param('id') id: string): Promise<boolean | undefined> {
    const payload = {
      roleId: id,
    };
    const res: ServiceResponse<boolean> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.role.patterns.delete, payload),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
