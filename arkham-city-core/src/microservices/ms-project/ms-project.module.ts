import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModulesModule } from 'src/modules/modules.module';
import { MsProjectAppModule } from './ms-project-app/ms-project-app.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { MsProjectController } from './ms-project.controller';
import { MsProjectFirestoreModule } from './ms-project-firestore/ms-project-firestore.module';

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
    MsProjectAppModule,
    MsProjectFirestoreModule,
  ],
  controllers: [MsProjectController],
  exports: [MsProjectAppModule],
})
export class MsProjectModule {}
