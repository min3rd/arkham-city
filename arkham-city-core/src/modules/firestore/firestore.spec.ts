import { FirestoreService } from './firestore.service';
import { Test } from '@nestjs/testing';
import { FirestoreModule } from '@modules/firestore/firestore.module';

describe('Firestore', () => {
  let firestoreService: FirestoreService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [FirestoreModule],
      providers: [FirestoreService],
    }).compile();

    firestoreService = module.get(FirestoreService);
  });

  it('should be able to import Firestore', () => {
    expect(firestoreService).toBeDefined();
  });
});
