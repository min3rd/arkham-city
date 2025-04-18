import { Test, TestingModule } from '@nestjs/testing';
import { FirestoreRuleService } from './firestore-rule.service';

describe('FirestoreRuleService', () => {
  let service: FirestoreRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirestoreRuleService],
    }).compile();

    service = module.get<FirestoreRuleService>(FirestoreRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
