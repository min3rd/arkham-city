import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, type OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'base-component',
  imports: [CommonModule],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent implements OnInit, OnDestroy {
  form!: UntypedFormGroup;
  formBuilder: UntypedFormBuilder = inject(UntypedFormBuilder);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  router: Router = inject(Router);
  unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
