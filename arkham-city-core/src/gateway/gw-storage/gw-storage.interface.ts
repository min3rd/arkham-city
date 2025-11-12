export interface UploadFileDto {
  originalName: string;
  mimeType: string;
  projectId: string;
  metadata?: Record<string, any>;
  isPublic?: boolean;
  expiresAt?: Date;
}

export interface GenerateSignedUrlDto {
  expiresIn: number;
}

export interface ListFilesQueryDto {
  projectId: string;
  page?: number;
  limit?: number;
  mimeType?: string;
}
