import { Module } from '@nestjs/common';
import { FirestoreModule } from './controllers/firestore/firestore.module';
import { StorageModule } from './controllers/storage/storage.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [FirestoreModule, StorageModule, CoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
