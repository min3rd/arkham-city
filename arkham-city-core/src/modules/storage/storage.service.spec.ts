import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import { DatabaseService } from '@modules/database/database.service';
import * as fs from 'fs';

jest.mock('fs');

describe('StorageService', () => {
  let service: StorageService;
  let databaseService: DatabaseService;
  let configService: ConfigService;

  const mockConnection = {
    model: jest.fn().mockReturnValue({
      find: jest.fn(),
      findById: jest.fn(),
      countDocuments: jest.fn(),
      save: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'STORAGE_BASE_PATH') return './storage';
              if (key === 'STORAGE_SIGNING_SECRET') return 'test-secret';
              return null;
            }),
          },
        },
        {
          provide: DatabaseService,
          useValue: {
            createProjectConnection: jest.fn().mockReturnValue(mockConnection),
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    configService = module.get<ConfigService>(ConfigService);

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateFilename', () => {
    it('should generate a unique filename', () => {
      const originalName = 'test.txt';
      const filename1 = service['generateFilename'](originalName);
      const filename2 = service['generateFilename'](originalName);

      expect(filename1).toBeDefined();
      expect(filename2).toBeDefined();
      expect(filename1).not.toBe(filename2);
    });
  });

  describe('getProjectStoragePath', () => {
    it('should return the correct project storage path', () => {
      const projectId = 'project-id';
      const result = service['getProjectStoragePath'](projectId);

      expect(result).toContain(projectId);
    });
  });

  describe('generateSignedUrl', () => {
    it('should generate a signed URL for existing file', async () => {
      const projectId = 'test-project';
      const fileId = 'test-file';
      const options = { expiresIn: 3600 };

      const mockFile = {
        _id: fileId,
        projectId,
        userId: 'user-123',
      };

      const mockModel = {
        findOne: jest.fn().mockResolvedValue(mockFile),
      };

      mockConnection.model.mockReturnValue(mockModel);

      const result = await service.generateSignedUrl(
        projectId,
        fileId,
        options,
      );

      expect(result.error).toBe(false);
      expect(result.data).toBeDefined();
      expect(typeof result.data).toBe('string');
    });

    it('should return error for non-existent file', async () => {
      const projectId = 'test-project';
      const fileId = 'non-existent';
      const options = { expiresIn: 3600 };

      const mockModel = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      mockConnection.model.mockReturnValue(mockModel);

      const result = await service.generateSignedUrl(
        projectId,
        fileId,
        options,
      );

      expect(result.error).toBe(true);
    });
  });

  describe('verifySignedUrl', () => {
    it('should verify a valid signed URL', async () => {
      const projectId = 'test-project';
      const fileId = 'test-file';
      const options = { expiresIn: 3600 };

      const mockFile = {
        _id: fileId,
        projectId,
        userId: 'user-123',
      };

      const mockModel = {
        findOne: jest.fn().mockResolvedValue(mockFile),
      };

      mockConnection.model.mockReturnValue(mockModel);

      const generateResult = await service.generateSignedUrl(
        projectId,
        fileId,
        options,
      );
      const signedUrl = generateResult.data as string;

      const verifyResult = service.verifySignedUrl(signedUrl);

      expect(verifyResult.error).toBe(false);
      expect(verifyResult.data).toEqual({ projectId, fileId });
    });

    it('should reject an invalid signed URL', () => {
      const invalidUrl = 'invalid-signed-url';

      const result = service.verifySignedUrl(invalidUrl);

      expect(result.error).toBe(true);
    });
  });
});
