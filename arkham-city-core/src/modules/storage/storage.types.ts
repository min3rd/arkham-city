import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuditEntity } from '../base/base.type';

@Schema({
  timestamps: true,
})
export class StorageFile extends AuditEntity {
  @Prop({
    required: true,
    index: true,
  })
  filename: string;

  @Prop({
    required: true,
  })
  originalName: string;

  @Prop({
    required: true,
  })
  mimeType: string;

  @Prop({
    required: true,
  })
  size: number;

  @Prop({
    required: true,
  })
  path: string;

  @Prop({
    required: true,
    index: true,
  })
  projectId: string;

  @Prop({
    index: true,
  })
  userId?: string;

  @Prop({
    type: Object,
  })
  metadata?: Record<string, any>;

  @Prop({
    default: false,
  })
  isPublic: boolean;

  @Prop()
  expiresAt?: Date;
}

export type StorageFileDocument = HydratedDocument<StorageFile>;

export const StorageFileSchema = SchemaFactory.createForClass(StorageFile);

StorageFileSchema.index({ projectId: 1, userId: 1 });
StorageFileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

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
