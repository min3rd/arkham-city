import { Test, TestingModule } from '@nestjs/testing';
import { GwStorageController } from './gw-storage.controller';
import { ClientRMQ } from '@nestjs/microservices';
import { of } from 'rxjs';
import { microserviceConfig } from '@src/config/microservice.config';
import { GoodResponse } from '@src/core/microservice/microservice.types';
import { StorageFile } from '@modules/storage/storage.types';

describe('GwStorageController', () => {
  let controller: GwStorageController;
  let rmqClient: ClientRMQ;

  const mockRmqClient = {
    send: jest.fn(),
  };

  const mockUser = {
    sub: 'user-123',
    email: 'test@example.com',
    type: 'dashboard',
  };

  const mockStorageFile: StorageFile = {
    filename: '123-abc-test.jpg',
    originalName: 'test.jpg',
    mimeType: 'image/jpeg',
    size: 1024,
    path: '/storage/project-123/123-abc-test.jpg',
    projectId: 'project-123',
    userId: 'user-123',
    metadata: {},
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GwStorageController],
      providers: [
        {
          provide: microserviceConfig.storage.name,
          useValue: mockRmqClient,
        },
      ],
    }).compile();

    controller = module.get<GwStorageController>(GwStorageController);
    rmqClient = module.get<ClientRMQ>(microserviceConfig.storage.name);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const mockBody = {
        projectId: 'project-123',
        metadata: { description: 'Test file' },
        isPublic: false,
      };

      const mockRequest = {
        user: mockUser,
      } as any;

      mockRmqClient.send.mockReturnValue(of(new GoodResponse(mockStorageFile)));

      const result = await controller.uploadFile(
        mockRequest,
        mockFile,
        mockBody,
      );

      expect(result).toEqual(mockStorageFile);
      expect(mockRmqClient.send).toHaveBeenCalledWith(
        microserviceConfig.storage.patterns.upload,
        expect.objectContaining({
          user: mockUser,
          file: mockFile.buffer,
          projectId: 'project-123',
        }),
      );
    });
  });

  describe('getFile', () => {
    it('should get file metadata successfully', async () => {
      const mockRequest = {
        user: mockUser,
      } as any;

      mockRmqClient.send.mockReturnValue(of(new GoodResponse(mockStorageFile)));

      const result = await controller.getFile(
        mockRequest,
        'project-123',
        'file-123',
      );

      expect(result).toEqual(mockStorageFile);
      expect(mockRmqClient.send).toHaveBeenCalledWith(
        microserviceConfig.storage.patterns.getFile,
        {
          user: mockUser,
          projectId: 'project-123',
          fileId: 'file-123',
        },
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file successfully', async () => {
      const mockRequest = {
        user: mockUser,
      } as any;

      mockRmqClient.send.mockReturnValue(of(new GoodResponse(true)));

      const result = await controller.deleteFile(
        mockRequest,
        'project-123',
        'file-123',
      );

      expect(result).toBe(true);
      expect(mockRmqClient.send).toHaveBeenCalledWith(
        microserviceConfig.storage.patterns.delete,
        {
          user: mockUser,
          projectId: 'project-123',
          fileId: 'file-123',
        },
      );
    });
  });

  describe('listFiles', () => {
    it('should list files successfully', async () => {
      const mockRequest = {
        user: mockUser,
      } as any;

      const mockQuery = {
        projectId: 'project-123',
        page: '1',
        limit: '20',
      };

      const mockResponse = {
        files: [mockStorageFile],
        total: 1,
      };

      mockRmqClient.send.mockReturnValue(of(new GoodResponse(mockResponse)));

      const result = await controller.listFiles(mockRequest, mockQuery as any);

      expect(result).toEqual(mockResponse);
      expect(mockRmqClient.send).toHaveBeenCalledWith(
        microserviceConfig.storage.patterns.list,
        {
          user: mockUser,
          query: {
            projectId: 'project-123',
            page: 1,
            limit: 20,
          },
        },
      );
    });
  });

  describe('generateSignedUrl', () => {
    it('should generate a signed URL successfully', async () => {
      const mockRequest = {
        user: mockUser,
      } as any;

      const mockBody = {
        expiresIn: 3600,
      };

      const mockSignedUrl = 'base64-encoded-url';

      mockRmqClient.send.mockReturnValue(of(new GoodResponse(mockSignedUrl)));

      const result = await controller.generateSignedUrl(
        mockRequest,
        'project-123',
        'file-123',
        mockBody,
      );

      expect(result).toEqual({ signedUrl: mockSignedUrl });
      expect(mockRmqClient.send).toHaveBeenCalledWith(
        microserviceConfig.storage.patterns.generateSignedUrl,
        {
          user: mockUser,
          projectId: 'project-123',
          fileId: 'file-123',
          expiresIn: 3600,
        },
      );
    });
  });
});
