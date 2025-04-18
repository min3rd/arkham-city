import { Test, TestingModule } from '@nestjs/testing';
import { GwProjectFirestoreRuleController } from './gw-project-firestore-rule.controller';

describe('GwProjectFirestoreRuleController', () => {
  let controller: GwProjectFirestoreRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GwProjectFirestoreRuleController],
    }).compile();

    controller = module.get<GwProjectFirestoreRuleController>(
      GwProjectFirestoreRuleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
