import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ModulesModule } from 'src/modules/modules.module';
import { AuthController } from './auth/auth.controller';
import { FirestoreController } from './firestore/firestore.controller';
import { TestController } from './test/test.controller';
import { ProjectController } from './project/project.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { AppModule } from './project/app/app.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ModulesModule,
    ClientsModule.register([
      {
        name: microserviceConfig.projects.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
    AppModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [
    AuthController,
    FirestoreController,
    TestController,
    ProjectController,
  ],
})
export class GatewayModule {}
