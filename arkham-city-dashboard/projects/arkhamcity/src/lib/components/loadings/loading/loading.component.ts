import { ChangeDetectorRef, Component, inject, OnDestroy, type OnInit, ViewEncapsulation } from '@angular/core';
import { LoadingService } from '../../../services/loading/loading.service';
import { Subject, takeUntil } from 'rxjs';

import { ArkProgressBar } from '../../progress-bars/ark-progress-bar/ark-progress-bar.component';

@Component({
  selector: 'ark-loading',
  imports: [ArkProgressBar],
  templateUrl: './loading.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
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
