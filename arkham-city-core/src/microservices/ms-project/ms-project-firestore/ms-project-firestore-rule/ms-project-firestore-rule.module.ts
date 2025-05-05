import { Module } from '@nestjs/common';
import { MsProjectFirestoreRuleController } from './ms-project-firestore-rule.controller';
import { ConfigModule } from '@nestjs/config';
import { ModulesModule } from '../../../../modules/modules.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from '../../../../config/microservice.config';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ModulesModule,
    ClientsModule.register([
      {
        name: microserviceConfig.project.firestore.rule.name,
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
  ],
  controllers: [MsProjectFirestoreRuleController],
})
export class MsProjectFirestoreRuleModule {
}
