import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  type OnInit,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'base-component',
  imports: [CommonModule],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent implements OnInit, OnDestroy {
  loading:boolean = false;
  form!: UntypedFormGroup;
  formBuilder: UntypedFormBuilder = inject(UntypedFormBuilder);
  changeDetectorRef: ChangeDetectorRef =  inject(ChangeDetectorRef);
  unsubscribeAll: Subject<any> = new Subject();
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
