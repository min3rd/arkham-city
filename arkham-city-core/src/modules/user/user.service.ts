import {
  HttpException,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.type';
import { databaseConfig } from 'src/config/database.config';
import { Model } from 'mongoose';
import { HashService } from 'src/core/hash/hash.service';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name, databaseConfig.MONGO_DB_USER)
    private readonly userModel: Model<User>,
    private readonly hashService: HashService,
  ) {}

  async onApplicationBootstrap() {}

  async registerByEmail(email: string, password: string) {
    if ((await this.userModel.countDocuments({ email: email }).exec()) > 0) {
      throw new HttpException('', 400);
    }
    const user = new this.userModel({
      email: email,
      username: email,
      password: this.hashService.hash(password),
    });
    return await user.save();
  }
}
