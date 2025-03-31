import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { microserviceConfig } from "src/config/microservice.config";
import { ModulesModule } from "src/modules/modules.module";
import { FirestoreController } from "./firestore.controller";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.firestore.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
    ModulesModule,
  ],
  controllers: [FirestoreController],
})
export class FirestoreModule {}
