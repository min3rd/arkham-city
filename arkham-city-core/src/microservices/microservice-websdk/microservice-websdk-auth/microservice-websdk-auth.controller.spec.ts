import { Test, TestingModule } from '@nestjs/testing';
import { MicroserviceWebsdkAuthController } from './microservice-websdk-auth.controller';

describe('MicroserviceWebsdkAuthController', () => {
  let controller: MicroserviceWebsdkAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicroserviceWebsdkAuthController],
    }).compile();

    controller = module.get<MicroserviceWebsdkAuthController>(MicroserviceWebsdkAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
