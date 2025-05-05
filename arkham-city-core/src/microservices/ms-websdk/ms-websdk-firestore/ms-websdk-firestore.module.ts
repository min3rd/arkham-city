import { Module } from '@nestjs/common';
import { MsWebsdkFirestoreController } from './ms-websdk-firestore.controller';
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
        name: microserviceConfig.websdk.firestore.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: microserviceConfig.websdk.firestore.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ModulesModule,
  ],
  providers: [],
  controllers: [MsWebsdkFirestoreController],
})
export class MsWebsdkFirestoreModule {}
