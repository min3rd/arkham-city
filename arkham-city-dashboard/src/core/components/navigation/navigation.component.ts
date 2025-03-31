import { Component, Input } from '@angular/core';
import { NavigationItem } from './navigation.type';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ArkNavigationBasicItem } from './basic-item/basic-item.component';
import { ArkNavigationGroupItem } from './group-item/group-item.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'ark-navigation-sidebar',
  imports: [
    CommonModule,
    TranslocoModule,
    NgIcon,
    ArkNavigationBasicItem,
    ArkNavigationGroupItem,
  ],
  templateUrl: './navigation.component.html',
})
export class ArkNavigation {
  @Input() items: NavigationItem[] = [];
}
