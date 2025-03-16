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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, 'metadata')
    private readonly userModel: Model<User>,
    private readonly hashService: HashService,
  ) {}

  async registerByEmailAndPassword(email: string, password: string) {
    if ((await this.userModel.countDocuments({ email: email }).exec()) > 0) {
      return new BadMicroserviceResponse(MicroserviceErrorCode.DUPLICATE_EMAIL);
    }
    let user = new this.userModel({
      email: email,
      username: email,
      password: this.hashService.hash(password),
    });
    user = await user.save();
    return new SuccessMicroserviceResponse<User>(user);
  }

  async findOneByEmailAndPassword(email: string, password: string) {
    const user = await this.userModel.findOne({
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
    return user;
  }
}
