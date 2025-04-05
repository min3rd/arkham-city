import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { FirestoreModule } from './firestore/firestore.module';
import { ConfigModule } from '@nestjs/config';
import { GatewayWebsdkModule } from './gateway-websdk/gateway-websdk.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, ProjectModule, FirestoreModule, GatewayWebsdkModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class GatewayModule {}
