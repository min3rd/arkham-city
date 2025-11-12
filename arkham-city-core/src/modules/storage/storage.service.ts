import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Connection } from 'mongoose';
import {
  StorageFile,
  StorageFileSchema,
  UploadFileDto,
  SignedUrlOptions,
  ListFilesQuery,
} from './storage.types';
import {
  ServiceResponse,
  GoodResponse,
  BadResponse,
  Errors,
} from '@src/core/microservice/microservice.types';
import { DatabaseService } from '@modules/database/database.service';
import { Project } from '@modules/project/project.types';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly storageBasePath: string;
  private readonly defaultMaxFileSize: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    @InjectModel(Project.name, 'metadata')
    private readonly projectModel: Model<Project>,
  ) {
    this.storageBasePath =
      this.configService.get<string>('STORAGE_BASE_PATH') || './storage';
    this.defaultMaxFileSize =
      this.configService.get<number>('STORAGE_MAX_FILE_SIZE') ||
      100 * 1024 * 1024;
    this.ensureStorageDirectory();
  }

  private ensureStorageDirectory(): void {
    try {
      if (!fs.existsSync(this.storageBasePath)) {
        fs.mkdirSync(this.storageBasePath, { recursive: true });
      }
    } catch (error) {
      this.logger.error(
        `Failed to create storage directory: ${this.storageBasePath}`,
        error,
      );
      throw new Error(
        `Storage initialization failed: unable to create directory ${this.storageBasePath}`,
      );
    }
  }

  private getStorageModel(connection: Connection) {
    return connection.model('storage-files', StorageFileSchema);
  }

  private generateFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(16).toString('hex');
    return `${timestamp}-${randomString}${ext}`;
  }

  private getProjectStoragePath(projectId: string): string {
    return path.join(this.storageBasePath, projectId);
  }

  private ensureProjectDirectory(projectId: string): void {
    const projectPath = this.getProjectStoragePath(projectId);
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }
  }

  async uploadFile(
    uploadDto: UploadFileDto,
  ): Promise<ServiceResponse<StorageFile>> {
    this.logger.log('uploadFile:start', {
      originalName: uploadDto.originalName,
      projectId: uploadDto.projectId,
    });

    const project = await this.projectModel.findById(uploadDto.projectId);
    const maxFileSize = project?.maxFileSize || this.defaultMaxFileSize;

    if (uploadDto.file.length > maxFileSize) {
      return new BadResponse(Errors.STORAGE_FILE_SIZE_EXCEEDS_LIMIT);
    }

    this.ensureProjectDirectory(uploadDto.projectId);

    const filename = this.generateFilename(uploadDto.originalName);
    const filePath = path.join(
      this.getProjectStoragePath(uploadDto.projectId),
      filename,
    );

    try {
      await fs.promises.writeFile(filePath, uploadDto.file);

      const connection = this.databaseService.createProjectConnection(
        uploadDto.projectId,
      );
      const StorageModel = this.getStorageModel(connection);

      const storageFile = new StorageModel({
        filename,
        originalName: uploadDto.originalName,
        mimeType: uploadDto.mimeType,
        size: uploadDto.file.length,
        path: filePath,
        projectId: uploadDto.projectId,
        userId: uploadDto.userId,
        metadata: uploadDto.metadata || {},
        isPublic: uploadDto.isPublic || false,
        expiresAt: uploadDto.expiresAt,
      });

      const savedFile = await storageFile.save();
      this.logger.log('uploadFile:end', { fileId: savedFile._id });

      return new GoodResponse(savedFile.toJSON());
    } catch (error) {
      this.logger.error('uploadFile:error', error);
      if (fs.existsSync(filePath)) {
        try {
          await fs.promises.unlink(filePath);
        } catch (cleanupError) {
          this.logger.error('uploadFile:cleanupFailed', cleanupError);
        }
      }
      return new BadResponse(Errors.STORAGE_FILE_UPLOAD_FAILED);
    }
  }

  async getFile(
    projectId: string,
    fileId: string,
    userId?: string,
  ): Promise<ServiceResponse<StorageFile>> {
    this.logger.log('getFile:start', { projectId, fileId, userId });

    try {
      const connection =
        this.databaseService.createProjectConnection(projectId);
      const StorageModel = this.getStorageModel(connection);

      const file = await StorageModel.findById(fileId);

      if (!file) {
        return new BadResponse(Errors.STORAGE_FILE_NOT_FOUND);
      }

      if (!file.isPublic && (!userId || file.userId !== userId)) {
        return new BadResponse(Errors.STORAGE_ACCESS_DENIED);
      }

      this.logger.log('getFile:end');
      return new GoodResponse(file.toJSON());
    } catch (error) {
      this.logger.error('getFile:error', error);
      return new BadResponse(Errors.STORAGE_FILE_NOT_FOUND);
    }
  }

  async downloadFile(
    projectId: string,
    fileId: string,
    userId?: string,
  ): Promise<ServiceResponse<Buffer>> {
    this.logger.log('downloadFile:start', { projectId, fileId, userId });

    const fileResponse = await this.getFile(projectId, fileId, userId);
    if (fileResponse.error) {
      return new BadResponse(Errors.STORAGE_FILE_NOT_FOUND);
    }

    const fileData = fileResponse.data as StorageFile;

    if (!fs.existsSync(fileData.path)) {
      return new BadResponse(Errors.STORAGE_FILE_NOT_FOUND_ON_DISK);
    }

    try {
      const fileBuffer = await fs.promises.readFile(fileData.path);
      this.logger.log('downloadFile:end');
      return new GoodResponse(fileBuffer);
    } catch (error) {
      this.logger.error('downloadFile:error', error);
      return new BadResponse(Errors.STORAGE_FILE_DOWNLOAD_FAILED);
    }
  }

  async deleteFile(
    projectId: string,
    fileId: string,
    userId?: string,
  ): Promise<ServiceResponse<boolean>> {
    this.logger.log('deleteFile:start', { projectId, fileId, userId });

    try {
      const connection =
        this.databaseService.createProjectConnection(projectId);
      const StorageModel = this.getStorageModel(connection);

      const file = await StorageModel.findById(fileId);

      if (!file) {
        return new BadResponse(Errors.STORAGE_FILE_NOT_FOUND);
      }

      if (userId && file.userId !== userId) {
        return new BadResponse(Errors.STORAGE_ACCESS_DENIED);
      }

      if (fs.existsSync(file.path)) {
        await fs.promises.unlink(file.path);
      } else {
        this.logger.warn(
          `File not found on disk during delete: ${file.path}. Metadata will be removed, but file may be orphaned.`,
        );
      }

      await file.deleteOne();

      this.logger.log('deleteFile:end');
      return new GoodResponse(true);
    } catch (error) {
      this.logger.error('deleteFile:error', error);
      return new BadResponse(Errors.STORAGE_FILE_DELETE_FAILED);
    }
  }

  async listFiles(
    query: ListFilesQuery,
  ): Promise<ServiceResponse<{ files: StorageFile[]; total: number }>> {
    this.logger.log('listFiles:start', query);

    try {
      const connection = this.databaseService.createProjectConnection(
        query.projectId,
      );
      const StorageModel = this.getStorageModel(connection);

      const filter: any = { projectId: query.projectId };

      if (query.userId) {
        filter.$or = [{ isPublic: true }, { userId: query.userId }];
      }

      if (query.mimeType) {
        filter.mimeType = { $regex: query.mimeType, $options: 'i' };
      }

      const page = query.page || 1;
      const limit = query.limit || 20;
      const skip = (page - 1) * limit;

      const [files, total] = await Promise.all([
        StorageModel.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        StorageModel.countDocuments(filter),
      ]);

      this.logger.log('listFiles:end', { count: files.length, total });

      return new GoodResponse({
        files: files.map((f) => f.toJSON()),
        total,
      });
    } catch (error) {
      this.logger.error('listFiles:error', error);
      return new BadResponse(Errors.STORAGE_FILE_LIST_FAILED);
    }
  }

  async generateSignedUrl(
    projectId: string,
    fileId: string,
    options: SignedUrlOptions,
    userId?: string,
  ): Promise<ServiceResponse<string>> {
    this.logger.log('generateSignedUrl:start', {
      projectId,
      fileId,
      options,
      userId,
    });

    const connection = this.databaseService.createProjectConnection(projectId);
    const StorageModel = this.getStorageModel(connection);
    const file = await StorageModel.findOne({ _id: fileId, projectId });

    if (!file) {
      this.logger.warn('generateSignedUrl:fileNotFound', { projectId, fileId });
      return new BadResponse(Errors.STORAGE_FILE_NOT_FOUND);
    }

    if (userId && file.userId && file.userId.toString() !== userId) {
      this.logger.warn('generateSignedUrl:unauthorized', {
        projectId,
        fileId,
        userId,
      });
      return new BadResponse(Errors.STORAGE_ACCESS_DENIED);
    }

    const expiresAt = Date.now() + options.expiresIn * 1000;
    const secret = this.configService.get<string>('STORAGE_SIGNING_SECRET');

    if (!secret) {
      this.logger.error('STORAGE_SIGNING_SECRET is not configured');
      throw new Error('Storage signing secret is not configured');
    }

    const payload = `${projectId}:${fileId}:${expiresAt}`;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const signedUrl = `${payload}:${signature}`;
    const encodedUrl = Buffer.from(signedUrl).toString('base64url');

    this.logger.log('generateSignedUrl:end');
    return new GoodResponse(encodedUrl);
  }

  verifySignedUrl(signedUrl: string): ServiceResponse<{
    projectId: string;
    fileId: string;
  }> {
    this.logger.log('verifySignedUrl:start');

    try {
      const decoded = Buffer.from(signedUrl, 'base64url').toString('utf-8');
      const parts = decoded.split(':');

      if (parts.length !== 4) {
        return new BadResponse(Errors.STORAGE_SIGNED_URL_INVALID);
      }

      const [projectId, fileId, expiresAt, signature] = parts;

      const expiry = parseInt(expiresAt, 10);
      if (isNaN(expiry) || Date.now() > expiry) {
        return new BadResponse(Errors.STORAGE_SIGNED_URL_EXPIRED);
      }

      const secret = this.configService.get<string>('STORAGE_SIGNING_SECRET');

      if (!secret) {
        this.logger.error('STORAGE_SIGNING_SECRET is not configured');
        throw new Error('Storage signing secret is not configured');
      }

      const payload = `${projectId}:${fileId}:${expiresAt}`;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      if (signature !== expectedSignature) {
        return new BadResponse(Errors.STORAGE_SIGNED_URL_INVALID);
      }

      this.logger.log('verifySignedUrl:end');
      return new GoodResponse({ projectId, fileId });
    } catch (error) {
      this.logger.error('verifySignedUrl:error', error);
      return new BadResponse(Errors.STORAGE_SIGNED_URL_INVALID);
    }
  }

  async downloadFileBySignedUrl(
    signedUrl: string,
  ): Promise<ServiceResponse<{ file: Buffer; metadata: StorageFile }>> {
    this.logger.log('downloadFileBySignedUrl:start');

    const verifyResult = this.verifySignedUrl(signedUrl);
    if (verifyResult.error) {
      return new BadResponse(verifyResult.errorCode);
    }

    const { projectId, fileId } = verifyResult.data!;

    const fileResponse = await this.getFile(projectId, fileId);
    if (fileResponse.error) {
      return new BadResponse(Errors.STORAGE_FILE_NOT_FOUND);
    }

    const downloadResponse = await this.downloadFile(projectId, fileId);
    if (downloadResponse.error) {
      return new BadResponse(Errors.STORAGE_FILE_DOWNLOAD_FAILED);
    }

    this.logger.log('downloadFileBySignedUrl:end');
    return new GoodResponse({
      file: downloadResponse.data!,
      metadata: fileResponse.data!,
    });
  }
}
