import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FirestoreModule } from './firestore/firestore.module';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './user/user.module';
import { AuthGuard } from 'src/core/guards/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    FirestoreModule,
    StorageModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class GatewayModule {}
