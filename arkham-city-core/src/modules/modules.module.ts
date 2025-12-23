import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { FirestoreModule } from './firestore/firestore.module';
import { UserModule } from './user/user.module';
import { WebsdkModule } from './websdk/websdk.module';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';
import { RoleModule } from './role/role.module';
import { MigrationsModule } from './migrations/migrations.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProjectModule,
    FirestoreModule,
    WebsdkModule,
    DatabaseModule,
    StorageModule,
    RoleModule,
    MigrationsModule,
  ],
  exports: [
    AuthModule,
    UserModule,
    ProjectModule,
    FirestoreModule,
    StorageModule,
    RoleModule,
    MigrationsModule,
  ],
})
export class ModulesModule {}
