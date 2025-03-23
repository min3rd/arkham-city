import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.type';
import { Model } from 'mongoose';
import { HashService } from 'src/core/hash/hash.service';
import {
  BadMicroserviceResponse,
  MicroserviceErrorCode,
  SuccessMicroserviceResponse,
} from 'src/core/microservice/microservice.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, 'metadata')
    private readonly userModel: Model<User>,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerByEmailAndPassword(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    if ((await this.userModel.countDocuments({ email: email }).exec()) > 0) {
      return new BadMicroserviceResponse(MicroserviceErrorCode.DUPLICATE_EMAIL);
    }
    let user = new this.userModel({
      email: email,
      username: email,
      firstName: firstName,
      lastName: lastName,
      password: this.hashService.hash(password),
    });
    user = await user.save();
    return new SuccessMicroserviceResponse<User>(user.toJSON());
  }

  async findOneByEmailAndPassword(email: string, password: string) {
    let user = await this.userModel.findOne({
      email: email,
    });
    if (!user) {
      return new BadMicroserviceResponse(MicroserviceErrorCode.EMAIL_NOT_FOUND);
    }
    if (!this.hashService.compare(password, user.password)) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.PASSWORD_IS_INCORRECT,
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
    return new SuccessMicroserviceResponse({
      ...user.toJSON(),
      password: undefined, // ignore password
    });
  }

  async findOneByRefreshToken(refreshToken: string) {
    const user = await this.userModel.findOne({
      refreshToken: refreshToken,
    });
    if (!user) {
      return new BadMicroserviceResponse(MicroserviceErrorCode.USER_NOT_FOUND);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = await this.jwtService.verifyAsync(refreshToken);
    if (!payload) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.INCORRECT_REFRESH_TOKEN,
      );
    }
    return new SuccessMicroserviceResponse({
      ...user.toJSON(),
      password: undefined, // ignore return password
    });
  }
}
