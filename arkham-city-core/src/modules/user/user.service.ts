import {
  HttpException,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.type';
import { databaseConfig } from 'src/config/database.config';
import { Model } from 'mongoose';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { HashService } from 'src/core/hash/hash.service';
import { microserviceConfig } from 'src/config/microservice.config';
import { RegisterByEmailDto } from '../auth/auth.controller';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name, databaseConfig.MONGO_DB_USER)
    private readonly userModel: Model<User>,
    private readonly hashService: HashService,
    @Inject(microserviceConfig.auth.name) private readonly client: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  @MessagePattern(microserviceConfig.auth.patterns.registerByEmail)
  async register(@Payload() payload: RegisterByEmailDto) {
    if (
      (await this.userModel.countDocuments({ email: payload.email }).exec()) > 0
    ) {
      throw new HttpException('', 400);
    }
    const user = new this.userModel({
      email: payload.email,
      username: payload.email,
      password: this.hashService.hash(payload.password),
    });

    return await user.save();
  }
}
