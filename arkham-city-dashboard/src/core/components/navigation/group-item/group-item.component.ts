import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, type OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as featherIcons from '@ng-icons/feather-icons';
import { BasicItem } from '../basic-item/basic-item.component';
import { NavigationItem } from '../navigation.type';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'navigation-group-item',
  imports: [
    CommonModule,
    TranslocoModule,
    NgIcon,
    BasicItem,
    forwardRef(() => GroupItem),
  ],
  templateUrl: './group-item.component.html',
  providers: [provideIcons({ ...featherIcons })],
})
export class GroupItem implements OnInit {
  @Input() navigation!: NavigationItem;
  ngOnInit(): void {}
}
