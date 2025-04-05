import { Test, TestingModule } from '@nestjs/testing';
import { GatewayWebsdkAuthController } from './gateway-websdk-auth.controller';

describe('GatewayWebsdkAuthController', () => {
  let controller: GatewayWebsdkAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayWebsdkAuthController],
    }).compile();

    controller = module.get<GatewayWebsdkAuthController>(GatewayWebsdkAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
