import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { microserviceConfig } from '@src/config/microservice.config';
import { StorageService } from '@modules/storage/storage.service';
import {
  MsStorageUploadFileReqPayload,
  MsStorageGetFileReqPayload,
  MsStorageDownloadFileReqPayload,
  MsStorageDeleteFileReqPayload,
  MsStorageListFilesReqPayload,
  MsStorageGenerateSignedUrlReqPayload,
  MsStorageDownloadBySignedUrlReqPayload,
} from './ms-storage.interface';

@Controller()
export class MsStorageController {
  private readonly logger = new Logger(MsStorageController.name);

  constructor(private readonly storageService: StorageService) {}

  @MessagePattern(microserviceConfig.storage.patterns.upload)
  async uploadFile(payload: MsStorageUploadFileReqPayload) {
    this.logger.log('uploadFile:start', {
      userId: payload.user.sub,
      projectId: payload.projectId,
      originalName: payload.originalName,
    });

    const result = await this.storageService.uploadFile({
      file: payload.file,
      filename: payload.filename,
      originalName: payload.originalName,
      mimeType: payload.mimeType,
      projectId: payload.projectId,
      userId: payload.user.sub,
      metadata: payload.metadata,
      isPublic: payload.isPublic,
      expiresAt: payload.expiresAt,
    });

    this.logger.log('uploadFile:end');
    return result;
  }

  @MessagePattern(microserviceConfig.storage.patterns.getFile)
  async getFile(payload: MsStorageGetFileReqPayload) {
    this.logger.log('getFile:start', {
      userId: payload.user.sub,
      projectId: payload.projectId,
      fileId: payload.fileId,
    });

    const result = await this.storageService.getFile(
      payload.projectId,
      payload.fileId,
      payload.user.sub,
    );

    this.logger.log('getFile:end');
    return result;
  }

  @MessagePattern(microserviceConfig.storage.patterns.download)
  async downloadFile(payload: MsStorageDownloadFileReqPayload) {
    this.logger.log('downloadFile:start', {
      userId: payload.user.sub,
      projectId: payload.projectId,
      fileId: payload.fileId,
    });

    const result = await this.storageService.downloadFile(
      payload.projectId,
      payload.fileId,
      payload.user.sub,
    );

    this.logger.log('downloadFile:end');
    return result;
  }

  @MessagePattern(microserviceConfig.storage.patterns.delete)
  async deleteFile(payload: MsStorageDeleteFileReqPayload) {
    this.logger.log('deleteFile:start', {
      userId: payload.user.sub,
      projectId: payload.projectId,
      fileId: payload.fileId,
    });

    const result = await this.storageService.deleteFile(
      payload.projectId,
      payload.fileId,
      payload.user.sub,
    );

    this.logger.log('deleteFile:end');
    return result;
  }

  @MessagePattern(microserviceConfig.storage.patterns.list)
  async listFiles(payload: MsStorageListFilesReqPayload) {
    this.logger.log('listFiles:start', {
      userId: payload.user.sub,
      query: payload.query,
    });

    const result = await this.storageService.listFiles({
      ...payload.query,
      userId: payload.user.sub,
    });

    this.logger.log('listFiles:end');
    return result;
  }

  @MessagePattern(microserviceConfig.storage.patterns.generateSignedUrl)
  async generateSignedUrl(payload: MsStorageGenerateSignedUrlReqPayload) {
    this.logger.log('generateSignedUrl:start', {
      userId: payload.user.sub,
      projectId: payload.projectId,
      fileId: payload.fileId,
    });

    const result = await this.storageService.generateSignedUrl(
      payload.projectId,
      payload.fileId,
      { expiresIn: payload.expiresIn },
      payload.user.sub,
    );

    this.logger.log('generateSignedUrl:end');
    return result;
  }

  @MessagePattern(microserviceConfig.storage.patterns.downloadBySignedUrl)
  async downloadBySignedUrl(payload: MsStorageDownloadBySignedUrlReqPayload) {
    this.logger.log('downloadBySignedUrl:start');

    const result = await this.storageService.downloadFileBySignedUrl(
      payload.signedUrl,
    );

    this.logger.log('downloadBySignedUrl:end');
    return result;
  }
}
