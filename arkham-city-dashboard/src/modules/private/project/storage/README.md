# Storage File Management UI

This module provides a comprehensive user interface for managing files in the Arkham City storage system. It allows users to upload, download, view, and delete files organized by project (bucket).

## Features

### File List View
- **Datatable Display**: Files are displayed in a searchable, paginated datatable
- **File Information**: Shows file name, size, MIME type, upload date, and visibility status
- **Icons**: Visual file type indicators (image, video, audio, PDF, archive, etc.)
- **Download**: Click on any file to instantly download it
- **Delete**: Delete files with confirmation dialog
- **Search**: Filter files by MIME type
- **Pagination**: Configurable page size (10, 20, 50, 100 items per page)

### File Upload
- **Multiple File Upload**: Upload multiple files simultaneously
- **Drag & Drop**: (Template ready, browser native support)
- **Upload Progress**: Real-time progress tracking for each file
- **Status Indicators**: Visual feedback for pending, uploading, success, and error states
- **Public/Private**: Toggle file visibility
- **Custom Metadata**: Add JSON metadata to files
- **File Preview**: See selected files before uploading
- **Remove Files**: Remove files from upload queue

### File Details
- **File Name**: Original filename preserved
- **File Size**: Human-readable size (Bytes, KB, MB, GB)
- **MIME Type**: Full content type information
- **Upload Date**: Creation timestamp
- **Visibility Badge**: "Public" badge for public files
- **File Icon**: Type-specific icons for better UX

## Module Structure

```
storage/
├── storage.component.ts          # Main component (container)
├── storage.routes.ts              # Route configuration
├── storage.service.ts             # API service for storage operations
├── storage.types.ts               # TypeScript interfaces and types
├── list/
│   ├── list.component.ts         # File list component
│   └── list.component.html       # File list template
├── upload/
│   ├── upload.component.ts       # File upload component
│   └── upload.component.html     # File upload template
└── README.md                      # This file
```

## Routes

The storage module is accessible via the following routes:

```
/projects/:projectId/storage           # File list view
/projects/:projectId/storage/upload    # File upload view
```

## API Integration

The storage module integrates with the Arkham City Storage API through the `StorageService`:

### Service Methods

#### `listFiles(query: ListFilesQueryDto): Observable<ApiResponse<ListFilesResponse>>`
Lists files for a project with pagination and filtering.

**Parameters:**
- `projectId`: Project identifier
- `page`: Page number (optional, default: 1)
- `limit`: Items per page (optional, default: 20)
- `mimeType`: Filter by MIME type (optional)

**Returns:** Observable with files array and total count

#### `uploadFile(file: File, dto: UploadFileDto): Observable<StorageFile>`
Uploads a file to the storage service.

**Parameters:**
- `file`: File object to upload
- `dto.projectId`: Project identifier
- `dto.metadata`: Custom metadata (optional)
- `dto.isPublic`: Public visibility flag (optional)
- `dto.expiresAt`: Expiration date (optional)

**Returns:** Observable with uploaded file metadata
**Progress:** Emits upload progress events

#### `downloadFile(projectId: string, fileId: string): Observable<Blob>`
Downloads a file from the storage service.

**Parameters:**
- `projectId`: Project identifier
- `fileId`: File identifier

**Returns:** Observable with file blob for download

#### `deleteFile(projectId: string, fileId: string): Observable<boolean>`
Deletes a file from the storage service.

**Parameters:**
- `projectId`: Project identifier
- `fileId`: File identifier

**Returns:** Observable with success boolean

#### `getFileMetadata(projectId: string, fileId: string): Observable<StorageFile>`
Retrieves file metadata without downloading the file.

**Parameters:**
- `projectId`: Project identifier
- `fileId`: File identifier

**Returns:** Observable with file metadata

#### `generateSignedUrl(projectId: string, fileId: string, dto: GenerateSignedUrlDto): Observable<SignedUrlResponse>`
Generates a time-limited signed URL for file access.

**Parameters:**
- `projectId`: Project identifier
- `fileId`: File identifier
- `dto.expiresIn`: Expiration time in seconds

**Returns:** Observable with signed URL

## Usage Examples

### Navigate to Storage
```typescript
// From project context
this.router.navigate(['storage'], { relativeTo: this.activatedRoute });
```

### Upload Files Programmatically
```typescript
const files: File[] = [/* selected files */];
const uploadDto: UploadFileDto = {
  projectId: 'project-123',
  isPublic: false,
  metadata: { description: 'User uploaded file' },
};

files.forEach(file => {
  this.storageService.uploadFile(file, uploadDto).subscribe({
    next: (result) => {
    },
    error: (err) => {
    },
  });
});
```

### List Files
```typescript
this.storageService.listFiles({
  projectId: 'project-123',
  page: 1,
  limit: 20,
  mimeType: 'image/', // Filter images only
}).subscribe({
  next: (response) => {
  },
});
```

