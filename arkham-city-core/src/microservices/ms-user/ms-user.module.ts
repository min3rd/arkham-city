import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MsUserController } from './ms-user.controller';
import { ModulesModule } from 'src/modules/modules.module';
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
    ModulesModule,
  ],
  controllers: [MsUserController],
})
export class MsUserModule {}
