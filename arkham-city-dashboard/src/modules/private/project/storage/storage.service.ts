import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent, HttpEventType } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, map, catchError } from 'rxjs';
import { ConfigService } from '@core/services/config.service';
import { ApiResponse } from 'arkhamcity';
import {
  StorageFile,
  ListFilesQueryDto,
  ListFilesResponse,
  UploadFileDto,
  GenerateSignedUrlDto,
  SignedUrlResponse,
  UploadProgress,
} from './storage.types';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _files: BehaviorSubject<StorageFile[]> = new BehaviorSubject<StorageFile[]>([]);
  private _total: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _uploadProgress: BehaviorSubject<UploadProgress[]> = new BehaviorSubject<UploadProgress[]>([]);

  private readonly httpClient = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  get files$(): Observable<StorageFile[]> {
    return this._files.asObservable();
  }

  get total$(): Observable<number> {
    return this._total.asObservable();
  }

  get uploadProgress$(): Observable<UploadProgress[]> {
    return this._uploadProgress.asObservable();
  }

  listFiles(query: ListFilesQueryDto): Observable<ApiResponse<ListFilesResponse>> {
    const params = new HttpParams({
      fromObject: {
        projectId: query.projectId,
        ...(query.page && { page: query.page.toString() }),
        ...(query.limit && { limit: query.limit.toString() }),
        ...(query.mimeType && { mimeType: query.mimeType }),
      },
    });

    return this.httpClient
      .get<ApiResponse<ListFilesResponse>>(this.configService.endpoint('storage/files'), {
        params,
      })
      .pipe(
        switchMap((response) => {
          this._files.next(response.data.files);
          this._total.next(response.data.total);
          return of(response);
        })
      );
  }

  uploadFile(file: File, dto: UploadFileDto): Observable<StorageFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', dto.projectId);
    if (dto.metadata) {
      formData.append('metadata', JSON.stringify(dto.metadata));
    }
    if (dto.isPublic !== undefined) {
      formData.append('isPublic', dto.isPublic.toString());
    }
    if (dto.expiresAt) {
      formData.append('expiresAt', dto.expiresAt.toISOString());
    }

    return this.httpClient
      .post<StorageFile>(this.configService.endpoint('storage/upload'), formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            const progress = Math.round((100 * event.loaded) / event.total);
            this.updateUploadProgress(file, progress, 'uploading');
          } else if (event.type === HttpEventType.Response) {
            this.updateUploadProgress(file, 100, 'success', undefined, event.body);
            return event.body;
          }
          return null;
        }),
        catchError((error) => {
          this.updateUploadProgress(file, 0, 'error', error.message || 'Upload failed');
          throw error;
        })
      ) as Observable<StorageFile>;
  }

  downloadFile(projectId: string, fileId: string): Observable<Blob> {
    return this.httpClient.get(
      this.configService.endpoint(`storage/download/${projectId}/${fileId}`),
      {
        responseType: 'blob',
      }
    );
  }

  getFileMetadata(projectId: string, fileId: string): Observable<StorageFile> {
    return this.httpClient
      .get<StorageFile>(this.configService.endpoint(`storage/files/${projectId}/${fileId}`));
  }

  deleteFile(projectId: string, fileId: string): Observable<boolean> {
    return this.httpClient
      .delete<boolean>(this.configService.endpoint(`storage/files/${projectId}/${fileId}`));
  }

  generateSignedUrl(
    projectId: string,
    fileId: string,
    dto: GenerateSignedUrlDto
  ): Observable<SignedUrlResponse> {
    return this.httpClient.post<SignedUrlResponse>(
      this.configService.endpoint(`storage/signed-url/${projectId}/${fileId}`),
      dto
    );
  }

  private updateUploadProgress(
    file: File,
    progress: number,
    status: UploadProgress['status'],
    error?: string,
    result?: StorageFile
  ): void {
    const currentProgress = this._uploadProgress.value;
    const index = currentProgress.findIndex((p) => p.file === file);

    const newProgress: UploadProgress = {
      file,
      progress,
      status,
      error,
      result,
    };

    if (index >= 0) {
      currentProgress[index] = newProgress;
    } else {
      currentProgress.push(newProgress);
    }

    this._uploadProgress.next([...currentProgress]);
  }

  clearUploadProgress(): void {
    this._uploadProgress.next([]);
  }

  initializeUpload(file: File): void {
    this.updateUploadProgress(file, 0, 'pending');
  }
}
