import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModulesModule } from 'src/modules/modules.module';
import { MsProjectAppModule } from './ms-project-app/ms-project-app.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { MsProjectController } from './ms-project.controller';
import { MsProjectFirestoreModule } from './ms-project-firestore/ms-project-firestore.module';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.project.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: microserviceConfig.project.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ModulesModule,
    MsProjectAppModule,
    MsProjectFirestoreModule,
  ],
  controllers: [MsProjectController],
  exports: [MsProjectAppModule],
})
export class MsProjectModule {}
