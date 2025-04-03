import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { AppResDto } from '../app.type';
import { BaseComponent } from '../../../../../core/components/base/base.component';
import { AppService } from '../app.service';
import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ArkDrawerContainer } from '../../../../../core/components/drawers/ark-drawer-container/ark-drawer-container.component';
import { ArkDrawer } from '../../../../../core/components/drawers/ark-drawer/ark-drawer.component';
import { ArkDrawerContent } from '../../../../../core/components/drawers/ark-drawer-content/ark-drawer-content.component';

@Component({
  selector: 'app-list',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    ArkDrawerContainer,
    ArkDrawer,
    ArkDrawerContent,
  ],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends BaseComponent {
  apps!: AppResDto[] | null;
  selected!: AppResDto | null;

  @ViewChild('drawer', { static: true }) drawer!: ArkDrawer;
  private appService: AppService = inject(AppService);
  override ngOnInit(): void {
    super.ngOnInit();
    this.appService.apps$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((apps: AppResDto[] | null) => {
        this.apps = apps;
        this.changeDetectorRef.markForCheck();
      });
    this.appService.app$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((app: AppResDto | null) => {
        this.selected = app;
        this.changeDetectorRef.markForCheck();
      });
  }
}
