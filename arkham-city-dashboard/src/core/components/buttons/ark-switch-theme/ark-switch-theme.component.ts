import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { featherMoon, featherSun } from '@ng-icons/feather-icons';

@Component({
  selector: 'ark-switch-theme',
  imports: [CommonModule, NgIcon],
  templateUrl: './ark-switch-theme.component.html',
  providers: [provideIcons({ featherSun, featherMoon })],
})
export class ArkSwitchTheme implements OnInit {
  ngOnInit(): void {}
}
