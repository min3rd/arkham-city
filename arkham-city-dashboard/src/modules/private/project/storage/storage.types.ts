export interface StorageFile {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  projectId: string;
  userId?: string;
  metadata?: Record<string, any>;
  isPublic: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadFileDto {
  projectId: string;
  metadata?: Record<string, any>;
  isPublic?: boolean;
  expiresAt?: Date;
}

export interface ListFilesQueryDto {
  projectId: string;
  page?: number;
  limit?: number;
  mimeType?: string;
}

export interface ListFilesResponse {
  files: StorageFile[];
  total: number;
}

export interface GenerateSignedUrlDto {
  expiresIn: number;
}

export interface SignedUrlResponse {
  signedUrl: string;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  result?: StorageFile;
}
