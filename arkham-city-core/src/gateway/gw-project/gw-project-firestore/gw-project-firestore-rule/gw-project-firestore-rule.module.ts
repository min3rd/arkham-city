import { Module } from '@nestjs/common';
import { GwProjectFirestoreRuleController } from './gw-project-firestore-rule.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from '../../../../config/microservice.config';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.project.firestore.rule.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
  ],
  controllers: [GwProjectFirestoreRuleController],
})
export class GwProjectFirestoreRuleModule {}
