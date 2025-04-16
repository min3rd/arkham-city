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

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User.name, 'metadata')
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    let user = new this.userModel({
      email: email,
      username: email,
      firstName: firstName,
      lastName: lastName,
      password: HashService.hash(password),
    });
    user = await user.save();
    this.logger.log('registerByEmailAndPassword:end');
    return new GoodResponse<User>(user.toJSON());
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
      return new BadResponse(
        Errors.PASSWORD_IS_INCORRECT,
      );
    }
    const refreshToken = await this.jwtService.signAsync(
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
    user.refreshToken = refreshToken;
    user = await user.save();
    this.logger.log(`findOneByEmailAndPassword:end`);
    return new GoodResponse({
      ...user.toJSON(),
      password: undefined, // ignore password
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = await this.jwtService.verifyAsync(refreshToken);
    if (!payload) {
      return new BadResponse(
        Errors.INCORRECT_REFRESH_TOKEN,
      );
    }
    this.logger.log(`findOneByRefreshToken:end`);
    return new GoodResponse({
      ...user.toJSON(),
      password: undefined, // ignore return password
    });
  }
}
