import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.type';
import { Model } from 'mongoose';
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
import { aggregatePermissions } from './user.permissions';

const ROLE_MANAGE_PERMISSION = 'roles:write';

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
    if ((await this.userModel.countDocuments({ email: email }).exec()) > 0) {
      return new BadResponse(Errors.DUPLICATE_EMAIL);
    }
    const defaultRoles = await this.roleService.findDefaults();
    const defaultPermissions = this.bootstrapPermissions(defaultRoles.length);
    let user = new this.userModel({
      email: email,
      username: email,
      firstName: firstName,
      lastName: lastName,
      password: HashService.hash(password),
      roles: defaultRoles.map((role) => role._id),
      permissions: defaultPermissions,
    });
    user = await user.save();
    const roleDocuments = defaultRoles;
    const userJson = user.toJSON() as User;
    this.logger.log('registerByEmailAndPassword:end');
    return new GoodResponse<User>({
      ...userJson,
      roles: roleDocuments,
      permissions: aggregatePermissions({
        ...userJson,
        roles: roleDocuments,
      }),
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
    return new GoodResponse({
      ...user.toJSON(),
      password: undefined, // ignore password
      permissions: aggregatePermissions(
        user as User & { roles?: (Role | string)[] },
      ),
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
    this.logger.log(`findOneByRefreshToken:end`);
    return new GoodResponse({
      ...user.toJSON(),
      password: undefined, // ignore return password
      permissions: aggregatePermissions(
        user as User & { roles?: (Role | string)[] },
      ),
    });
  }

  async findByIdWithRoles(userId: string) {
    const user = await this.userModel.findById(userId).populate('roles');
    if (!user) {
      return undefined;
    }
    return {
      ...user.toJSON(),
      password: undefined,
      permissions: aggregatePermissions(
        user as User & { roles?: (Role | string)[] },
      ),
    } as User & { roles?: Role[] };
  }

  private bootstrapPermissions(defaultRoleCount: number): string[] | undefined {
    if (defaultRoleCount === 0) {
      return [ROLE_MANAGE_PERMISSION];
    }
    return undefined;
  }
}
