import { Test } from '@nestjs/testing';
import { FirestoreRuleService } from './firestore-rule.service';
import { DatabaseService } from '@modules/database/database.service'; // Add this import

const mockFirestoreRuleClient = { send: jest.fn(), emit: jest.fn() };
// Mock createProjectConnection to avoid TypeError
const mockDatabaseService = {
  createProjectConnection: jest.fn().mockReturnValue({
    model: jest.fn().mockReturnValue({
      find: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
    }),
  }),
};

describe('FirestoreRuleService', () => {
  let service: FirestoreRuleService;

  beforeEach(async () => {
    mockFirestoreRuleClient.send.mockReset();
    mockFirestoreRuleClient.emit.mockReset();

    const moduleRef = await Test.createTestingModule({
      providers: [
        FirestoreRuleService,
        {
          provide: 'project.firestore.rule',
          useValue: mockFirestoreRuleClient,
        },
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = moduleRef.get(FirestoreRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRules', () => {
    it('should call client.send with correct params', async () => {
      mockFirestoreRuleClient.send.mockResolvedValueOnce([{ id: 1 }]);
      const result = await service.getRawRules('projectId');
      expect(mockFirestoreRuleClient.send).toHaveBeenCalledWith(
        { cmd: 'getRules' },
        { projectId: 'projectId' },
      );
      expect(result).toEqual([{ id: 1 }]);
    });
  });
});
