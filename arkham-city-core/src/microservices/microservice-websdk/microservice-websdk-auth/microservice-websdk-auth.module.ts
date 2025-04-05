import { Module } from '@nestjs/common';
import { MicroserviceWebsdkAuthController } from './microservice-websdk-auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { AuthModule } from 'src/modules/websdk/auth/auth.module';

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
    AuthModule,
  ],
  controllers: [MicroserviceWebsdkAuthController],
})
export class MicroserviceWebsdkAuthModule {}
