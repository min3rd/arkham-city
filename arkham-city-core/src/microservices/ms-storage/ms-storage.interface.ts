import { JWTPayload } from '@modules/auth/auth.interface';
import {
  UploadFileDto,
  SignedUrlOptions,
  ListFilesQuery,
} from '@modules/storage/storage.types';

export interface MsStorageUploadFileReqPayload {
  user: JWTPayload;
  file: Buffer;
  filename: string;
  originalName: string;
  mimeType: string;
  projectId: string;
  metadata?: Record<string, any>;
  isPublic?: boolean;
  expiresAt?: Date;
}

export interface MsStorageGetFileReqPayload {
  user: JWTPayload;
  projectId: string;
  fileId: string;
}

export interface MsStorageDownloadFileReqPayload {
  user: JWTPayload;
  projectId: string;
  fileId: string;
}

export interface MsStorageDeleteFileReqPayload {
  user: JWTPayload;
  projectId: string;
  fileId: string;
}

export interface MsStorageListFilesReqPayload {
  user: JWTPayload;
  query: ListFilesQuery;
}

export interface MsStorageGenerateSignedUrlReqPayload {
  user: JWTPayload;
  projectId: string;
  fileId: string;
  expiresIn: number;
}

export interface MsStorageDownloadBySignedUrlReqPayload {
  signedUrl: string;
}
