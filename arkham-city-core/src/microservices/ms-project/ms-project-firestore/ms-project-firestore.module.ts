import { Module } from '@nestjs/common';
import { MsProjectFirestoreRuleModule } from './ms-project-firestore-rule/ms-project-firestore-rule.module';
import { MsProjectFirestoreController } from './ms-project-firestore.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from '../../../config/microservice.config';
import { ModulesModule } from '../../../modules/modules.module';

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
    ]),
    MsProjectFirestoreRuleModule,
    ModulesModule,
  ],
  controllers: [MsProjectFirestoreController],
})
export class MsProjectFirestoreModule {}
