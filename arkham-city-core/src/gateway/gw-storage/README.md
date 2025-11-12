# Storage Gateway API

The Storage Gateway provides RESTful API endpoints for the S3-like storage service, enabling file upload, download, deletion, and management through HTTP requests.

## Base URL

```
/api/storage
```

## Authentication

All endpoints (except signed URL download) require Bearer token authentication:

```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### 1. Upload File

Upload a file to the storage service.

**Endpoint:** `POST /storage/upload`

**Content-Type:** `multipart/form-data`

**Request Body:**
- `file` (File, required): The file to upload
- `projectId` (string, required): Project identifier
- `originalName` (string, optional): Original filename (defaults to uploaded filename)
- `mimeType` (string, optional): MIME type (defaults to detected type)
- `metadata` (JSON string, optional): Custom metadata object
- `isPublic` (boolean, optional): Whether file is publicly accessible (default: false)
- `expiresAt` (ISO 8601 date, optional): Expiration date for the file

**Example Request:**
```bash
curl -X POST "http://localhost:3000/storage/upload" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "file=@/path/to/file.jpg" \
  -F "projectId=project-123" \
  -F "metadata={\"description\":\"Profile photo\"}" \
  -F "isPublic=false"
```

**Response:**
```json
{
  "_id": "file-id-123",
  "filename": "1234567890-abc123-file.jpg",
  "originalName": "file.jpg",
  "mimeType": "image/jpeg",
  "size": 102400,
  "path": "/storage/project-123/1234567890-abc123-file.jpg",
  "projectId": "project-123",
  "userId": "user-id-456",
  "metadata": {
    "description": "Profile photo"
  },
  "isPublic": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `201 Created`: File uploaded successfully
- `400 Bad Request`: Invalid request (file size exceeds limit, missing required fields)
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Access denied

---

### 2. Get File Metadata

Retrieve metadata for a specific file.

**Endpoint:** `GET /storage/files/:projectId/:fileId`

**Path Parameters:**
- `projectId` (string, required): Project identifier
- `fileId` (string, required): File identifier

**Example Request:**
```bash
curl -X GET "http://localhost:3000/storage/files/project-123/file-id-123" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Response:**
```json
{
  "_id": "file-id-123",
  "filename": "1234567890-abc123-file.jpg",
  "originalName": "file.jpg",
  "mimeType": "image/jpeg",
  "size": 102400,
  "path": "/storage/project-123/1234567890-abc123-file.jpg",
  "projectId": "project-123",
  "userId": "user-id-456",
  "metadata": {
    "description": "Profile photo"
  },
  "isPublic": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200 OK`: File metadata retrieved successfully
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Access denied
- `404 Not Found`: File not found

---

### 3. Download File

Download a file by project and file ID.

**Endpoint:** `GET /storage/download/:projectId/:fileId`

**Path Parameters:**
- `projectId` (string, required): Project identifier
- `fileId` (string, required): File identifier

**Example Request:**
```bash
curl -X GET "http://localhost:3000/storage/download/project-123/file-id-123" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -o downloaded-file.jpg
```

**Response:**
- Binary file content with appropriate headers:
  - `Content-Type`: File MIME type
  - `Content-Disposition`: Attachment with original filename
  - `Content-Length`: File size in bytes

**Status Codes:**
- `200 OK`: File downloaded successfully
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Access denied
- `404 Not Found`: File not found

---

### 4. Delete File

Delete a file from the storage service.

**Endpoint:** `DELETE /storage/files/:projectId/:fileId`

**Path Parameters:**
- `projectId` (string, required): Project identifier
- `fileId` (string, required): File identifier

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/storage/files/project-123/file-id-123" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Response:**
```json
true
```

**Status Codes:**
- `200 OK`: File deleted successfully
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Access denied (not the file owner)
- `404 Not Found`: File not found

---

### 5. List Files

List files in a project with pagination and filtering.

**Endpoint:** `GET /storage/files`

**Query Parameters:**
- `projectId` (string, required): Project identifier
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `mimeType` (string, optional): Filter by MIME type (supports partial matching)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/storage/files?projectId=project-123&page=1&limit=20&mimeType=image/" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Response:**
```json
{
  "files": [
    {
      "_id": "file-id-123",
      "filename": "1234567890-abc123-file.jpg",
      "originalName": "file.jpg",
      "mimeType": "image/jpeg",
      "size": 102400,
      "path": "/storage/project-123/1234567890-abc123-file.jpg",
      "projectId": "project-123",
      "userId": "user-id-456",
      "metadata": {},
      "isPublic": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 42
}
```

**Status Codes:**
- `200 OK`: Files listed successfully
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Missing or invalid authentication token

---

### 6. Generate Signed URL

Generate a time-limited signed URL for file download.

**Endpoint:** `POST /storage/signed-url/:projectId/:fileId`

**Path Parameters:**
- `projectId` (string, required): Project identifier
- `fileId` (string, required): File identifier

**Request Body:**
```json
{
  "expiresIn": 3600
}
```

**Body Parameters:**
- `expiresIn` (number, optional): Expiration time in seconds (default: 3600)

**Example Request:**
```bash
curl -X POST "http://localhost:3000/storage/signed-url/project-123/file-id-123" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"expiresIn": 7200}'
```

**Response:**
```json
{
  "signedUrl": "cHJvamVjdC0xMjM6ZmlsZS1pZC0xMjM6MTcwNTMyMDYwMDAwMDphYmMxMjM0NTY3ODkw"
}
```

**Status Codes:**
- `200 OK`: Signed URL generated successfully
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Access denied (not the file owner)
- `404 Not Found`: File not found

---

### 7. Download File by Signed URL

Download a file using a signed URL (public endpoint, no authentication required).

**Endpoint:** `GET /storage/download-signed/:signedUrl`

**Path Parameters:**
- `signedUrl` (string, required): The signed URL token

**Example Request:**
```bash
curl -X GET "http://localhost:3000/storage/download-signed/cHJvamVjdC0xMjM6ZmlsZS1pZC0xMjM6MTcwNTMyMDYwMDAwMDphYmMxMjM0NTY3ODkw" \
  -o downloaded-file.jpg
```

**Response:**
- Binary file content with appropriate headers:
  - `Content-Type`: File MIME type
  - `Content-Disposition`: Attachment with original filename
  - `Content-Length`: File size in bytes

**Status Codes:**
- `200 OK`: File downloaded successfully
- `400 Bad Request`: Invalid or expired signed URL
- `404 Not Found`: File not found

**Security Note:**
Signed URLs provide bearer token authentication. Anyone with a valid signed URL can access the file until expiration, regardless of ownership.

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 01x0040 | File size exceeds maximum limit | Uploaded file is too large |
| 01x0041 | File not found | Requested file does not exist |
| 01x0042 | Access denied to file | User does not have permission to access file |
| 01x0043 | Failed to upload file | File upload operation failed |
| 01x0044 | Failed to download file | File download operation failed |
| 01x0045 | Failed to delete file | File deletion operation failed |
| 01x0046 | Failed to list files | File listing operation failed |
| 01x0047 | Signed URL has expired | The signed URL is no longer valid |
| 01x0048 | Invalid signed URL | The signed URL format is invalid |
| 01x0049 | File not found on disk | File metadata exists but physical file is missing |

## Configuration

### Environment Variables

```env
STORAGE_BASE_PATH=./storage
STORAGE_SIGNING_SECRET=YourSecureSecretKeyHere
STORAGE_MAX_FILE_SIZE=104857600
```

- `STORAGE_BASE_PATH`: Base directory for file storage (default: `./storage`)
- `STORAGE_SIGNING_SECRET`: Secret for signing URLs (required)
- `STORAGE_MAX_FILE_SIZE`: Default maximum file size in bytes (default: 100MB)

### Project-Level Configuration

Each project can override the default file size limit via the `maxFileSize` field in the Project entity.

## Access Control

### File Visibility
- **Private files** (isPublic: false): Only accessible by the file owner
- **Public files** (isPublic: true): Accessible by any authenticated user in the same project

### Permissions
- **Upload**: Any authenticated user can upload files to their projects
- **Read/Download**: File owner or users with project access (for public files)
- **Delete**: Only the file owner can delete files
- **Signed URLs**: Only the file owner can generate signed URLs

## File Storage Structure

Files are stored on disk in the following structure:

```
./storage/
  └── {projectId}/
      ├── {timestamp}-{random}-{filename}
      └── ...
```

File metadata is stored in MongoDB using the `StorageFile` schema, which includes:
- File information (name, size, type, path)
- Access control (projectId, userId, isPublic)
- Custom metadata
- Timestamps (createdAt, updatedAt)
- Optional expiration date

## Integration Examples

### JavaScript/TypeScript

```typescript
// Upload file
const formData = new FormData();
formData.append('file', fileBlob);
formData.append('projectId', 'project-123');
formData.append('metadata', JSON.stringify({ description: 'My file' }));

const response = await fetch('http://localhost:3000/storage/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

const fileData = await response.json();

// List files
const listResponse = await fetch(
  'http://localhost:3000/storage/files?projectId=project-123&page=1&limit=10',
  {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);

const { files, total } = await listResponse.json();

// Download file
const downloadResponse = await fetch(
  `http://localhost:3000/storage/download/project-123/${fileId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);

const blob = await downloadResponse.blob();
```

### cURL

```bash
# Upload
curl -X POST "http://localhost:3000/storage/upload" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "file=@photo.jpg" \
  -F "projectId=project-123"

# List
curl -X GET "http://localhost:3000/storage/files?projectId=project-123" \
  -H "Authorization: Bearer ${TOKEN}"

# Download
curl -X GET "http://localhost:3000/storage/download/project-123/file-123" \
  -H "Authorization: Bearer ${TOKEN}" \
  -o output.jpg

# Generate signed URL
curl -X POST "http://localhost:3000/storage/signed-url/project-123/file-123" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"expiresIn": 3600}'

# Delete
curl -X DELETE "http://localhost:3000/storage/files/project-123/file-123" \
  -H "Authorization: Bearer ${TOKEN}"
```

## Message Queue Integration

The gateway communicates with the storage microservice via RabbitMQ using the following patterns:

- `v1.storage.upload`: Upload file
- `v1.storage.get-file`: Get file metadata
- `v1.storage.download`: Download file
- `v1.storage.delete`: Delete file
- `v1.storage.list`: List files
- `v1.storage.generate-signed-url`: Generate signed URL
- `v1.storage.download-by-signed-url`: Download by signed URL

## Scalability

The storage API is designed for horizontal scalability:

- **Stateless Gateway**: Multiple gateway instances can be deployed behind a load balancer
- **Microservice Architecture**: Storage service runs as independent microservice instances
- **Message Queue**: RabbitMQ enables asynchronous communication and load distribution
- **File Storage**: Files can be stored on shared storage (NFS) or object storage (S3-compatible)

## Performance Considerations

- **File Upload**: Uses streaming to handle large files efficiently
- **File Download**: Direct file serving with appropriate caching headers
- **Pagination**: List operations support pagination to prevent memory issues
- **Database Indexes**: Optimized indexes on projectId, userId, and filename
- **TTL Index**: Automatic cleanup of expired files via MongoDB TTL index
