# Storage Service

The storage service provides S3-like file storage functionality with built-in security and access control.

## Features

- **File Upload**: Upload files with metadata and optional expiration
- **File Download**: Download files with permission checks
- **File Deletion**: Securely delete files and metadata
- **File Listing**: List files with pagination and filtering
- **Signed URLs**: Generate time-limited URLs for secure file sharing
- **Access Control**: Project and user-based permissions
- **File Size Limits**: Configurable maximum file size (default: 100MB)

## Architecture

### Storage Module (`src/modules/storage/`)
- `storage.service.ts`: Core business logic for file operations
- `storage.types.ts`: TypeScript interfaces and Mongoose schemas
- `storage.module.ts`: NestJS module configuration

### Microservice (`src/microservices/ms-storage/`)
- `ms-storage.controller.ts`: RabbitMQ message handlers
- `ms-storage.interface.ts`: Request/response payload interfaces
- `ms-storage.module.ts`: Microservice module configuration

## Configuration

Add to `.env`:

```env
STORAGE_BASE_PATH=./storage
```

## Message Patterns

The service responds to these RabbitMQ patterns:

- `v1.storage.upload`: Upload a file
- `v1.storage.get-file`: Get file metadata
- `v1.storage.download`: Download file content
- `v1.storage.delete`: Delete a file
- `v1.storage.list`: List files with pagination
- `v1.storage.generate-signed-url`: Generate temporary download URL
- `v1.storage.download-by-signed-url`: Download file using signed URL

## API Usage

### Upload File

```typescript
const payload: MsStorageUploadFileReqPayload = {
  user: jwtPayload,
  file: fileBuffer,
  filename: 'generated-name.jpg',
  originalName: 'photo.jpg',
  mimeType: 'image/jpeg',
  projectId: 'project-123',
  metadata: { description: 'User photo' },
  isPublic: false,
  expiresAt: new Date('2024-12-31'),
};
```

### Generate Signed URL

```typescript
const payload: MsStorageGenerateSignedUrlReqPayload = {
  user: jwtPayload,
  projectId: 'project-123',
  fileId: 'file-123',
  expiresIn: 3600, // seconds
};
```

### List Files

```typescript
const payload: MsStorageListFilesReqPayload = {
  user: jwtPayload,
  query: {
    projectId: 'project-123',
    page: 1,
    limit: 20,
    mimeType: 'image/', // filter by mime type
  },
};
```

## Security

- Files are stored in project-specific directories
- Access control based on user ID and project ID
- Public/private file visibility
- Signed URLs with expiration for temporary access
- File size validation to prevent abuse
- MongoDB TTL indexes for automatic file expiration

## Storage Structure

```
./storage/
  └── {projectId}/
      ├── {timestamp}-{random}-{filename}
      └── ...
```

## Database Schema

Files metadata is stored in MongoDB with the following schema:

```typescript
{
  filename: string,           // Generated unique filename
  originalName: string,       // Original filename from upload
  mimeType: string,          // File MIME type
  size: number,              // File size in bytes
  path: string,              // Full file path on disk
  projectId: string,         // Project identifier
  userId: string,            // Owner user ID
  metadata: object,          // Custom metadata
  isPublic: boolean,         // Public accessibility
  expiresAt: Date,           // Optional expiration date
  createdAt: Date,           // Auto-generated
  updatedAt: Date,           // Auto-generated
}
```

## Error Codes

- `01x0040`: File size exceeds maximum limit
- `01x0041`: File not found
- `01x0042`: Access denied to file
- `01x0043`: Failed to upload file
- `01x0044`: Failed to download file
- `01x0045`: Failed to delete file
- `01x0046`: Failed to list files
- `01x0047`: Signed URL has expired
- `01x0048`: Invalid signed URL
- `01x0049`: File not found on disk
