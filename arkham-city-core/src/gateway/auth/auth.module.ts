import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ModulesModule } from "src/modules/modules.module";
import { AuthController } from "./auth.controller";

@Module({
  imports: [ConfigModule.forRoot(), ModulesModule],
  controllers: [AuthController],
})
export class AuthModule {}
