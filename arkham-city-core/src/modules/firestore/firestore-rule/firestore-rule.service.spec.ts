import { Test, TestingModule } from '@nestjs/testing';
import { FirestoreRuleService } from './firestore-rule.service';
import { DatabaseModule } from '../../database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';

describe('FirestoreRuleService', () => {
  let service: FirestoreRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, DatabaseModule],
      providers: [FirestoreRuleService, ConfigService, DatabaseService],
    }).compile();

    service = module.get<FirestoreRuleService>(FirestoreRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
