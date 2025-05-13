import { Test, TestingModule } from '@nestjs/testing';
import { MsProjectFirestoreController } from './ms-project-firestore.controller';

describe('MsProjectFirestoreController', () => {
  let controller: MsProjectFirestoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MsProjectFirestoreController],
    }).compile();

    controller = module.get<MsProjectFirestoreController>(
      MsProjectFirestoreController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
