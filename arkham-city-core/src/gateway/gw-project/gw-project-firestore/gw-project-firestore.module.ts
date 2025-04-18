import { Module } from '@nestjs/common';
import { GwProjectFirestoreRuleModule } from './gw-project-firestore-rule/gw-project-firestore-rule.module';

@Module({
  imports: [GwProjectFirestoreRuleModule],
})
export class GwProjectFirestoreModule {}
