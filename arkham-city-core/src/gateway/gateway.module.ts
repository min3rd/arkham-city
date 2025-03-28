import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ModulesModule } from 'src/modules/modules.module';
import { AuthController } from './auth/auth.controller';
import { FirestoreController } from './firestore/firestore.controller';
import { TestController } from './test/test.controller';

@Module({
  imports: [ConfigModule.forRoot(), ModulesModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController, FirestoreController, TestController],
})
export class GatewayModule {}
