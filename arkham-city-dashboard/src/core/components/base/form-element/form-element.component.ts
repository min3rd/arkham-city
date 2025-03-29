import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  type OnInit,
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { LoadingService } from '../../../services/loading/loading.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'form-element',
  imports: [],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FormElement implements OnInit, OnDestroy {
  @Input() ignoreLoading: boolean | string = false;
  onLoading: boolean = false;
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  loadingService: LoadingService = inject(LoadingService);

  unsubscribeAll: Subject<any> = new Subject();
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
}
