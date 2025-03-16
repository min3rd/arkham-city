import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { AuthService } from './auth/auth.service';
import { User, UserSchema } from './user/user.type';
import { databaseConfig } from 'src/config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/user.service';
import { HashService } from 'src/core/hash/hash.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
    ClientsModule.register([
      {
        name: microserviceConfig.auth.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      databaseConfig.MONGO_DB_METADATA,
    ),
  ],
  providers: [AuthService, UserService, HashService],
  exports: [AuthService, UserService],
})
export class ModulesModule {}
