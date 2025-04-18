import { Module } from '@nestjs/common';
import { MsProjectFirestoreRuleController } from './ms-project-firestore-rule.controller';
import { ConfigModule } from '@nestjs/config';
import { ModulesModule } from '../../../../modules/modules.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from '../../../../config/microservice.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ModulesModule,
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
  controllers: [MsProjectFirestoreRuleController],
})
export class MsProjectFirestoreRuleModule {}
