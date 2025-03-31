import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { microserviceConfig } from "src/config/microservice.config";
import { ModulesModule } from "src/modules/modules.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ModulesModule,
    ClientsModule.register([
      {
        name: microserviceConfig.projects.apps.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
