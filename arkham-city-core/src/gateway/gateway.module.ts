import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FirestoreModule } from './firestore/firestore.module';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, FirestoreModule, StorageModule, UserModule],
})
export class GatewayModule {}
