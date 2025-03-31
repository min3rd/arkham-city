import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ModulesModule } from "src/modules/modules.module";
import { FirestoreController } from "./firestore.controller";

@Module({
  imports: [ConfigModule.forRoot(), ModulesModule],
  controllers: [FirestoreController],
})
export class FirestoreModule {}
