import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { ModulesModule } from 'src/modules/modules.module';
import { FirestoreController } from './firestore/firestore.controller';
import { ProjectController } from './project/project.controller';
import { AppModule } from './project/app/app.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.auth.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
      {
        name: microserviceConfig.firestore.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
      {
        name: microserviceConfig.projects.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
    ModulesModule,
    AppModule,
  ],
  controllers: [UserController, FirestoreController, ProjectController],
  providers: [],
})
export class MicroservicesModule {}
