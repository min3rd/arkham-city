import { ChangeDetectorRef, Component, inject, Input, OnDestroy, type OnInit } from '@angular/core';
import { LoadingService } from '../../../services/loading/loading.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'form-element',
  imports: [],
  template: ``,
})
export class FormElement implements OnInit, OnDestroy {
  @Input() ignoreLoading: boolean | string = false;
  @Input() noSuffixSpace: boolean | string = false;
  onLoading = false;
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  loadingService: LoadingService = inject(LoadingService);

  unsubscribeAll = new Subject<any>();

  ngOnInit(): void {
    this.loadingService.show$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((status) => {
        this.onLoading = status;
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  enableIgnoreLoading(): boolean {
    return (this.ignoreLoading || this.ignoreLoading === '') as boolean;
  }

  enableNoSuffixSpace(): boolean {
    return (this.noSuffixSpace || this.noSuffixSpace === '') as boolean;
  }
}
