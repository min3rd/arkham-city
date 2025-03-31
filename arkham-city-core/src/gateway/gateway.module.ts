import { Module } from "@nestjs/common";
import { AuthGuard } from "src/core/guards/auth/auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { ProjectModule } from "./project/project.module";
import { FirestoreModule } from "./firestore/firestore.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, ProjectModule, FirestoreModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class GatewayModule {}
