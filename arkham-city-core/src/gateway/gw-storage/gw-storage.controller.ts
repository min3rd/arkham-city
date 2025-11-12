import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { microserviceConfig } from '@src/config/microservice.config';
import { REQUEST_FIELDS } from '@src/config/request.config';
import { GatewayController } from '@src/core/gateway/gateway.controller';
import { ServiceResponse } from '@src/core/microservice/microservice.types';
import { JWTPayload } from '@modules/auth/auth.interface';
import { StorageFile } from '@modules/storage/storage.types';
import {
  MsStorageUploadFileReqPayload,
  MsStorageGetFileReqPayload,
  MsStorageDownloadFileReqPayload,
  MsStorageDeleteFileReqPayload,
  MsStorageListFilesReqPayload,
  MsStorageGenerateSignedUrlReqPayload,
  MsStorageDownloadBySignedUrlReqPayload,
} from '@src/microservices/ms-storage/ms-storage.interface';
import {
  UploadFileDto,
  GenerateSignedUrlDto,
  ListFilesQueryDto,
} from './gw-storage.interface';
import { Public } from '@src/core/decorators/public';

@Controller('storage')
export class GwStorageController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.storage.name)
    private readonly rmqClient: ClientRMQ,
  ) {
    super();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
  ): Promise<StorageFile> {
    const user = request[REQUEST_FIELDS.user] as JWTPayload;

    const payload: MsStorageUploadFileReqPayload = {
      user,
      file: file.buffer,
      filename: file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      projectId: body.projectId,
      metadata: body.metadata,
      isPublic: body.isPublic,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    };

    const res: ServiceResponse<StorageFile> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.storage.patterns.upload, payload),
    );

    this.afterCallMicroservice(res);
    return res.data!;
  }

  @Get('files/:projectId/:fileId')
  async getFile(
    @Req() request: Request,
    @Param('projectId') projectId: string,
    @Param('fileId') fileId: string,
  ): Promise<StorageFile> {
    const user = request[REQUEST_FIELDS.user] as JWTPayload;

    const payload: MsStorageGetFileReqPayload = {
      user,
      projectId,
      fileId,
    };

    const res: ServiceResponse<StorageFile> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.storage.patterns.getFile, payload),
    );

    this.afterCallMicroservice(res);
    return res.data!;
  }

  @Get('download/:projectId/:fileId')
  async downloadFile(
    @Req() request: Request,
    @Res() response: Response,
    @Param('projectId') projectId: string,
    @Param('fileId') fileId: string,
  ): Promise<void> {
    const user = request[REQUEST_FIELDS.user] as JWTPayload;

    const payload: MsStorageDownloadFileReqPayload = {
      user,
      projectId,
      fileId,
    };

    const res: ServiceResponse<Buffer> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.storage.patterns.download,
        payload,
      ),
    );

    this.afterCallMicroservice(res);

    const fileMetadataPayload: MsStorageGetFileReqPayload = {
      user,
      projectId,
      fileId,
    };

    const fileMetadataRes: ServiceResponse<StorageFile> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.storage.patterns.getFile,
        fileMetadataPayload,
      ),
    );

    this.afterCallMicroservice(fileMetadataRes);

    const metadata = fileMetadataRes.data!;

    response.setHeader('Content-Type', metadata.mimeType);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${metadata.originalName}"`,
    );
    response.setHeader('Content-Length', metadata.size);
    response.send(res.data);
  }

  @Delete('files/:projectId/:fileId')
  async deleteFile(
    @Req() request: Request,
    @Param('projectId') projectId: string,
    @Param('fileId') fileId: string,
  ): Promise<boolean> {
    const user = request[REQUEST_FIELDS.user] as JWTPayload;

    const payload: MsStorageDeleteFileReqPayload = {
      user,
      projectId,
      fileId,
    };

    const res: ServiceResponse<boolean> = await firstValueFrom(
      this.rmqClient.send(microserviceConfig.storage.patterns.delete, payload),
    );

    this.afterCallMicroservice(res);
    return res.data!;
  }

  @Get('files')
  async listFiles(
    @Req() request: Request,
    @Query() query: ListFilesQueryDto,
  ): Promise<{ files: StorageFile[]; total: number }> {
    const user = request[REQUEST_FIELDS.user] as JWTPayload;

    const payload: MsStorageListFilesReqPayload = {
      user,
      query: {
        projectId: query.projectId,
        page: query.page ? Number(query.page) : undefined,
        limit: query.limit ? Number(query.limit) : undefined,
        mimeType: query.mimeType,
      },
    };

    const res: ServiceResponse<{ files: StorageFile[]; total: number }> =
      await firstValueFrom(
        this.rmqClient.send(microserviceConfig.storage.patterns.list, payload),
      );

    this.afterCallMicroservice(res);
    return res.data!;
  }

  @Post('signed-url/:projectId/:fileId')
  async generateSignedUrl(
    @Req() request: Request,
    @Param('projectId') projectId: string,
    @Param('fileId') fileId: string,
    @Body() body: GenerateSignedUrlDto,
  ): Promise<{ signedUrl: string }> {
    const user = request[REQUEST_FIELDS.user] as JWTPayload;

    const payload: MsStorageGenerateSignedUrlReqPayload = {
      user,
      projectId,
      fileId,
      expiresIn: body.expiresIn || 3600,
    };

    const res: ServiceResponse<string> = await firstValueFrom(
      this.rmqClient.send(
        microserviceConfig.storage.patterns.generateSignedUrl,
        payload,
      ),
    );

    this.afterCallMicroservice(res);
    return { signedUrl: res.data! };
  }

  @Public()
  @Get('download-signed/:signedUrl')
  async downloadBySignedUrl(
    @Res() response: Response,
    @Param('signedUrl') signedUrl: string,
  ): Promise<void> {
    const payload: MsStorageDownloadBySignedUrlReqPayload = {
      signedUrl,
    };

    const res: ServiceResponse<{ file: Buffer; metadata: StorageFile }> =
      await firstValueFrom(
        this.rmqClient.send(
          microserviceConfig.storage.patterns.downloadBySignedUrl,
          payload,
        ),
      );

    this.afterCallMicroservice(res);

    const { file, metadata } = res.data!;

    response.setHeader('Content-Type', metadata.mimeType);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${metadata.originalName}"`,
    );
    response.setHeader('Content-Length', metadata.size);
    response.send(file);
  }
}
