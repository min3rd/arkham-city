import { Module } from '@nestjs/common';
import { GwAuthModule } from './gw-auth/gw-auth.module';
import { GwProjectModule } from './gw-project/gw-project.module';
import { GwFirestoreModule } from './gw-firestore/gw-firestore.module';
import { ConfigModule } from '@nestjs/config';
import { GwWebsdkModule } from './gw-websdk/gw-websdk.module';
import { AuthGuard } from '../core/guards/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GwAuthModule,
    GwProjectModule,
    GwFirestoreModule,
    GwWebsdkModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class GatewayModule {}
