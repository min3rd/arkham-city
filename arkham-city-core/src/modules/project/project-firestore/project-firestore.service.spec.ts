import { Test } from '@nestjs/testing';
import { ProjectFirestoreService } from './project-firestore.service';

// Mock dependencies as needed by ProjectFirestoreService
const mockFirestoreClient = { send: jest.fn(), emit: jest.fn() };

describe('ProjectFirestoreService', () => {
  let service: ProjectFirestoreService;

  beforeEach(async () => {
    mockFirestoreClient.send.mockReset();
    mockFirestoreClient.emit.mockReset();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectFirestoreService,
        { provide: 'project.firestore', useValue: mockFirestoreClient },
      ],
    }).compile();

    service = moduleRef.get(ProjectFirestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
