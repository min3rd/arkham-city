import { Module } from '@nestjs/common';
import { FirestoreRuleService } from './firestore-rule.service';

@Module({
  providers: [FirestoreRuleService],
})
export class FirestoreRuleModule {}
