import { Module } from '@nestjs/common';
import { FirestoreRuleService } from './firestore-rule.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from '../../../config/microservice.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ClientsModule.register([
      {
        name: microserviceConfig.firestore.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
  ],
  providers: [FirestoreRuleService],
  exports: [FirestoreRuleService],
})
export class FirestoreRuleModule {}
