import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  type OnInit,
} from '@angular/core';
import { LoadingService } from '../../services/loading/loading.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ark-loading',
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArkLoading implements OnInit, OnDestroy {
  loading = false;
  private loadingService: LoadingService = inject(LoadingService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _unsubscribeAll = new Subject<any>();
  ngOnInit(): void {
    this.loadingService.show$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((status) => {
        this.loading = status;
        this.changeDetectorRef.markForCheck();
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
