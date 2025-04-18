import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { ModulesModule } from 'src/modules/modules.module';
import { GwProjectController } from './gw-project.controller';
import { GwProjectAppModule } from './gw-project-app/gw-project-app.module';
import { GwProjectFirestoreModule } from './gw-project-firestore/gw-project-firestore.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.project.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
    ModulesModule,
    GwProjectAppModule,
    GwProjectFirestoreModule,
  ],
  controllers: [GwProjectController],
})
export class GwProjectModule {}
