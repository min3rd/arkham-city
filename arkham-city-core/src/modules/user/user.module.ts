import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.type';
import { databaseConfig } from 'src/config/database.config';
import { HashService } from 'src/core/hash/hash.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.auth.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      databaseConfig.MONGO_DB_USER,
    ),
  ],
  providers: [UserService, HashService],
  exports: [UserService],
})
export class UserModule {}
