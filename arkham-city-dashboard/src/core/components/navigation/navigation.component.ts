import { Component, Input, type OnInit } from '@angular/core';
import { NavigationItem } from './navigation.type';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { BasicItem } from './basic-item/basic-item.component';
import { GroupItem } from './group-item/group-item.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'navigation-sidebar',
  imports: [CommonModule, TranslocoModule, NgIcon, BasicItem, GroupItem],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
  @Input() items: NavigationItem[] = [];
  ngOnInit(): void {}
}
