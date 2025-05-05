import { Module } from '@nestjs/common';
import { MsWebsdkAuthController } from './ms-websdk-auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { WebSDKAuthModule } from 'src/modules/websdk/websdk-auth/websdk-auth.module';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.websdk.auth.name,
        transport: Transport.RMQ,
        options: {
          urls: [
            (process.env.RABBITMQ_URL as string) ?? 'amqp://localhost:5672',
          ],
          queue: microserviceConfig.websdk.auth.name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    WebSDKAuthModule,
  ],
  controllers: [MsWebsdkAuthController],
})
export class MsWebsdkAuthModule {}
