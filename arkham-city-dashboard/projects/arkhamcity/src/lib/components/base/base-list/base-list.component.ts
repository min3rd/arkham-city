import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'base-list-component',
  imports: [],
  templateUrl: './base-list.component.html',
})
export class BaseListComponent implements OnInit, OnDestroy {
  unsubscribeAll = new Subject<any>();
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
