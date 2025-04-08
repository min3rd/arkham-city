import { Module } from '@nestjs/common';
import { MsWebsdkFirestoreController } from './ms-websdk-firestore.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { ModulesModule } from 'src/modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.websdk.firestore.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
    ModulesModule,
  ],
  providers: [],
  controllers: [MsWebsdkFirestoreController],
})
export class MsWebsdkFirestoreModule {}
