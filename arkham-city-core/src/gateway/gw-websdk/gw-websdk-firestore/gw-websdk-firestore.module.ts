import { Module } from '@nestjs/common';
import { GwWebSDKFirestoreController } from './gw-websdk-firestore.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
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
          queue: 'arkham-city',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [GwWebSDKFirestoreController],
})
export class GwWebSDKFirestoreModule {
}
