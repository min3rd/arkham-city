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
} from 'src/core/microservice/microservice.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../role/role.type';
import { RoleService } from '../role/role.service';
import {
  aggregatePermissionScopes,
  aggregatePermissions,
  type PermissionScopes,
} from './user.permissions';

const ROLE_MANAGE_PERMISSION = 'roles:write';
const DUPLICATE_KEY_ERROR_CODE = 11000;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name, 'metadata')
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
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
    const userJson = user.toJSON() as User;
    const permissionScopes = aggregatePermissionScopes({
      ...userJson,
      roles: roleDocuments,
    });
    this.logger.log('registerByEmailAndPassword:end');
    return new GoodResponse<
      User & { roles?: Role[]; permissionScopes: PermissionScopes }
    >({
      ...userJson,
      roles: roleDocuments,
      permissions: [...permissionScopes.system, ...permissionScopes.project],
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
        expiresIn: this.configService.get(
          'JWT_REFRESH_TOKEN_EXPIRES_IN',
        ) as string,
      },
    );
    user = await user.save();
    this.logger.log(`findOneByEmailAndPassword:end`);
    const userJson = user.toJSON();
    const permissionScopes = aggregatePermissionScopes(
      user as User & { roles?: (Role | string)[] },
    );
    return new GoodResponse({
      ...userJson,
      password: undefined, // ignore password
      permissions: [...permissionScopes.system, ...permissionScopes.project],
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
    await user.populate('roles');
    const payload = await this.jwtService.verifyAsync(refreshToken);
    if (!payload) {
      return new BadResponse(Errors.INCORRECT_REFRESH_TOKEN);
    }
    const permissionScopes = aggregatePermissionScopes(
      user as User & { roles?: (Role | string)[] },
    );
    this.logger.log(`findOneByRefreshToken:end`);
    return new GoodResponse({
      ...user.toJSON(),
      password: undefined, // ignore return password
      permissions: [...permissionScopes.system, ...permissionScopes.project],
      permissionScopes,
    });
  }

  async findByIdWithRoles(userId: string) {
    const user = await this.userModel.findById(userId).populate('roles');
    if (!user) {
      return undefined;
    }
    const permissionScopes = aggregatePermissionScopes(
      user as User & { roles?: (Role | string)[] },
    );
    return {
      ...user.toJSON(),
      password: undefined,
      permissions: [...permissionScopes.system, ...permissionScopes.project],
      permissionScopes,
    } as User & { roles?: Role[] };
  }

  private bootstrapPermissions(defaultRoleCount: number): string[] | undefined {
    if (defaultRoleCount === 0) {
      return [ROLE_MANAGE_PERMISSION];
    }
    return undefined;
  }
}
