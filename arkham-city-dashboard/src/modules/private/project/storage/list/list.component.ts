import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import * as feathers from '@ng-icons/feather-icons';
import {
  ArkButton,
  ArkDatatable,
  ArkDrawer,
  ArkDrawerContainer,
  ArkDrawerContent,
  ArkPaginator,
  ArkTextInput,
  BaseListComponent,
} from 'arkhamcity';
import { StorageFile } from '@modules/private/project/storage/storage.types';
import { StorageService } from '@modules/private/project/storage/storage.service';
import { takeUntil, combineLatest } from 'rxjs';

@Component({
  selector: 'project-storage-list',
  imports: [
    CommonModule,
    RouterModule,
    ArkDrawerContainer,
    ArkDrawer,
    ArkDrawerContent,
    ArkTextInput,
    ArkButton,
    ArkPaginator,
    ArkDatatable,
    NgIconComponent,
  ],
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ ...feathers })],
})
export class ListComponent extends BaseListComponent implements OnInit {
  @ViewChild('drawer', { static: true }) drawer!: ArkDrawer;

  files = signal<StorageFile[]>([]);
  total = signal<number>(0);
  page = signal<number>(1);
  pageSize = signal<number>(20);
  searchQuery = signal<string>('');
  projectId = signal<string>('');
  isLoading = signal<boolean>(false);

  private readonly storageService = inject(StorageService);

  override ngOnInit() {
    combineLatest([
      this.storageService.files$,
      this.storageService.total$,
    ])
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(([files, total]) => {
        this.files.set(files);
        this.total.set(total);
        this.isLoading.set(false);
        this.changeDetectorRef.markForCheck();
      });

    this.activatedRoute.params.pipe(takeUntil(this.unsubscribeAll)).subscribe((params) => {
      if (params['projectId']) {
        this.projectId.set(params['projectId']);
        this.loadFiles();
      }
    });
  }

  loadFiles() {
    if (!this.projectId()) return;

    this.isLoading.set(true);
    this.storageService
      .listFiles({
        projectId: this.projectId(),
        page: this.page(),
        limit: this.pageSize(),
        ...(this.searchQuery() && { mimeType: this.searchQuery() }),
      })
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe({
        error: () => {
          this.isLoading.set(false);
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  onSearch(search: string) {
    this.searchQuery.set(search);
    this.page.set(1);
    this.loadFiles();
  }

  onPageChange(newPage: number) {
    this.page.set(newPage);
    this.loadFiles();
  }

  onPageSizeChange(newPageSize: number) {
    this.pageSize.set(newPageSize);
    this.page.set(1);
    this.loadFiles();
  }

  onUploadClick() {
    this.router.navigate(['upload'], {
      relativeTo: this.activatedRoute,
    });
  }

  onFileClick(file: StorageFile) {
    this.downloadFile(file);
  }

  downloadFile(file: StorageFile) {
    this.storageService
      .downloadFile(file.projectId, file._id)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.originalName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error: (err) => {
        },
      });
  }

  deleteFile(file: StorageFile, event: Event) {
    event.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${file.originalName}"?`)) {
      return;
    }

    this.storageService
      .deleteFile(file.projectId, file._id)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe({
        next: () => {
          this.loadFiles();
        },
        error: (err) => {
        },
      });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'music';
    if (mimeType.includes('pdf')) return 'file-text';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'archive';
    return 'file';
  }
}
