import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MsUserController } from './ms-user.controller';
import { ModulesModule } from 'src/modules/modules.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.auth.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: 'arkham-city',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ModulesModule,
  ],
  controllers: [MsUserController],
})
export class MsUserModule {
}
