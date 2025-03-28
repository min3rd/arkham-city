import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArkSwitchTheme } from '../../components/buttons/ark-switch-theme/ark-switch-theme.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as feathers from '@ng-icons/feather-icons';
import { TranslocoModule } from '@jsverse/transloco';
import { ArkNavigation } from '../../components/navigation/navigation.component';
import { NavigationItem } from '../../components/navigation/navigation.type';
import { ArkLoading } from '../../components/loading/loading.component';

@Component({
  selector: 'main-layout',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    ArkSwitchTheme,
    NgIcon,
    ArkNavigation,
    ArkLoading,
  ],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ ...feathers })],
})
export class MainLayoutComponent implements OnInit {
  navigations: NavigationItem[] = [
    {
      id: 'dashboard',
      title: 'dashboard',
      icon: 'featherHome',
      type: 'basic',
      link: '/dashboard',
    },
    {
      id: 'firestore',
      title: 'firestore',
      icon: 'featherDatabase',
      type: 'basic',
      link: '/firestore',
    },
    {
      id: 'storage',
      title: 'storage',
      icon: 'featherHardDrive',
      type: 'basic',
    },
    {
      id: 'realtime',
      title: 'realtime',
      icon: 'featherCloud',
      type: 'basic',
    },
    {
      id: 'tracking',
      title: 'tracking',
      icon: 'featherCrosshair',
      type: 'basic',
    },
    {
      id: 'setting',
      title: 'setting',
      icon: 'featherSettings',
      type: 'group',
      children: [
        {
          id: 'general',
          title: 'general',
          type: 'basic',
        },
      ],
    },
  ];
  ngOnInit(): void {}
}
