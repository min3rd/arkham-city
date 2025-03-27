import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as featherIcons from '@ng-icons/feather-icons';

@Component({
  selector: 'navigation-basic-item',
  imports: [CommonModule, NgIcon],
  templateUrl: './basic-item.component.html',
  providers: [provideIcons({ ...featherIcons })],
})
export class BasicItem implements OnInit {
  @Input() id!: string;
  @Input() icon!: string;
  @Input() label!: string;
  @Input() badge!: string;
  @Input() activated!: boolean;
  ngOnInit(): void {}
}
