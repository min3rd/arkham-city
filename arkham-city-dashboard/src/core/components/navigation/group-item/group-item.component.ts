import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, type OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as featherIcons from '@ng-icons/feather-icons';
import { ArkNavigationBasicItem } from '../basic-item/basic-item.component';
import { NavigationItem } from '../navigation.type';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'ark-navigation-group-item',
  imports: [
    CommonModule,
    TranslocoModule,
    NgIcon,
    ArkNavigationBasicItem,
    forwardRef(() => ArkNavigationGroupItem),
  ],
  templateUrl: './group-item.component.html',
  providers: [provideIcons({ ...featherIcons })],
})
export class ArkNavigationGroupItem implements OnInit {
  @Input() navigation!: NavigationItem;
  ngOnInit(): void {}
}
