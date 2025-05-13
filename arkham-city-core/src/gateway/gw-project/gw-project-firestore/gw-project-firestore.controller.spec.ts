import { Test, TestingModule } from '@nestjs/testing';
import { GwProjectFirestoreController } from './gw-project-firestore.controller';

describe('GwProjectFirestoreController', () => {
  let controller: GwProjectFirestoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GwProjectFirestoreController],
    }).compile();

    controller = module.get<GwProjectFirestoreController>(
      GwProjectFirestoreController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
