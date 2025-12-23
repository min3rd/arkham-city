import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { Model, Types } from 'mongoose';
import {
  BadResponse,
  Errors,
  GoodResponse,
  ServiceResponse,
} from 'src/core/microservice/microservice.types';
import { User } from '../user/user.type';
import { Role } from './role.type';
import {
  CreateRoleAssignmentDto,
  ListRoleAssignmentDto,
  UpdateRoleAssignmentDto,
} from './role-assignment.interface';
import {
  RoleAssignment,
  RoleAssignmentScope,
} from './role-assignment.type';

const DUPLICATE_KEY_ERROR_CODE = 11000;
const PROJECT_SCOPE_PREFIX = 'project:';
const RESOURCE_SCOPE_PREFIX = 'resource:';
const ROLE_ASSIGNMENT_SCOPES: RoleAssignmentScope[] = [
  'global',
  'project',
  'resource',
];

export interface PermissionEvaluation {
  system: string[];
  project: string[];
  resource: string[];
  effective: string[];
}

const EMPTY_PERMISSION_EVALUATION: PermissionEvaluation = {
  system: [],
  project: [],
  resource: [],
  effective: [],
};

@Injectable()
export class RoleAssignmentService {
  constructor(
    @InjectModel(RoleAssignment.name, 'metadata')
    private readonly roleAssignmentModel: Model<RoleAssignment>,
    @InjectModel(Role.name, 'metadata')
    private readonly roleModel: Model<Role>,
    @InjectModel(User.name, 'metadata')
    private readonly userModel: Model<User>,
  ) {}

  async create(
    payload: CreateRoleAssignmentDto,
  ): Promise<ServiceResponse<RoleAssignment>> {
    const scopeValidation = this.validateScopePayload(
      payload.scope,
      payload.projectId,
      payload.resourceId,
    );
    if (scopeValidation) {
      return scopeValidation;
    }
    const role = await this.roleModel.findById(payload.roleId);
    if (!role) {
      return new BadResponse(Errors.ROLE_NOT_FOUND);
    }
    const userExists = await this.userModel.exists({ _id: payload.userId });
    if (!userExists) {
      return new BadResponse(Errors.USER_NOT_FOUND);
    }
    try {
      const assignment = await this.roleAssignmentModel.create({
        user: payload.userId,
        role: payload.roleId,
        scope: payload.scope,
        projectId: payload.projectId,
        resourceId: payload.resourceId,
      });
      await assignment.populate('role');
      return new GoodResponse<RoleAssignment>(assignment.toJSON());
    } catch (error) {
      if (
        error instanceof MongoServerError &&
        error.code === DUPLICATE_KEY_ERROR_CODE
      ) {
        return new BadResponse(Errors.ROLE_ASSIGNMENT_ALREADY_EXISTS);
      }
      throw error;
    }
  }

  async update(
    assignmentId: string,
    payload: UpdateRoleAssignmentDto,
  ): Promise<ServiceResponse<RoleAssignment>> {
    const assignment = await this.roleAssignmentModel.findById(assignmentId);
    if (!assignment) {
      return new BadResponse(Errors.ROLE_ASSIGNMENT_NOT_FOUND);
    }
    const nextScope = payload.scope ?? assignment.scope;
    const scopeValidation = this.validateScopePayload(
      nextScope,
      payload.projectId ?? assignment.projectId,
      payload.resourceId ?? assignment.resourceId,
    );
    if (scopeValidation) {
      return scopeValidation;
    }
    if (payload.roleId) {
      const role = await this.roleModel.findById(payload.roleId);
      if (!role) {
        return new BadResponse(Errors.ROLE_NOT_FOUND);
      }
      assignment.role = payload.roleId as any;
    }
    if (payload.userId) {
      const userExists = await this.userModel.exists({ _id: payload.userId });
      if (!userExists) {
        return new BadResponse(Errors.USER_NOT_FOUND);
      }
      assignment.user = payload.userId as any;
    }
    if (payload.scope) {
      assignment.scope = payload.scope;
    }
    if (payload.projectId !== undefined) {
      assignment.projectId = payload.projectId;
    }
    if (payload.resourceId !== undefined) {
      assignment.resourceId = payload.resourceId;
    }
    try {
      const saved = await assignment.save();
      await saved.populate('role');
      return new GoodResponse<RoleAssignment>(saved.toJSON());
    } catch (error) {
      if (
        error instanceof MongoServerError &&
        error.code === DUPLICATE_KEY_ERROR_CODE
      ) {
        return new BadResponse(Errors.ROLE_ASSIGNMENT_ALREADY_EXISTS);
      }
      throw error;
    }
  }

  async delete(assignmentId: string): Promise<ServiceResponse<boolean>> {
    const result = await this.roleAssignmentModel.findByIdAndDelete(
      assignmentId,
    );
    if (!result) {
      return new BadResponse(Errors.ROLE_ASSIGNMENT_NOT_FOUND);
    }
    return new GoodResponse<boolean>(true);
  }

  async list(
    filter: ListRoleAssignmentDto,
  ): Promise<ServiceResponse<RoleAssignment[]>> {
    const query: any = {};
    if (filter.userId) {
      query.user = filter.userId;
    }
    if (filter.roleId) {
      query.role = filter.roleId;
    }
    if (filter.scope) {
      query.scope = filter.scope;
    }
    if (filter.projectId) {
      query.projectId = filter.projectId;
    }
    if (filter.resourceId) {
      query.resourceId = filter.resourceId;
    }
    const assignments = await this.roleAssignmentModel
      .find(query)
      .populate('role');
    return new GoodResponse<RoleAssignment[]>(
      assignments.map((assignment) => assignment.toJSON()),
    );
  }

