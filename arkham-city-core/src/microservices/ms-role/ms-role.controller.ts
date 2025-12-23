import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { UpdateRoleDto, UpsertRoleDto } from 'src/modules/role/role.interface';
import { RoleService } from 'src/modules/role/role.service';

@Controller()
export class MsRoleController {
  constructor(private readonly roleService: RoleService) {}

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
}
