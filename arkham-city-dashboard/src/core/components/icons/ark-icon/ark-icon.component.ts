import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as featherIcons from '@ng-icons/feather-icons';

@Component({
  selector: 'ark-icon',
  imports: [CommonModule, NgIcon],
  templateUrl: './ark-icon.component.html',
  providers: [provideIcons({ ...featherIcons })],
})
export class ArkIcon implements OnInit {
  @Input() name!: string;
  ngOnInit(): void {}
}
