import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModulesModule } from 'src/modules/modules.module';
import { AppModule } from './app/app.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { ProjectController } from './project.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    ModulesModule,
    AppModule,
  ],
  controllers: [ProjectController],
  exports: [AppModule],
})
export class ProjectModule {}
