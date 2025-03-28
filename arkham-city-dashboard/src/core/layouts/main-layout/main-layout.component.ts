import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  type OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArkSwitchTheme } from '../../components/buttons/ark-switch-theme/ark-switch-theme.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as feathers from '@ng-icons/feather-icons';
import { TranslocoModule } from '@jsverse/transloco';
import { ArkNavigation } from '../../components/navigation/navigation.component';
import { NavigationItem } from '../../components/navigation/navigation.type';
import { ArkLoading } from '../../components/loading/loading.component';
import { ArkButton } from '../../components/buttons/ark-button/ark-button.component';
import { ArkSelect } from '../../components/selects/ark-select/ark-select.component';
import { ArkUser } from '../../components/users/ark-user/ark-user.component';
import { User } from '../../auth/auth.type';
import { AuthService } from '../../auth/auth.service';
import { Subject } from 'rxjs';

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
    ArkButton,
    ArkSelect,
    ArkUser,
  ],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ ...feathers })],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
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
  items: string[] = ['Project 1', 'Project 2'];
  user!: User | null;
  private authService: AuthService = inject(AuthService);
  private _unsubscribeAll: Subject<any> = new Subject();
  ngOnInit(): void {
    this.user = this.authService.user;
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
