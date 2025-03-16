import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from 'src/gateway/user/user.module';
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
    UserModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class MicroservicesModule {}
