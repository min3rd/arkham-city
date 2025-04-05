import { Module } from '@nestjs/common';
import { MsWebsdkAuthController } from './ms-websdk-auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { WebSDKAuthModule } from 'src/modules/websdk/websdk-auth/websdk-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.websdk.auth.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
    WebSDKAuthModule,
  ],
  controllers: [MsWebsdkAuthController],
})
export class MsWebsdkAuthModule {}
