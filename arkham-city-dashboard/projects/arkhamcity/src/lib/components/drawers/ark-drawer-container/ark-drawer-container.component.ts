import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  OnInit,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { ArkDrawerContent } from '../ark-drawer-content/ark-drawer-content.component';
import { ArkDrawer } from '../ark-drawer/ark-drawer.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ark-drawer-container',
  exportAs: 'arkDrawerContainer',
  imports: [CommonModule],
  templateUrl: './ark-drawer-container.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ArkDrawerContainer implements OnInit, AfterContentInit {
  @ContentChildren(ArkDrawer) _allDrawers!: QueryList<ArkDrawer>;
  @ContentChildren(ArkDrawerContent) _allContents!: QueryList<ArkDrawerContent>;
  @ContentChild(ArkDrawerContent) _content!: ArkDrawerContent;

  position: 'start' | 'end' | string = 'start';
  mode: 'side' | 'over' | string = 'side';
  opened = true;

  private _unsubscribedAll: Subject<any> = new Subject<any>();

  ngOnInit() {
    
  }

  ngAfterContentInit() {
    this._allDrawers.forEach((drawer) => {
      drawer.openedChanged.pipe(takeUntil(this._unsubscribedAll)).subscribe((opened) => {
        this.opened = opened;
      });
      drawer.modeChanged.pipe(takeUntil(this._unsubscribedAll)).subscribe((mode) => {
        this.mode = mode;
      });
      drawer.positionChanged.pipe(takeUntil(this._unsubscribedAll)).subscribe((position) => {
        this.position = position;
      });
    });
  }

}
