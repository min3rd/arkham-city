import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { AppResDto } from '../app.types';
import { AppService } from '../app.service';
import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import {
  ArkDrawerContainer,
} from '../../../../../../projects/arkhamcity/src/lib/components/drawers/ark-drawer-container/ark-drawer-container.component';
import {
  ArkDrawer,
} from '../../../../../../projects/arkhamcity/src/lib/components/drawers/ark-drawer/ark-drawer.component';
import {
  ArkDrawerContent,
} from '../../../../../../projects/arkhamcity/src/lib/components/drawers/ark-drawer-content/ark-drawer-content.component';
import { BaseFormComponent } from '../../../../../../projects/arkhamcity/src/lib/components/base/base-form.component';

@Component({
  selector: 'project-app-list',
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
export class ListComponent extends BaseFormComponent implements OnInit {
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
