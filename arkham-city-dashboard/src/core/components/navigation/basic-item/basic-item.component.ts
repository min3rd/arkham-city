import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  type OnInit,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as featherIcons from '@ng-icons/feather-icons';
import { NavigationItem } from '../navigation.type';
import { TranslocoModule } from '@jsverse/transloco';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ark-navigation-basic-item',
  imports: [CommonModule, TranslocoModule, RouterModule, NgIcon],
  templateUrl: './basic-item.component.html',
  providers: [provideIcons({ ...featherIcons })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArkNavigationBasicItem implements OnInit, OnDestroy {
  @Input() navigation!: NavigationItem;
  activated: boolean = false;
  private router: Router = inject(Router);
  private changeDectectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _unsubscribeAll: Subject<any> = new Subject();
  ngOnInit(): void {
    if (this.router.url === this.navigation.link) {
      this.activated = true;
      this.changeDectectorRef.markForCheck();
    }
    this.router.events
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe((e) => {
        if (e.url === this.navigation.link) {
          this.activated = true;
          this.changeDectectorRef.markForCheck();
        } else {
          this.activated = false;
          this.changeDectectorRef.markForCheck();
        }
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
