import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import {
  CreateRoleAssignmentDto,
  ListRoleAssignmentDto,
  UpdateRoleAssignmentDto,
} from 'src/modules/role/role-assignment.interface';
import { RoleAssignmentService } from 'src/modules/role/role-assignment.service';
import { UpdateRoleDto, UpsertRoleDto } from 'src/modules/role/role.interface';
import { RoleService } from 'src/modules/role/role.service';

@Controller()
export class MsRoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly roleAssignmentService: RoleAssignmentService,
  ) {}

  @MessagePattern(microserviceConfig.role.patterns.create)
  create(@Payload() payload: UpsertRoleDto) {
    return this.roleService.create(payload);
  }

  @MessagePattern(microserviceConfig.role.patterns.update)
  update(@Payload() payload: UpdateRoleDto & { roleId: string }) {
    return this.roleService.update(payload.roleId, payload);
  }

  @MessagePattern(microserviceConfig.role.patterns.list)
  list() {
    return this.roleService.findAll();
  }

  @MessagePattern(microserviceConfig.role.patterns.delete)
  delete(@Payload() payload: { roleId: string }) {
    return this.roleService.delete(payload.roleId);
  }

  @MessagePattern(microserviceConfig.role.patterns.createAssignment)
  createAssignment(@Payload() payload: CreateRoleAssignmentDto) {
    return this.roleAssignmentService.create(payload);
  }

  @MessagePattern(microserviceConfig.role.patterns.updateAssignment)
  updateAssignment(
    @Payload() payload: UpdateRoleAssignmentDto & { assignmentId: string },
  ) {
    return this.roleAssignmentService.update(payload.assignmentId, payload);
  }

  @MessagePattern(microserviceConfig.role.patterns.listAssignments)
  listAssignments(@Payload() payload: ListRoleAssignmentDto) {
    return this.roleAssignmentService.list(payload);
  }

  @MessagePattern(microserviceConfig.role.patterns.deleteAssignment)
  deleteAssignment(@Payload() payload: { assignmentId: string }) {
    return this.roleAssignmentService.delete(payload.assignmentId);
  }

  @MessagePattern(microserviceConfig.role.patterns.effectivePermissions)
  effectivePermissions(
    @Payload()
    payload: {
      userId?: string;
      projectId?: string;
      resourceId?: string;
    },
  ) {
    return this.roleAssignmentService.getPermissionScopes(payload.userId, {
      projectId: payload.projectId,
      resourceId: payload.resourceId,
    });
  }
}
