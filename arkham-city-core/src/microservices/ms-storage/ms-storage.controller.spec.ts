/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MsStorageController } from './ms-storage.controller';
import { StorageService } from '@modules/storage/storage.service';
import { GoodResponse } from '@src/core/microservice/microservice.types';
import { JWTType } from '@modules/auth/auth.interface';

describe('MsStorageController', () => {
  let controller: MsStorageController;
  let storageService: StorageService;

  const mockStorageService = {
    uploadFile: jest.fn(),
    getFile: jest.fn(),
    downloadFile: jest.fn(),
    deleteFile: jest.fn(),
    listFiles: jest.fn(),
    generateSignedUrl: jest.fn(),
    downloadFileBySignedUrl: jest.fn(),
  };

  const mockUser = {
    sub: 'user-123',
    email: 'test@example.com',
    type: 'dashboard' as JWTType,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MsStorageController],
      providers: [
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    controller = module.get<MsStorageController>(MsStorageController);
    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file', async () => {
      const payload = {
        user: mockUser,
        file: Buffer.from('test'),
        filename: 'test.txt',
        originalName: 'test.txt',
        mimeType: 'text/plain',
        projectId: 'project-123',
      };

      const expectedResult = new GoodResponse({
        _id: 'file-123',
        ...payload,
      });

      mockStorageService.uploadFile.mockResolvedValue(expectedResult);

      const result = await controller.uploadFile(payload);

      expect(result).toEqual(expectedResult);
      expect(storageService.uploadFile).toHaveBeenCalledWith(
        expect.objectContaining({
          file: payload.file,
          filename: payload.filename,
          originalName: payload.originalName,
          mimeType: payload.mimeType,
          projectId: payload.projectId,
          userId: mockUser.sub,
        }),
      );
    });
  });

  describe('getFile', () => {
    it('should get a file', async () => {
      const payload = {
        user: mockUser,
        projectId: 'project-123',
        fileId: 'file-123',
      };

      const expectedResult = new GoodResponse({
        _id: 'file-123',
        filename: 'test.txt',
        projectId: 'project-123',
      });

      mockStorageService.getFile.mockResolvedValue(expectedResult);

      const result = await controller.getFile(payload);

      expect(result).toEqual(expectedResult);
      expect(storageService.getFile).toHaveBeenCalledWith(
        payload.projectId,
        payload.fileId,
        mockUser.sub,
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      const payload = {
        user: mockUser,
        projectId: 'project-123',
        fileId: 'file-123',
      };

      const expectedResult = new GoodResponse(true);

      mockStorageService.deleteFile.mockResolvedValue(expectedResult);

      const result = await controller.deleteFile(payload);

      expect(result).toEqual(expectedResult);
      expect(storageService.deleteFile).toHaveBeenCalledWith(
        payload.projectId,
        payload.fileId,
        mockUser.sub,
      );
    });
  });

  describe('listFiles', () => {
    it('should list files', async () => {
      const payload = {
        user: mockUser,
        query: {
          projectId: 'project-123',
          page: 1,
          limit: 20,
        },
      };

      const expectedResult = new GoodResponse({
        files: [],
        total: 0,
      });

      mockStorageService.listFiles.mockResolvedValue(expectedResult);

      const result = await controller.listFiles(payload);

      expect(result).toEqual(expectedResult);
      expect(storageService.listFiles).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: payload.query.projectId,
          userId: mockUser.sub,
        }),
      );
    });
  });

  describe('generateSignedUrl', () => {
    it('should generate a signed URL', async () => {
      const payload = {
        user: mockUser,
        projectId: 'project-123',
        fileId: 'file-123',
        expiresIn: 3600,
      };

      const expectedResult = new GoodResponse('signed-url-token');

      mockStorageService.generateSignedUrl.mockResolvedValue(expectedResult);

      const result = await controller.generateSignedUrl(payload);

      expect(result).toEqual(expectedResult);
      expect(storageService.generateSignedUrl).toHaveBeenCalledWith(
        payload.projectId,
        payload.fileId,
        { expiresIn: payload.expiresIn },
        mockUser.sub,
      );
    });
  });
});
