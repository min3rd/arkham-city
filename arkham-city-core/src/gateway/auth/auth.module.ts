import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ModulesModule } from "src/modules/modules.module";
import { AuthController } from "./auth.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { microserviceConfig } from "src/config/microservice.config";

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
    ]),
    ModulesModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
