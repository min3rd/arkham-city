import { Module } from '@nestjs/common';
import { GwWebsdkAuthModule } from './gw-websdk-auth/gw-websdk-auth.module';
import { GwWebSDKFirestoreModule } from './gw-websdk-firestore/gw-websdk-firestore.module';

@Module({
  imports: [GwWebsdkAuthModule, GwWebSDKFirestoreModule],
})
export class GwWebsdkModule {}