  async resolvePermissionScopes(
    userId: string | undefined,
    options?: {
      projectId?: string;
      resourceId?: string;
      baseUser?: User & { roles?: (Role | string)[] };
    },
  ): Promise<PermissionEvaluation> {
    if (!userId) {
      return { ...EMPTY_PERMISSION_EVALUATION };
    }
    const baseUser =
      options?.baseUser ??
      (await this.userModel.findById(userId).populate('roles'));
    if (!baseUser) {
      return { ...EMPTY_PERMISSION_EVALUATION };
    }
    const system = new Set<string>();
    const project = new Set<string>();
    const resource = new Set<string>();
    (baseUser.permissions ?? []).forEach((permission) =>
      this.appendPermissionWithClassification(
        permission,
        system,
        project,
        resource,
      ),
    );
    await this.appendRolesPermissions(
      baseUser.roles as (Role | string)[] | undefined,
      system,
      project,
      resource,
    );
    const assignments = await this.roleAssignmentModel
      .find({
        user: userId,
        scope: { $in: ROLE_ASSIGNMENT_SCOPES },
      })
      .populate('role');
    assignments.forEach((assignment) => {
      if (!this.isRoleDocument(assignment.role)) {
        return;
      }
      const role = assignment.role;
      if (assignment.scope === 'global') {
        this.appendRolePermissionsWithClassification(
          role,
          system,
          project,
          resource,
        );
      } else if (
        assignment.scope === 'project' &&
        options?.projectId &&
        assignment.projectId === options.projectId
      ) {
        this.appendRolePermissions(role, project);
      } else if (
        assignment.scope === 'resource' &&
        options?.resourceId &&
        assignment.resourceId === options.resourceId
      ) {
        this.appendRolePermissions(role, resource);
      }
    });
    const effective = new Set<string>(system);
    project.forEach((permission) => effective.add(permission));
    resource.forEach((permission) => effective.add(permission));
    return {
      system: [...system],
      project: [...project],
      resource: [...resource],
      effective: [...effective],
    };
  }

  async getPermissionScopes(
    userId: string | undefined,
    options?: { projectId?: string; resourceId?: string },
  ): Promise<ServiceResponse<PermissionEvaluation>> {
    if (!userId) {
      return new BadResponse(Errors.USER_NOT_FOUND);
    }
    const baseUser = await this.userModel.findById(userId).populate('roles');
    if (!baseUser) {
      return new BadResponse(Errors.USER_NOT_FOUND);
    }
    const scopes = await this.resolvePermissionScopes(userId, {
      ...options,
      baseUser: baseUser as User & { roles?: (Role | string)[] },
    });
    return new GoodResponse<PermissionEvaluation>(scopes);
  }

  private validateScopePayload(
    scope: RoleAssignmentScope,
    projectId?: string,
    resourceId?: string,
  ): ServiceResponse<any> | undefined {
    if (scope === 'project' && !projectId) {
      return new BadResponse(Errors.ROLE_ASSIGNMENT_PROJECT_REQUIRED);
    }
    if (scope === 'resource' && !resourceId) {
      return new BadResponse(Errors.ROLE_ASSIGNMENT_RESOURCE_REQUIRED);
    }
    return undefined;
  }

  private async appendRolesPermissions(
    roles: (Role | string)[] | undefined,
    system: Set<string>,
    project: Set<string>,
    resource: Set<string>,
  ) {
    if (!roles) {
      return;
    }
    const roleDocuments: Role[] = [];
    const roleIds: string[] = [];
    roles.forEach((role) => {
      if (typeof role === 'string') {
        roleIds.push(role);
      } else {
        roleDocuments.push(role);
      }
    });
    if (roleIds.length > 0) {
      const docs = await this.roleModel.find({
        _id: { $in: roleIds },
      });
      roleDocuments.push(...docs);
    }
    roleDocuments.forEach((role) =>
      this.appendRolePermissionsWithClassification(
        role,
        system,
        project,
        resource,
      ),
    );
  }

  private appendRolePermissions(role: Role, target: Set<string>) {
    (role.permissions ?? []).forEach((permission) => target.add(permission));
  }

  private appendRolePermissionsWithClassification(
    role: Role,
    system: Set<string>,
    project: Set<string>,
    resource: Set<string>,
  ) {
    (role.permissions ?? []).forEach((permission) =>
      this.appendPermissionWithClassification(
        permission,
        system,
        project,
        resource,
      ),
    );
  }

  private appendPermissionWithClassification(
    permission: string,
    system: Set<string>,
    project: Set<string>,
    resource: Set<string>,
  ) {
    if (permission.startsWith(RESOURCE_SCOPE_PREFIX)) {
      resource.add(permission);
      return;
    }
    if (permission.startsWith(PROJECT_SCOPE_PREFIX)) {
      project.add(permission);
      return;
    }
    system.add(permission);
  }

  private isRoleDocument(
    role: Role | string | Types.ObjectId | undefined,
  ): role is Role {
    return (
      !!role && typeof role !== 'string' && !(role instanceof Types.ObjectId)
    );
  }
}
