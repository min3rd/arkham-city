import { Module } from '@nestjs/common';
import { MsProjectAppController } from './ms-project-app.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { ModulesModule } from 'src/modules/modules.module';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.project.app.name,
        transport: Transport.RMQ,
        options: {
          urls: [
            (process.env.RABBITMQ_URL as string) ?? 'amqp://localhost:5672',
          ],
          queue: microserviceConfig.project.app.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ModulesModule,
  ],
  controllers: [MsProjectAppController],
})
export class MsProjectAppModule {}
