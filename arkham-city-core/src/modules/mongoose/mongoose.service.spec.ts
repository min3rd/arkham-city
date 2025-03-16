import { Test, TestingModule } from '@nestjs/testing';
import { MongooseService } from './mongoose.service';

describe('FirestoreService', () => {
  let service: MongooseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongooseService],
    }).compile();

    service = module.get<MongooseService>(MongooseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('can extract normal object', () => {
    const dataType = service.fromDataToType({
      username: 'username',
      amount: 999999,
    });
    expect(dataType).toEqual({
      username: { type: String },
      amount: { type: Number },
    });
  });

  it('can extract tree object', () => {
    const dataType = service.fromDataToType({
      username: 'username',
      amount: 999999,
      child: {
        name: 'name',
      },
    });
    expect(dataType).toEqual({
      username: { type: String },
      amount: { type: Number },
      child: {
        name: { type: String },
      },
    });
  });
});
