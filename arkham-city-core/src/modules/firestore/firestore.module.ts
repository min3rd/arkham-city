import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirestoreService } from './firestore.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FirestoreRuleModule } from './firestore-rule/firestore-rule.module';
import { microserviceConfig } from '@src/config/microservice.config';
import { DatabaseModule } from '@modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.firestore.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: microserviceConfig.firestore.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: microserviceConfig.websdk.firestore.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: microserviceConfig.websdk.firestore.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: microserviceConfig.project.firestore.rule.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: microserviceConfig.project.firestore.rule.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    DatabaseModule,
    FirestoreRuleModule,
  ],
  providers: [FirestoreService],
  exports: [FirestoreService, FirestoreRuleModule],
})
export class FirestoreModule {}
