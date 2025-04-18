import { Module } from '@nestjs/common';
import { MsProjectFirestoreRuleModule } from './ms-project-firestore-rule/ms-project-firestore-rule.module';

@Module({
  imports: [MsProjectFirestoreRuleModule],
})
export class MsProjectFirestoreModule {}
