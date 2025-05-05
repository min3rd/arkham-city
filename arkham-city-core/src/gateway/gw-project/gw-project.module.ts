import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { ModulesModule } from 'src/modules/modules.module';
import { GwProjectController } from './gw-project.controller';
import { GwProjectAppModule } from './gw-project-app/gw-project-app.module';
import { GwProjectFirestoreModule } from './gw-project-firestore/gw-project-firestore.module';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.project.name,
        transport: Transport.RMQ,
        options: {
          urls: [
            (process.env.RABBITMQ_URL as string) ?? 'amqp://localhost:5672',
          ],
          queue: microserviceConfig.project.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ModulesModule,
    GwProjectAppModule,
    GwProjectFirestoreModule,
  ],
  controllers: [GwProjectController],
})
export class GwProjectModule {}
