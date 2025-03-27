import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArkSwitchTheme } from '../../components/buttons/ark-switch-theme/ark-switch-theme.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as feathers from '@ng-icons/feather-icons';
import { BasicItem } from '../../components/navigation/basic-item/basic-item.component';
import { TranslocoModule } from '@jsverse/transloco';
import { GroupItem } from '../../components/navigation/group-item/group-item.component';

@Component({
  selector: 'main-layout',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    ArkSwitchTheme,
    NgIcon,
    BasicItem,
    GroupItem,
  ],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ ...feathers })],
})
export class MainLayoutComponent implements OnInit {
  children: any[] = [
    {
      label: 'Sub 1',
    },
    {
      label: 'Sub 2',
    },
  ];
  ngOnInit(): void {}
}
