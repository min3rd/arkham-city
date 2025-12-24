import { Module } from '@nestjs/common';
import { GwAuthModule } from './gw-auth/gw-auth.module';
import { GwProjectModule } from './gw-project/gw-project.module';
import { GwFirestoreModule } from './gw-firestore/gw-firestore.module';
import { ConfigModule } from '@nestjs/config';
import { GwWebsdkModule } from './gw-websdk/gw-websdk.module';
import { GwStorageModule } from './gw-storage/gw-storage.module';
import { AuthGuard } from '../core/guards/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { GwRoleModule } from './gw-role/gw-role.module';
import { PermissionGuard } from 'src/core/guards/permissions/permissions.guard';
import { ModulesModule } from 'src/modules/modules.module';
import { GwUserModule } from './gw-user/gw-user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GwAuthModule,
    GwProjectModule,
    GwFirestoreModule,
    GwWebsdkModule,
    GwStorageModule,
    GwRoleModule,
    GwUserModule,
    ModulesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class GatewayModule {}
