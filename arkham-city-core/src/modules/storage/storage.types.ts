import mongoose from 'mongoose';

export interface StorageFile {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UploadFileDto {
  file: Buffer;
  filename: string;
  originalName: string;
  mimeType: string;
  projectId: string;
  userId?: string;
  metadata?: Record<string, any>;
  isPublic?: boolean;
  expiresAt?: Date;
}

export interface SignedUrlOptions {
  expiresIn: number;
}

export interface ListFilesQuery {
  projectId: string;
  userId?: string;
  page?: number;
  limit?: number;
  mimeType?: string;
}

export const StorageFileSchema = new mongoose.Schema<StorageFile>(
  {
    filename: {
      type: String,
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

StorageFileSchema.index({ projectId: 1, userId: 1 });
StorageFileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
