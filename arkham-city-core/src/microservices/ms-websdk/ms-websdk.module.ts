import { Module } from '@nestjs/common';
import { MsWebsdkAuthModule } from './ms-websdk-auth/ms-websdk-auth.module';
import { MsWebsdkFirestoreModule } from './ms-websdk-firestore/ms-websdk-firestore.module';

@Module({
  imports: [MsWebsdkAuthModule, MsWebsdkFirestoreModule],
})
export class MsWebsdkModule {}
