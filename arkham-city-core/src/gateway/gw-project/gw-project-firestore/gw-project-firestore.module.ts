import { Module } from '@nestjs/common';
import { GwProjectFirestoreRuleModule } from './gw-project-firestore-rule/gw-project-firestore-rule.module';
import { GwProjectFirestoreController } from './gw-project-firestore.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from '../../../config/microservice.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.project.firestore.schema.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: microserviceConfig.project.firestore.schema.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: microserviceConfig.project.firestore.record.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: microserviceConfig.project.firestore.record.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    GwProjectFirestoreRuleModule,
  ],
  controllers: [GwProjectFirestoreController],
})
export class GwProjectFirestoreModule {}
