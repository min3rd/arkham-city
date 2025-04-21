import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { ArkIcon } from '../../icons/ark-icon/ark-icon.component';

export interface ArkTabTitle {
  id: string;
  title: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'ark-tab-group',
  imports: [CommonModule, ArkIcon],
  templateUrl: './ark-tab-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArkTabGroup implements OnInit, OnDestroy {
  @Input() titles!: ArkTabTitle[];
  @Input() color: 'gray' | 'teal' | 'blue' | 'red' | 'yellow' | 'white' = 'teal';
  selectedIndex = 0;
  private _unsubscribeAll = new Subject<any>();

  ngOnInit() {

  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
