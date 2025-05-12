import { Test, TestingModule } from '@nestjs/testing';
import { ProjectFirestoreService } from './project-firestore.service';

describe('ProjectFirestoreService', () => {
  let service: ProjectFirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectFirestoreService],
    }).compile();

    service = module.get<ProjectFirestoreService>(ProjectFirestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
