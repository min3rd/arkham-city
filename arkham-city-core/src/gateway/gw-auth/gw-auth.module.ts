import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModulesModule } from 'src/modules/modules.module';
import { GwAuthController } from './gw-auth.controller';
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
          queue: microserviceConfig.auth.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ModulesModule,
  ],
  controllers: [GwAuthController],
})
export class GwAuthModule {}
