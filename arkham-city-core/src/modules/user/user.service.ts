import { Injectable, Logger } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.type';
import { ClientSession, Model } from 'mongoose';
import { HashService } from 'src/core/hash/hash.service';
import {
  BadResponse,
  Errors,
  GoodResponse,
  ServiceResponse,
} from 'src/core/microservice/microservice.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../role/role.type';
import { RoleService } from '../role/role.service';
import { RoleAssignmentService } from '../role/role-assignment.service';
import { type PermissionScopes } from './user.permissions';
import { type StringValue } from 'ms';
import {
  AdminCreateUserDto,
  AdminUpdateUserDto,
  AssignRolesDto,
  ListUsersDto,
  SetUserStatusDto,
  UserListResult,
} from './user.interface';

const ROLE_MANAGE_PERMISSION = 'roles:write';
const DUPLICATE_KEY_ERROR_CODE = 11000;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name, 'metadata')
    private readonly userModel: Model<User>,
    @InjectModel(Role.name, 'metadata')
    private readonly roleModel: Model<Role>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
    private readonly roleAssignmentService: RoleAssignmentService,
  ) {}

  async registerByEmailAndPassword(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    this.logger.log(
      `registerByEmailAndPassword:start:email=${email},password=${password},firstName=${firstName},lastName=${lastName}`,
    );
    const defaultRoles = await this.roleService.findDefaults();
    const defaultPermissions = this.bootstrapPermissions(defaultRoles.length);
    let user: User | undefined;
    const session = await this.userModel.startSession();
    const createUser = (superAdmin: boolean, userSession?: ClientSession) => {
      const newUser = new this.userModel({
        email: email,
        username: email,
        firstName: firstName,
        lastName: lastName,
        password: HashService.hash(password),
        roles: defaultRoles.map((role) => role._id),
        permissions: defaultPermissions,
        superAdmin,
      });
      return newUser.save(userSession ? { session: userSession } : undefined);
    };
    try {
      await session.withTransaction(async () => {
        if (await this.userModel.exists({ email }).session(session)) {
          throw new BadResponse(Errors.DUPLICATE_EMAIL);
        }
        const isFirstUser =
          (await this.userModel
            .countDocuments({}, { limit: 1 })
            .session(session)
            .exec()) === 0;
        user = await createUser(isFirstUser, session);
      });
    } catch (error) {
      if (error instanceof BadResponse) {
        return error;
      }
      if (
        error instanceof MongoServerError &&
        error.code === DUPLICATE_KEY_ERROR_CODE &&
        ('superAdmin' in (error.keyPattern ?? {}) ||
          'superAdmin' in (error.keyValue ?? {}))
      ) {
        user = await createUser(false);
      } else {
        throw error;
      }
    } finally {
      await session.endSession();
    }
    if (!user) {
      return new BadResponse(Errors.COULD_NOT_SAVE_THE_RECORD);
    }
    const roleDocuments = defaultRoles;
    const userJson = (user as any).toJSON() as User;
    const permissionScopes =
      await this.roleAssignmentService.resolvePermissionScopes(
        userJson._id as string,
        {
          baseUser: {
            ...(userJson as any),
            roles: roleDocuments as any,
          },
        },
      );
    this.logger.log('registerByEmailAndPassword:end');
    return new GoodResponse<
      User & { roles?: Role[]; permissionScopes: PermissionScopes }
    >({
      ...userJson,
      roles: roleDocuments,
      permissions: permissionScopes.effective,
      permissionScopes,
    });
  }

  async findOneByEmailAndPassword(email: string, password: string) {
    this.logger.log(
      `findOneByEmailAndPassword:start:email=${email},password=${password}`,
    );
    let user = await this.userModel.findOne({
      email: email,
    });
    if (!user) {
      return new BadResponse(Errors.EMAIL_NOT_FOUND);
    }
    if (user.status === 'disabled') {
      return new BadResponse(Errors.USER_DISABLED);
    }
    if (!HashService.compare(password, user.password)) {
      return new BadResponse(Errors.PASSWORD_IS_INCORRECT);
    }
    await user.populate('roles');
    user.refreshToken = await this.jwtService.signAsync(
      {
        sub: user.email,
      },
      {
        secret: this.configService.get('JWT_SECRET') as string,
        expiresIn: (this.configService.get(
          'JWT_REFRESH_TOKEN_EXPIRES_IN',
        ) ?? undefined) as StringValue | undefined,
      },
    );
    user.lastActiveAt = new Date();
    user = await user.save();
    this.logger.log(`findOneByEmailAndPassword:end`);
    const userJson = user.toJSON();
    const permissionScopes =
      await this.roleAssignmentService.resolvePermissionScopes(user._id, {
        baseUser: user as User & { roles?: (Role | string)[] },
      });
    return new GoodResponse({
      ...userJson,
      password: undefined, // ignore password
      permissions: permissionScopes.effective,
      permissionScopes,
    });
  }

  async findOneByRefreshToken(refreshToken: string) {
    this.logger.log(`findOneByRefreshToken:start:refreshToken=${refreshToken}`);
    const user = await this.userModel.findOne({
      refreshToken: refreshToken,
    });
    if (!user) {
      return new BadResponse(Errors.USER_NOT_FOUND);
    }
    if (user.status === 'disabled') {
      return new BadResponse(Errors.USER_DISABLED);
    }
    await user.populate('roles');
    const payload = await this.jwtService.verifyAsync(refreshToken);
    if (!payload) {
      return new BadResponse(Errors.INCORRECT_REFRESH_TOKEN);
    }
    user.lastActiveAt = new Date();
    await user.save();
    const permissionScopes =
      await this.roleAssignmentService.resolvePermissionScopes(user._id, {
        baseUser: user as User & { roles?: (Role | string)[] },
      });
    this.logger.log(`findOneByRefreshToken:end`);
    return new GoodResponse({
      ...user.toJSON(),
      password: undefined, // ignore return password
      permissions: permissionScopes.effective,
      permissionScopes,
    });
  }

  async findByIdWithRoles(userId: string) {
    const user = await this.userModel.findById(userId).populate('roles');
    if (!user) {
      return undefined;
    }
    const permissionScopes =
      await this.roleAssignmentService.resolvePermissionScopes(user._id, {
        baseUser: user as User & { roles?: (Role | string)[] },
      });
    return {
      ...user.toJSON(),
      password: undefined,
      permissions: permissionScopes.effective,
      permissionScopes,
    } as any & { roles?: Role[] };
  }

  async search(options?: { query?: string; limit?: number }) {
    const limit =
      options?.limit && options.limit > 0 ? Math.min(options.limit, 50) : 20;
    const filter: any = {};
    if (options?.query) {
      const regex = new RegExp(options.query, 'i');
      filter.$or = [
        { email: regex },
        { username: regex },
        { firstName: regex },
        { lastName: regex },
      ];
    }
    const users = await this.userModel
      .find(filter)
      .limit(limit)
      .select('_id email username firstName lastName superAdmin status');
    return users.map((user) => user.toJSON());
  }

  async list(
    options?: ListUsersDto,
  ): Promise<ServiceResponse<UserListResult<any>>> {
    const page = options?.page && options.page > 0 ? options.page : 1;
    const limit =
      options?.limit && options.limit > 0 ? Math.min(options.limit, 100) : 20;
    const filter: any = {};
    if (options?.search) {
      const regex = new RegExp(options.search, 'i');
      filter.$or = [
        { email: regex },
        { username: regex },
        { firstName: regex },
        { lastName: regex },
      ];
    }
    if (options?.roles?.length) {
      filter.roles = { $in: options.roles };
    }
    if (options?.status) {
      if (!['active', 'disabled'].includes(options.status)) {
        return new BadResponse(Errors.USER_STATUS_INVALID);
      }
      filter.status = options.status;
    }
    const query = this.userModel
      .find(filter)
      .populate('roles')
      .select(
        '_id email username firstName lastName superAdmin status lastActiveAt createdAt updatedAt roles',
      )
      .skip((page - 1) * limit)
      .limit(limit);
    if (options?.sortBy) {
      query.sort({
        [options.sortBy]: options.sortOrder === 'desc' ? -1 : 1,
      });
    }
    const [users, total] = await Promise.all([
      query.exec(),
      this.userModel.countDocuments(filter),
    ]);
    return new GoodResponse<UserListResult<any>>({
      items: users.map((user) => {
        const raw = user.toJSON();
        delete (raw as any).password;
        return raw;
      }),
      total,
      page,
      limit,
    });
  }

  async get(userId: string) {
    const user = await this.userModel.findById(userId).populate('roles');
    if (!user) {
      return new BadResponse(Errors.USER_NOT_FOUND);
    }
    return this.buildUserResponse(user as any);
  }

  async create(
    payload: AdminCreateUserDto,
  ): Promise<ServiceResponse<any | undefined>> {
    if (await this.userModel.exists({ email: payload.email })) {
      return new BadResponse(Errors.DUPLICATE_EMAIL);
    }
    let roles: Role[] = [];
    if (payload.roles?.length) {
      roles = await this.roleModel.find({ _id: { $in: payload.roles } });
      if (roles.length !== payload.roles.length) {
        return new BadResponse(Errors.ROLE_NOT_FOUND);
      }
    } else {
      roles = await this.roleService.findDefaults();
    }
    const user = await this.userModel.create({
      email: payload.email,
      username: payload.username ?? payload.email,
      password: payload.password ? HashService.hash(payload.password) : null,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phoneNumber: payload.phoneNumber,
      permissions: payload.permissions ?? [],
      roles: roles.map((role) => role._id),
      status: payload.status ?? 'active',
      activated: payload.status ? payload.status === 'active' : undefined,
      metadata: payload.metadata,
      createdBy: payload.actorId,
      updatedBy: payload.actorId,
    });
    await user.populate('roles');
    return this.buildUserResponse(user as any);
  }

  async update(
    userId: string,
    payload: AdminUpdateUserDto,
  ): Promise<ServiceResponse<any | undefined>> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return new BadResponse(Errors.USER_NOT_FOUND);
    }
    if (
      payload.email &&
      payload.email !== user.email &&
      (await this.userModel.exists({ _id: { $ne: userId }, email: payload.email }))
    ) {
      return new BadResponse(Errors.DUPLICATE_EMAIL);
    }
    if (payload.roles !== undefined) {
      const roles = await this.roleModel.find({ _id: { $in: payload.roles } });
      if (roles.length !== payload.roles.length) {
        return new BadResponse(Errors.ROLE_NOT_FOUND);
      }
      user.roles = payload.roles as any;
    }
    if (payload.username !== undefined) {
      user.username = payload.username;
    }
    if (payload.firstName !== undefined) {
      user.firstName = payload.firstName;
    }
    if (payload.lastName !== undefined) {
      user.lastName = payload.lastName;
    }
    if (payload.phoneNumber !== undefined) {
      user.phoneNumber = payload.phoneNumber;
    }
    if (payload.password) {
      user.password = HashService.hash(payload.password);
    }
    if (payload.status) {
      if (!['active', 'disabled'].includes(payload.status)) {
        return new BadResponse(Errors.USER_STATUS_INVALID);
      }
      user.status = payload.status;
      user.activated = payload.status === 'active';
    }
    if (payload.permissions !== undefined) {
      user.permissions = payload.permissions ?? [];
    }
    if (payload.metadata !== undefined) {
      user.metadata = payload.metadata;
    }
    user.updatedBy = payload.actorId ?? user.updatedBy;
    const saved = await user.save();
    await saved.populate('roles');
    return this.buildUserResponse(saved as any);
  }

  async setStatus(
    userId: string,
    payload: SetUserStatusDto,
  ): Promise<ServiceResponse<any | undefined>> {
    return this.update(userId, {
      status: payload.status,
      actorId: payload.actorId,
    });
  }

  async assignRoles(
    userId: string,
    payload: AssignRolesDto,
  ): Promise<ServiceResponse<any | undefined>> {
    return this.update(userId, {
      roles: payload.roles,
      actorId: payload.actorId,
    });
  }

  async delete(userId: string): Promise<ServiceResponse<boolean>> {
    const result = await this.userModel.findByIdAndDelete(userId);
    if (!result) {
      return new BadResponse(Errors.USER_NOT_FOUND);
    }
    return new GoodResponse<boolean>(true);
  }

  private bootstrapPermissions(defaultRoleCount: number): string[] | undefined {
    if (defaultRoleCount === 0) {
      return [ROLE_MANAGE_PERMISSION];
    }
    return undefined;
  }

  private async buildUserResponse(
    user: User & { roles?: (Role | string)[] },
  ): Promise<ServiceResponse<User & { roles?: Role[]; permissionScopes: any }>> {
    const userJson = (user as any).toJSON() as User & { roles?: any[] };
    const permissionScopes =
      await this.roleAssignmentService.resolvePermissionScopes(
        userJson._id as string,
        {
          baseUser: {
            ...(userJson as any),
            roles: userJson.roles as any,
          },
        },
      );
    return new GoodResponse<
      User & { roles?: Role[]; permissionScopes: PermissionScopes }
    >({
      ...userJson,
      password: undefined,
      permissions: permissionScopes.effective,
      permissionScopes,
    } as any);
  }
}
