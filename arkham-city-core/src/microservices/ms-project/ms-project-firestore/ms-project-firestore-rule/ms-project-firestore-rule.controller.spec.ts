import { Test, TestingModule } from '@nestjs/testing';
import { MsProjectFirestoreRuleController } from './ms-project-firestore-rule.controller';

describe('MsProjectFirestoreRuleController', () => {
  let controller: MsProjectFirestoreRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MsProjectFirestoreRuleController],
    }).compile();

    controller = module.get<MsProjectFirestoreRuleController>(
      MsProjectFirestoreRuleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
