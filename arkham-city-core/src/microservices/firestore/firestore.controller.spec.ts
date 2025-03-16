import { Test, TestingModule } from '@nestjs/testing';
import { FirestoreController } from './firestore.controller';

describe('FirestoreController', () => {
  let controller: FirestoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirestoreController],
    }).compile();

    controller = module.get<FirestoreController>(FirestoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
