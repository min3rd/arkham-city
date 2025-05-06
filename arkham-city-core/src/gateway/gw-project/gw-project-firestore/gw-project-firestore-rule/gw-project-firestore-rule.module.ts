import { Module } from '@nestjs/common';
import { GwProjectFirestoreRuleController } from './gw-project-firestore-rule.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from '../../../../config/microservice.config';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.project.firestore.rule.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: microserviceConfig.project.firestore.rule.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [GwProjectFirestoreRuleController],
})
export class GwProjectFirestoreRuleModule {}
