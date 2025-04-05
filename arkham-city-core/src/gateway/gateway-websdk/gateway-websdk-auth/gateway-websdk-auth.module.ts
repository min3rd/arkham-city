import { Module } from '@nestjs/common';
import { GatewayWebsdkAuthController } from './gateway-websdk-auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';

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
  ],
  controllers: [GatewayWebsdkAuthController],
})
export class GatewayWebsdkAuthModule {}
