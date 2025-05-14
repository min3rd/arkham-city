import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { ArkDrawerContent } from '../ark-drawer-content/ark-drawer-content.component';
import { ArkDrawer } from '../ark-drawer/ark-drawer.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ark-drawer-container',
  exportAs: 'arkDrawerContainer',
  imports: [CommonModule, ArkDrawerContent],
  templateUrl: './ark-drawer-container.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ArkDrawerContainer implements AfterContentInit {
  @ContentChildren(ArkDrawer) _allDrawers!: QueryList<ArkDrawer>;
  @ContentChild(ArkDrawerContent) _content!: ArkDrawerContent;
  @ViewChildren(ArkDrawerContent) _userContent!: ArkDrawerContent;

  openedDrawers: boolean[] = [];

  private _unsubscribedAll: Subject<any> = new Subject<any>();

  ngAfterContentInit() {
    this._allDrawers.forEach((drawer) => {
      drawer.openedChanged.pipe(takeUntil(this._unsubscribedAll)).subscribe((opened) => {
        console.log(opened);
      });
    });
  }

}
