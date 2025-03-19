import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  type OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'base-component',
  imports: [],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent implements OnInit, OnDestroy {
  unsubscribeAll: Subject<any> = new Subject();
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
