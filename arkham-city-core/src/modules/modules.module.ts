import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ProjectModule } from "./project/project.module";
import { FirestoreModule } from "./firestore/firestore.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [AuthModule, UserModule, ProjectModule, FirestoreModule],
  exports: [AuthModule, UserModule, ProjectModule, FirestoreModule],
})
export class ModulesModule {}
