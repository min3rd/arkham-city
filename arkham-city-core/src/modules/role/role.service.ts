import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadResponse,
  Errors,
  GoodResponse,
  ServiceResponse,
} from 'src/core/microservice/microservice.types';
import { UpdateRoleDto, UpsertRoleDto } from './role.interface';
import { Role } from './role.type';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name, 'metadata')
    private readonly roleModel: Model<Role>,
  ) {}

  async create(payload: UpsertRoleDto): Promise<ServiceResponse<Role>> {
    const existing = await this.roleModel.exists({ name: payload.name });
    if (existing) {
      return new BadResponse(Errors.ROLE_ALREADY_EXISTS);
    }
    const role = await this.roleModel.create({
      ...payload,
      permissions: payload.permissions ?? [],
    });
    return new GoodResponse<Role>(role?.toJSON());
  }

  async update(
    roleId: string,
    payload: UpdateRoleDto,
  ): Promise<ServiceResponse<Role>> {
    if (payload.name) {
      const duplicatedName = await this.roleModel.exists({
        _id: { $ne: roleId },
        name: payload.name,
      });
      if (duplicatedName) {
        return new BadResponse(Errors.ROLE_ALREADY_EXISTS);
      }
    }
    const updatePayload: UpdateRoleDto = { ...payload };
    if (payload.permissions === undefined) {
      delete updatePayload.permissions;
    }
    const role = await this.roleModel.findByIdAndUpdate(
      roleId,
      {
        $set: updatePayload,
      },
      { new: true },
    );
    if (!role) {
      return new BadResponse(Errors.ROLE_NOT_FOUND);
    }
    return new GoodResponse<Role>(role.toJSON());
  }

  async findAll(): Promise<ServiceResponse<Role[]>> {
    const roles = await this.roleModel.find();
    return new GoodResponse<Role[]>(roles.map((role) => role.toJSON()));
  }

  async delete(roleId: string): Promise<ServiceResponse<boolean>> {
    const result = await this.roleModel.findByIdAndDelete(roleId);
    if (!result) {
      return new BadResponse(Errors.ROLE_NOT_FOUND);
    }
    return new GoodResponse<boolean>(true);
  }

  async findDefaults(): Promise<Role[]> {
    const roles = await this.roleModel.find({
      default: true,
    });
    return roles.map((role) => role.toJSON());
  }
}
