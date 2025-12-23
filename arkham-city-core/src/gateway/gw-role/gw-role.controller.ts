import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { microserviceConfig } from 'src/config/microservice.config';
import { REQUEST_FIELDS } from 'src/config/request.config';
import {
  RequirePermission,
  RequirePermissionScopable,
} from 'src/core/decorators/permissions';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { ServiceResponse } from 'src/core/microservice/microservice.types';
import { PermissionEvaluation } from 'src/modules/role/role-assignment.service';
import { RoleAssignment } from 'src/modules/role/role-assignment.type';
import { UpdateRoleDto, UpsertRoleDto } from 'src/modules/role/role.interface';
import { Role } from 'src/modules/role/role.type';
import {
  GwCreateRoleAssignmentDto,
  GwListRoleAssignmentDto,
  GwUpdateRoleAssignmentDto,
} from './gw-role-assignment.interface';
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
  @RequirePermission('roles:write')
  async list(): Promise<Role[] | undefined> {
    const res: ServiceResponse<Role[]> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.role.patterns.list, {}),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Post()
  @RequirePermission('roles:write')
  async create(@Body() body: GwUpsertRoleDto): Promise<Role | undefined> {
    const payload: UpsertRoleDto = body;
    const res: ServiceResponse<Role> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.role.patterns.create, payload),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Put(':id')
  @RequirePermission('roles:write')
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
  @RequirePermission('roles:write')
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

  @Get('assignments')
  @RequirePermission('roles:write')
  async listAssignments(
    @Query() query: GwListRoleAssignmentDto,
  ): Promise<RoleAssignment[] | undefined> {
    const res: ServiceResponse<RoleAssignment[]> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.role.patterns.listAssignments,
        query,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Post('assignments')
  @RequirePermission('roles:write')
  async createAssignment(
    @Body() body: GwCreateRoleAssignmentDto,
  ): Promise<RoleAssignment | undefined> {
    const res: ServiceResponse<RoleAssignment> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.role.patterns.createAssignment,
        body,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Put('assignments/:id')
  @RequirePermission('roles:write')
  async updateAssignment(
    @Param('id') id: string,
    @Body() body: GwUpdateRoleAssignmentDto,
  ): Promise<RoleAssignment | undefined> {
    const payload: GwUpdateRoleAssignmentDto & { assignmentId: string } = {
      ...body,
      assignmentId: id,
    };
    const res: ServiceResponse<RoleAssignment> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.role.patterns.updateAssignment,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Delete('assignments/:id')
  @RequirePermission('roles:write')
  async deleteAssignment(
    @Param('id') id: string,
  ): Promise<boolean | undefined> {
    const res: ServiceResponse<boolean> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.role.patterns.deleteAssignment, {
        assignmentId: id,
      }),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }

  @Get('effective')
  @RequirePermission('roles:write')
  @RequirePermissionScopable('project:read', 'projectId')
  async effectivePermissions(
    @Req() req: Request,
    @Query('userId') userId?: string,
    @Query('projectId') projectId?: string,
    @Query('resourceId') resourceId?: string,
  ): Promise<PermissionEvaluation | undefined> {
    const resolvedUser = userId ?? (req as any)?.[REQUEST_FIELDS.user]?.sub;
    const res: ServiceResponse<PermissionEvaluation> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.role.patterns.effectivePermissions,
        {
          userId: resolvedUser,
          projectId,
          resourceId,
        },
      ),
    );
    this.afterCallMicroservice(res);
    return res.data;
  }
}