### Download File
```typescript
this.storageService.downloadFile('project-123', 'file-id-456').subscribe({
  next: (blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filename.ext';
    a.click();
    window.URL.revokeObjectURL(url);
  },
});
```

### Delete File with Confirmation
```typescript
if (confirm('Are you sure you want to delete this file?')) {
  this.storageService.deleteFile('project-123', 'file-id-456').subscribe({
    next: () => {
      this.loadFiles(); // Refresh list
    },
  });
}
```

## Components

### StorageComponent
Main container component that renders the file list.

### ListComponent
Displays the file list with search, pagination, and actions.

**Features:**
- Searchable datatable
- Pagination controls
- File download on click
- Delete action with confirmation
- Upload button
- File type icons
- Size formatting
- Status badges

### UploadComponent
Handles file upload with progress tracking.

**Features:**
- File selection (multiple)
- Upload queue management
- Real-time progress tracking
- Status indicators per file
- Public/private toggle
- Custom metadata input
- Cancel upload
- Remove files from queue

## Types and Interfaces

### StorageFile
```typescript
interface StorageFile {
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
```

### UploadProgress
```typescript
interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  result?: StorageFile;
}
```

### ListFilesQueryDto
```typescript
interface ListFilesQueryDto {
  projectId: string;
  page?: number;
  limit?: number;
  mimeType?: string;
}
```

### UploadFileDto
```typescript
interface UploadFileDto {
  projectId: string;
  metadata?: Record<string, any>;
  isPublic?: boolean;
  expiresAt?: Date;
}
```

## Styling

The storage module uses Tailwind CSS for styling and follows the application's design system:

- **Dark Mode Support**: All components support dark mode
- **Responsive Design**: Mobile-friendly layouts
- **Consistent Spacing**: Uses standard spacing scale
- **Color Scheme**: Follows neutral color palette with accent colors for actions
- **Icons**: Feather icons via `@ng-icons/feather-icons`

## File Size Formatting

The module includes a `formatFileSize()` utility method that converts bytes to human-readable format:

```
1024 bytes → "1 KB"
1048576 bytes → "1 MB"
1073741824 bytes → "1 GB"
```

## File Type Icons

The module automatically selects appropriate icons based on MIME type:

- **Images**: `featherImage`
- **Videos**: `featherVideo`
- **Audio**: `featherMusic`
- **PDFs**: `featherFileText`
- **Archives**: `featherArchive`
- **Default**: `featherFile`

## Error Handling

The module handles various error scenarios:

- **Upload Errors**: Displayed per file in the upload queue
- **Network Errors**: Caught and reported to user
- **Permission Errors**: Handled by backend, displayed in UI
- **File Not Found**: Graceful degradation

## Performance Considerations

- **Pagination**: Prevents loading large datasets at once
- **Lazy Loading**: Routes are lazy-loaded for better initial load time
- **Progress Tracking**: Efficient upload progress without blocking UI
- **OnPush Change Detection**: Optimized rendering performance

## Security

- **Authentication**: All API calls require JWT token (handled by HTTP interceptor)
- **Authorization**: Backend enforces file ownership and permissions
- **Public Files**: Clearly marked with badge
- **Signed URLs**: Time-limited access for sharing

## Future Enhancements

Potential improvements for future iterations:

- Drag & drop file upload
- File preview (images, PDFs)
- Bulk operations (multi-select, bulk delete)
- File sharing (generate and copy signed URLs)
- Advanced search (by name, date range, size range)
- Sorting options (name, size, date)
- Grid view option
- File versioning
- Folder organization
- File tags/categories

## Integration with Other Modules

The storage module is designed to work seamlessly with other Arkham City modules:

- **Projects**: Files are organized by project
- **Authentication**: User context for permissions
- **Navigation**: Accessible from project navigation

## Testing

To test the storage module:

1. Navigate to a project: `/projects/{projectId}/storage`
2. Upload files using the "Upload File" button
3. Verify files appear in the list
4. Download files by clicking on them
5. Delete files using the trash icon
6. Test pagination with many files
7. Test search by MIME type
8. Test public/private toggle
9. Test metadata input

## Troubleshooting

### Files not appearing after upload
- Check network tab for API errors
- Verify project ID is correct
- Ensure backend storage service is running

### Upload progress stuck
- Check file size limits on backend
- Verify network connectivity
- Check browser console for errors

### Download not working
- Verify file exists on backend
- Check permissions (file owner or public)
- Ensure blob handling is working

### Delete confirmation not showing
- Check browser popup blocker
- Verify confirm() is not blocked

## Related Documentation

- [Storage Gateway API](/arkham-city-core/src/gateway/gw-storage/README.md)
- [Storage Microservice](/arkham-city-core/src/microservices/ms-storage/)
- [Backend Storage Module](/arkham-city-core/src/modules/storage/README.md)

## Support

For issues or questions:
- Check the backend API documentation
- Review console errors
- Verify API endpoint configuration in `config.json`
- Ensure JWT token is valid and not expired
