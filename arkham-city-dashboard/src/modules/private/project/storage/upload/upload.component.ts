import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import * as feathers from '@ng-icons/feather-icons';
import {
  ArkButton,
  ArkTextInput,
  ArkCheckbox,
  BaseListComponent,
  CapitalizePipe,
} from 'arkhamcity';
import { StorageService } from '@modules/private/project/storage/storage.service';
import { UploadProgress } from '@modules/private/project/storage/storage.types';
import { formatFileSize } from '@modules/private/project/storage/storage.utils';
import { takeUntil } from 'rxjs';

const UPLOAD_COMPLETE_DELAY_MS = 1000;

@Component({
  selector: 'project-storage-upload',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslocoModule,
    CapitalizePipe,
    ArkButton,
    ArkTextInput,
    ArkCheckbox,
    NgIconComponent,
  ],
  templateUrl: './upload.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ ...feathers })],
})
export class UploadComponent extends BaseListComponent implements OnInit {
  uploadForm!: FormGroup;
  selectedFiles = signal<File[]>([]);
  uploadProgress = signal<UploadProgress[]>([]);
  projectId = signal<string>('');
  isUploading = signal<boolean>(false);

  private readonly formBuilder = inject(FormBuilder);
  private readonly storageService = inject(StorageService);
  private readonly translocoService = inject(TranslocoService);

  override ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      isPublic: [false],
      metadata: [''],
    });

    this.activatedRoute.parent?.params.pipe(takeUntil(this.unsubscribeAll)).subscribe((params) => {
      if (params['projectId']) {
        this.projectId.set(params['projectId']);
      }
    });

    this.storageService.uploadProgress$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((progress) => {
        this.uploadProgress.set(progress);
        this.changeDetectorRef.markForCheck();
      });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      this.selectedFiles.set([...this.selectedFiles(), ...newFiles]);
    }
  }

  removeFile(index: number) {
    const files = this.selectedFiles();
    files.splice(index, 1);
    this.selectedFiles.set([...files]);
  }

  onUpload() {
    if (this.selectedFiles().length === 0 || !this.projectId()) {
      return;
    }

    this.isUploading.set(true);
    const formValue = this.uploadForm.value;
    
    let metadata: Record<string, any> | undefined;
    if (formValue.metadata) {
      try {
        metadata = JSON.parse(formValue.metadata);
      } catch (error) {
        const message = this.translocoService.translate('invalid json format in metadata field please check and try again');
        alert(message);
        this.isUploading.set(false);
        return;
      }
    }

    const uploadDto = {
      projectId: this.projectId(),
      isPublic: formValue.isPublic,
      metadata,
    };

    const files = this.selectedFiles();
    let uploadedCount = 0;

    this.storageService.clearUploadProgress();

    files.forEach((file) => {
      this.storageService.initializeUpload(file);

      this.storageService
        .uploadFile(file, uploadDto)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe({
          next: (result) => {
            if (result) {
              uploadedCount++;
              if (uploadedCount === files.length) {
                this.onUploadComplete();
              }
            }
          },
          error: () => {
            uploadedCount++;
            if (uploadedCount === files.length) {
              this.onUploadComplete();
            }
          },
        });
    });
  }

  onUploadComplete() {
    setTimeout(() => {
      this.isUploading.set(false);
      this.selectedFiles.set([]);
      this.storageService.clearUploadProgress();
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      this.changeDetectorRef.markForCheck();
    }, UPLOAD_COMPLETE_DELAY_MS);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  formatFileSize(bytes: number): string {
    return formatFileSize(bytes);
  }

  getProgressForFile(file: File): UploadProgress | undefined {
    return this.uploadProgress().find((p) => p.file === file);
  }

  getStatusIcon(status: UploadProgress['status']): string {
    switch (status) {
      case 'success':
        return 'featherCheckCircle';
      case 'error':
        return 'featherXCircle';
      case 'uploading':
        return 'featherUploadCloud';
      default:
        return 'featherClock';
    }
  }

  getStatusClass(status: UploadProgress['status']): string {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'uploading':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-neutral-600 dark:text-neutral-400';
    }
  }
}
