import { Test, TestingModule } from '@nestjs/testing';
import { GwProjectFirestoreRuleController } from './gw-project-firestore-rule.controller';
import { GwProjectFirestoreRuleModule } from './gw-project-firestore-rule.module';

describe('GwProjectFirestoreRuleController', () => {
  let controller: GwProjectFirestoreRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GwProjectFirestoreRuleController],
      imports: [GwProjectFirestoreRuleModule],
    }).compile();

    controller = module.get<GwProjectFirestoreRuleController>(
      GwProjectFirestoreRuleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
