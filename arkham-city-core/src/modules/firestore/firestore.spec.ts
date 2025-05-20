import { FirestoreService } from './firestore.service';
import { Test } from '@nestjs/testing';
import { DatabaseService } from '@modules/database/database.service'; // Add this import

// Mock dependencies
const mockWebSDKFirestoreClient = { emit: jest.fn(), send: jest.fn() };
const mockDatabaseService = {
  createProjectConnection: jest.fn(() => ({
    model: jest.fn(() => ({
      findOne: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
    })),
  })),
};
const mockProjectFirestoreRuleClient = { send: jest.fn() };

describe('Firestore', () => {
  let firestoreService: FirestoreService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FirestoreService,
        { provide: 'websdk.firestore', useValue: mockWebSDKFirestoreClient },
        {
          provide: 'project.firestore.rule',
          useValue: mockProjectFirestoreRuleClient,
        },
        { provide: DatabaseService, useValue: mockDatabaseService }, // Use class reference here
      ],
    }).compile();

    firestoreService = module.get(FirestoreService);
  });

  it('should be able to import Firestore', () => {
    expect(firestoreService).toBeDefined();
  });

  // Add tests for FirestoreService methods
  describe('getSafeSchemaName', () => {
    it('should return safe schema name', () => {
      expect(firestoreService.getSafeSchemaName('TestSchema')).toBe(
        'firestore-testschema',
      );
      expect(firestoreService.getSafeSchemaName('Test@Schema!')).toBe(
        'firestore-test-schema-',
      );
    });
  });

  describe('fromDataToField', () => {
    it('should convert data to fields', () => {
      const fields = firestoreService.fromDataToField({
        name: 'abc',
        age: 10,
        active: true,
      });
      expect(fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'name', type: 'String' }),
          expect.objectContaining({ name: 'age', type: 'Number' }),
          expect.objectContaining({ name: 'active', type: 'Boolean' }),
        ]),
      );
    });
  });

  describe('fromDataToType', () => {
    it('should convert data to mongoose types', () => {
      const types = firestoreService.fromDataToType({
        name: 'abc',
        age: 10,
        active: true,
      });
      expect(types).toHaveProperty('name.type', String);
      expect(types).toHaveProperty('age.type', Number);
      expect(types).toHaveProperty('active.type', Boolean);
    });
  });

  describe('getAllRuleTypes', () => {
    it('should return all rule types', () => {
      const res = firestoreService.getAllRuleTypes();
      expect(res.data).toBeInstanceOf(Array);
      expect(res.data?.length).toBeGreaterThan(0);
    });
  });

  describe('getAllRuleConditionTypes', () => {
    it('should return all rule condition types', () => {
      const res = firestoreService.getAllRuleConditionTypes();
      expect(res.data).toBeInstanceOf(Array);
      expect(res.data?.length).toBeGreaterThan(0);
    });
  });
});
