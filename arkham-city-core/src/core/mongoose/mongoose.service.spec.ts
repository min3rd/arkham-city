import { Test, TestingModule } from '@nestjs/testing';
import { MongooseService } from './mongoose.service';

describe('MongooseService', () => {
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

  it('can parse normal object', () => {
    const dataType = service.fromDataToType({
      username: 'username',
      age: 20,
      createdAt: new Date().toUTCString(),
    });
    expect(dataType).toEqual({
      username: { type: String },
      age: { type: Number },
      createdAt: { type: Date },
    });
  });

  it('can parse tree object', () => {
    const dataType = service.fromDataToType({
      username: 'username',
      age: 20,
      createdAt: new Date().toISOString(),
      parent: {
        username: 'username',
        age: 20,
        createdAt: new Date().toISOString(),
      },
    });
    expect(dataType).toEqual({
      username: { type: String },
      age: { type: Number },
      createdAt: { type: Date },
      parent: {
        username: { type: String },
        age: { type: Number },
        createdAt: { type: Date },
      },
    });
  });

  it('can parse object with array', () => {
    const dataType = service.fromDataToType({
      username: 'username',
      names: ['name 1', 'name 2'],
    });
    expect(dataType).toEqual({
      username: { type: String },
      names: { type: Array },
    });
  });
});
