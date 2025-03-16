import { Module } from '@nestjs/common';
import { FirestoreController } from './firestore.controller';
import { FirestoreService } from './firestore.service';

@Module({
  controllers: [FirestoreController],
  providers: [FirestoreService],
})
export class FirestoreModule {}
