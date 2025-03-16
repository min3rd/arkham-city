import { Test, TestingModule } from '@nestjs/testing';
import { FirestoreService } from './firestore.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DynamicSchema,
  DynamicSchemaSchema,
  Field,
  FieldSchema,
} from './firestore.type';
import { ConfigModule } from '@nestjs/config';

describe('FirestoreService', () => {
  let service: FirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_DB_FIRESTORE as string, {
          connectionName: 'firestore',
        }),
        MongooseModule.forFeature(
          [
            { name: DynamicSchema.name, schema: DynamicSchemaSchema },
            { name: Field.name, schema: FieldSchema },
          ],
          'firestore',
        ),
      ],
      providers: [FirestoreService],
    }).compile();

    service = module.get<FirestoreService>(FirestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('can store new schema into firestore database', () => {
    const received = service.storeSchema('test', [
      {
        name: 'username',
        type: 'string',
      },
    ]);
    expect(received).toBeDefined();
  });
});
