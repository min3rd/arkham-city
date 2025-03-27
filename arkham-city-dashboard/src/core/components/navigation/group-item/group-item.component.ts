import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as featherIcons from '@ng-icons/feather-icons';
import { BasicItem } from '../basic-item/basic-item.component';

@Component({
  selector: 'navigation-group-item',
  imports: [CommonModule, NgIcon, BasicItem],
  templateUrl: './group-item.component.html',
  providers: [provideIcons({ ...featherIcons })],
})
export class GroupItem implements OnInit {
  @Input() id!: string;
  @Input() icon!: string;
  @Input() label!: string;
  @Input() children!: any[];
  ngOnInit(): void {}
}
